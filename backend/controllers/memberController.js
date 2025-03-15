import { prisma } from "../db/prisma/prisma.js";
import bcrypt from "bcryptjs";
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
  const { name } = req.body;

  try {
    await prisma.members.update({
      where: { id: parseInt(id) },
      data: {
        name
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