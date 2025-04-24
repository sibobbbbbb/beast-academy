import { prisma } from "../db/prisma/prisma.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { upload } from '../middlewares/multerMiddleware.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add a new member
export const addMemberControllers = [
  upload,

  async (req, res) => {
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

    const { name, phone, email } = req.body;
    const img_file = req.file;

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

      if (!img_file) {
        return res.status(400).json({ message: "Request Tidak Valid" });
      }

      // Upload image to Cloudinary
      let cloudinaryUrl = null;
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream(
            { 
              folder: 'members', 
              transformation: [
                { quality: "auto", fetch_format: "auto" }
              ]
            }, 
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(img_file.buffer);
        });

        cloudinaryUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(400).json({ message: "Gagal mengunggah gambar" });
      }

      // Buat user baru
      await prisma.members.create({
        data: {
          name,
          img_url: cloudinaryUrl,
          phone_no: phone || null,
          email,
        },
      });

      res.status(201).json({ message: "Member berhasil ditambahkan" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menambahkan member" });
    }
  },
];

// Get all members
export const getMemberControllers = async (req, res) => {
  try {
    // Ambil role dan userId dari token yang sudah diverifikasi
    const { role, userId } = req.user;
    
    // Jika role adalah trainer, ambil member yang dilatih oleh trainer tersebut
    if (role === "trainer") {
      const members = await prisma.trained_by.findMany({
        where: { trainer_id: parseInt(userId) },
        include: {
          users: true,
        },
      });
      return res.status(200).json(members);
    } else {
      const members = await prisma.users.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      return res.status(200).json(members);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data member" });
  }
};

// Get member by id
export const getMemberByIdControllers = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data member" });
  }
};

// Delete a member
export const deleteMemberControllers = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Member berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus member" });
  }
};

export const updateMemberControllers = async (req, res) => {
  const { id } = req.params;
  const { name, phone_no } = req.body;

  try {
    // Cek jika nomor telepon sudah ada dan bukan milik member yang sedang diupdate
    if (phone_no) {
      const existingPhoneNo = await prisma.users.findUnique({
        where: { phone_no },
      });

      if (existingPhoneNo && existingPhoneNo.id !== parseInt(id)) {
        return res
          .status(409)
          .json({ message: "Nomor telepon sudah digunakan oleh member lain" });
      }
    }

    await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        name,
        phone_no,
      },
    });
    res.status(200).json({ message: "Member berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengupdate member" });
  }
};

export const getProfileControllers = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const id_member = await prisma.member_user.findFirst({
      where: { u_id: decoded.userId },
    });

    const member = await prisma.members.findUnique({
      where: { id: id_member.m_id },
    });

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data member" });
  }
};

export const updateProfileControllers = async (req, res) => {
  // Validasi
  await Promise.all([
    body("phone_no")
      .optional()
      .isMobilePhone()
      .withMessage("Nomor telepon tidak valid")
      .run(req),
  ]);

  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { name, phone_no } = req.body;
  const img_file = req.file;

  try {
    const m_id = await prisma.member_user.findFirst({
      where: { u_id: decoded.userId },
    });
    // Cek jika nomor telepon sudah ada dan bukan milik member yang sedang diupdate
    if (phone_no) {
      const existingPhoneNo = await prisma.members.findUnique({
        where: { phone_no },
      });

      if (existingPhoneNo && existingPhoneNo.id !== m_id.m_id) {
        return res
          .status(409)
          .json({ message: "Nomor telepon sudah digunakan oleh member lain" });
      }
    }

    if (name?.length > 100) {
      return res
        .status(400)
        .json({ error: "Nama tidak boleh lebih dari 100 karakter" });
    }

    if (phone_no?.length > 15) {
      return res
        .status(400)
        .json({ error: "Nomor telepon tidak boleh lebih dari 15 karakter" });
    }

    if (!name) {
      return res.status(400).json({ message: "Request Tidak Valid" });
    }

    if (!img_file) {
      await prisma.members.update({
        where: { id: m_id.m_id },
        data: {
          name,
          phone_no: phone_no === "" ? null : phone_no,
        },
      });
      await prisma.users.update({
        where: { id: decoded.userId },
        data: {
          username: name,
        },
      });
    } else {
      // Delete last image from Cloudinary
      const lastMemberData = await prisma.members.findFirst({
        where: { id: m_id.m_id },
      });

      const lastImgUrl = lastMemberData.img_url;
      if (!lastImgUrl || !lastImgUrl.includes('https://res.cloudinary.com/duemu25rz/image/upload/v1743012173/members/'))
      {
        try {
          const publicId = lastImgUrl.split("/").pop().split(".")[0];
          await cloudinary.v2.uploader.destroy(`members/${publicId}`);
        } catch (deleteError) {
          console.error("Failed to delete old image:", deleteError);
        }
      }
        
      // Upload image to Cloudinary
      let cloudinaryUrl = null;
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream(
            { 
              folder: 'members', 
              transformation: [
                { quality: "auto", fetch_format: "auto" }
              ]
            }, 
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(img_file.buffer);
        });

        cloudinaryUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(400).json({ message: "Gagal mengunggah gambar" });
      }
      
      await prisma.members.update({
        where: { id: m_id.m_id },
        data: {
          name,
          img_url: cloudinaryUrl,
          phone_no: phone_no === "" ? null : phone_no,
        },
      });

      await prisma.users.update({
        where: { id: decoded.userId },
        data: {
          username: name,
          avatar: cloudinaryUrl,
        },
      });
    }
    res.status(200).json({ message: "Profile berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengupdate profile" });
  }
};

export const checkPhoneNumberController = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { phone_no } = req.body;

  try {
    const existingPhoneNo = await prisma.members.findUnique({
      where: { phone_no },
    });

    const m_id = await prisma.member_user.findFirst({
      where: { u_id: decoded.userId },
    });

    if (existingPhoneNo && existingPhoneNo.id !== m_id.m_id) {
      return res.status(409).json({ isUsed: true });
    }

    res.status(200).json({ isUsed: false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memeriksa nomor telepon." });
  }
};
