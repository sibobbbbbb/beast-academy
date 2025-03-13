import { prisma } from "../db/prisma/prisma.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

// Add a new member
export const addMemberControllers = async (req, res) => {
  // Validasi data masuk
  await Promise.all([
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username minimal 3 karakter")
      .run(req),
    body("password")
      .isStrongPassword()
      .withMessage("Password harus kuat")
      .run(req),
    body("email").isEmail().withMessage("Format email tidak valid").run(req),
    body("phone_no")
      .isMobilePhone()
      .withMessage("Nomor telepon tidak valid")
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, phone_no, role } = req.body;

  try {
    // Cek jika username atau email ada
    const existingUser = await prisma.users.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Request Tidak Valid" });
    }

    const existingEmail = await prisma.members.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({ message: "Request Tidak Valid" });
    }

    const existingPhoneNo = await prisma.members.findUnique({
      where: { phone_no },
    });

    if (existingPhoneNo) {
      return res.status(409).json({ message: "Request Tidak Valid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: "member",
        members: {
          create: {
            email,
            phone_no,
          },
        },
      },
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