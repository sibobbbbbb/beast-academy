import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma/prisma";

export const getMembers = async (req, res) => {
  try {
    const { search = "", sortBy = "created_at", order = "asc", page = "1", limit = "10", filterBy = "" } = req.query;
    // Ambil role dan userId dari token yang sudah diverifikasi
    const { role, userId } = req.user;

    console.log(`Filter by : ${filterBy}`)

    // Field yang valid untuk sorting
    const validSortFields = ["created_at", "email", "phone_no", "last_activity", "name", "id", "activity_score"];
    const validOrderValues = ["asc", "desc"];

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sortBy field" });
    }
    if (!validOrderValues.includes(order)) {
      return res.status(400).json({ message: "Invalid order value" });
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    let whereClauses = [];

    // Role filter
    if (filterBy) {
      whereClauses.push({ role: filterBy });
    }

    // Search filter
    if (search) {
      whereClauses.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone_no: { contains: search, mode: "insensitive" } },
        ]
      });
    }

    // Build whereCondition from AND clauses
    let whereCondition = whereClauses.length > 0 ? { AND: whereClauses } : {};

    // Jika role adalah trainer, filter member yang dilatih oleh trainer tersebut
    if (role === "trainer") {
      // Kita perlu menambahkan filter untuk trainer
      const trainerFilter = {
        trained_by_trained_by_member_idTousers: {
          some: {
            trainer_id: parseInt(userId)
          }
        }
      };
    
      // Gabungkan dengan whereCondition yang sudah ada
      if (whereCondition.OR) {
        // Jika sudah ada OR condition (dari search), kita perlu mempertahankannya
        // dan menambahkan filter trainer pada level atas
        whereCondition = {
          AND: [
            { OR: whereCondition.OR },
            trainerFilter
          ]
        };
      } else {
        // Jika tidak ada OR condition, cukup gabungkan objek filter
        whereCondition = {
          ...whereCondition,
          ...trainerFilter
        };
      }
    }
    
    let orderByClause;
    if (sortBy === "activity_score") {
      // Urutkan berdasarkan kolom activity_score di relation user_activity_scores
      orderByClause = { user_activity_scores: { activity_score: order } };
    } else {
      orderByClause = { [sortBy]: order };
    }

    // Query untuk mendapatkan daftar members
    const rawMembers = await prisma.users.findMany({
      where: whereCondition,
      orderBy: orderByClause,
      skip: offset,
      take: limitNumber,
      include: {
        trained_by_trained_by_member_idTousers: {
          include: {
            users_trained_by_trainer_idTousers: true, // Include trainer data
          },
        },
        trained_by_trained_by_trainer_idTousers: {
          include: {
            users_trained_by_member_idTousers: true, // Include member data
          },
        },
        user_activity_scores: {
          select: { activity_score: true }
        },
      },
    });

    const members = rawMembers.map(({ user_activity_scores, ...user }) => ({
  ...user,
  activity_score: user_activity_scores?.activity_score ?? 0,
  }));

    // Menghitung total members yang memenuhi kondisi
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
    console.error("Error fetching members:", error)
  
    if (
      error instanceof Prisma.PrismaClientValidationError ||
      error.name === "PrismaClientValidationError"
    ) {
      return res.status(400).json({
        message: "Invalid query parameters",
        detail: error.message,
      })
    }
  
    res.status(500).json({ message: "Internal Server Error" })
  }
};


