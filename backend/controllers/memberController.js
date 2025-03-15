import { prisma } from "../db/prisma/prisma.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

// Add a new member
export const addMemberControllers = async (req, res) => {
  // Validasi data masuk
  await Promise.all([
    body("email").isEmail().withMessage("Format email tidak valid").run(req),
    body("phone_no")
      .optional()
      .isMobilePhone()
      .withMessage("Nomor telepon tidak valid")
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, img_url, phone_no, email } = req.body;

  try {
    // Cek jika email atau nomor hp sudah ada
    const existingEmail = await prisma.members.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({ message: "Request Tidak Valid" });
    }

    if (phone_no) {
      const existingPhoneNo = await prisma.members.findUnique({
        where: { phone_no },
      });

      if (existingPhoneNo) {
        return res.status(409).json({ message: "Request Tidak Valid" });
      }
    }

    // Buat user baru
    const newUser = await prisma.members.create({
      data: {
        name,
        img_url,
        phone_no : phone_no || null,
        email,
      }
    });

    res
      .status(201)
      .json({ message: "Member berhasil ditambahkan", data: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menambahkan member" });
  }
};