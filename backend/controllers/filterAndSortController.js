import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMembers = async (req, res) => {
  try {
    const { search = "", sortBy = "created_at", order = "asc", page = "1", limit = "10", filterBy = "" } = req.query;

    // Field yang valid untuk sorting
    const validSortFields = ["created_at", "email", "phone_no", "last_activity", "name", "id"];
    const validOrderValues = ["asc", "desc"];

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sortBy field" });
    }
    if (!validOrderValues.includes(order)) {
      return res.status(400).json({ message: "Invalid order value" });
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;
    const offset = (pageNumber - 1) * limitNumber;

    // Membuat kondisi pencarian dan filter
    const whereCondition = {};

    // Filter berdasarkan role (via relasi many-to-many dengan users)
    if (filterBy) {
      whereCondition.role = filterBy;
    }
    
    // Pencarian berdasarkan name, email, atau phone_no
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone_no: { contains: search, mode: "insensitive" } },
      ];
    }
    console.log(whereCondition, "WHERE CONDITION");

    // Query untuk mendapatkan daftar members
    // console.log(pageNumber, limitNumber, offset, "GET METRICS");
    const members = await prisma.users.findMany({
      where: whereCondition,
      orderBy: { [sortBy]: order },
      skip: offset,
      take: limitNumber,
      include: {
        member_user: {
          include: {
            users: true, // Menyertakan data users dalam hasil query
          },
        },
      },
    });

    // Menghitung total members
    const totalMembers = await prisma.users.count({
      where: whereCondition,
    });

    res.json({
      data: members,
      pagination: {
        total: totalMembers,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalMembers / limitNumber),
      },
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};