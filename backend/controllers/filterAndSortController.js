import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMembers = async (req, res) => {
  try {
    const { search = "", sortBy = "created_at", order = "asc", page = "1", limit = "10", filterBy = "" } = req.query;

    const validSortFields = ["created_at", "email", "phone_no", "last_activity"];
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

    
    const whereCondition = {};

    if (filterBy) {
      whereCondition.users = { role: filterBy }; 
    }

    if (search) {
      whereCondition.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { phone_no: { contains: search, mode: "insensitive" } },
      ];
    }

    const members = await prisma.members.findMany({
      where: whereCondition,
      orderBy: { [sortBy]: order },
      skip: offset,
      take: limitNumber,
      include: {
        users: true, 
      },
    });

    const totalMembers = await prisma.members.count({
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
