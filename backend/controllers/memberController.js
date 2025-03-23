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

  const { name, img_url, phone, email } = req.body;

  try {
    // Cek jika email atau nomor hp sudah ada
    const existingEmail = await prisma.members.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({ message: "Request Tidak Valid" });
    }

    if (phone) {
      const existingPhoneNo = await prisma.members.findUnique({
        where: { phone_no: phone },
      });

      if (existingPhoneNo) {
        return res.status(409).json({ message: "Request Tidak Valid" });
      }
    }

    // Buat user baru
    await prisma.members.create({
      data: {
        name,
        img_url,
        phone_no : phone || null,
        email,
      }
    });

    res
      .status(201)
      .json({ message: "Member berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menambahkan member" });
  }
};

// Get all members
export const getMemberControllers = async (req, res) => {
  try {
    const members = await prisma.members.findMany();
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data member" });
  }
};

// Delete a member
export const deleteMemberControllers = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.members.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Member berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus member" });
  }
};

export const updateMemberControllers = async (req, res) => {
  const { id } = req.params;
  const { name, phone_no } = req.body;

  try {
    // Cek jika nomor telepon sudah ada dan bukan milik member yang sedang diupdate
    if (phone_no) {
      const existingPhoneNo = await prisma.members.findUnique({
        where: { phone_no },
      });

      if (existingPhoneNo && existingPhoneNo.id !== parseInt(id)) {
        return res.status(409).json({ message: "Nomor telepon sudah digunakan oleh member lain" });
      }
    }

    await prisma.members.update({
      where: { id: parseInt(id) },
      data: {
        name,
        phone_no
      },
    });
    res.status(200).json({ message: "Member berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengupdate member" });
  }
}

// import { prisma } from "../db/prisma/prisma.js";

// export const templateControllers = async (req, res) => {
//     try {
//       const members = await prisma.members.findMany();
//       res.status(200).json(members);
//     } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
//   };

// export const getUsers = async (req, res) => {
//   try {
//     const users = await prisma.users.findMany();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// }

// export const deleteMemberControllers = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.members.delete({
//       where: { id: parseInt(id) },
//     });
//     res.status(200).json({ message: "Member berhasil dihapus" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Terjadi kesalahan saat menghapus member" });
//   }
// };