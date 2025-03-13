import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMembers = async (req, res) => {
  try{
    const{ search="", sortBy="", order="", page="", limit="", filterBy=""} = req.query;

    const validSortFields = ["name", "join_date"]
    const validOrderValues = ["asc","desc"]
    
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sortBy field" });
    }
    if (!validOrderValues.includes(order)) {
      return res.status(400).json({ message: "Invalid order value" });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const whereCondition = {};

    if (filterBy){
      whereCondition.role = filterBy;
    }

    if (search){
      whereCondition.name ={
        contains: search,
        mode: "insensitive",
      };
    }



    const members = await prisma.member.findMany({
      where : whereCondition,
      orderBy: {[sortBy] : order,},
      offset,
      take: limitNumber
    });

    const totalMember = await prisma.member.count({
      where: whereCondition,
    })

    res.json({
      data : members,
      pagination: {
        total: totalMember,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalMember/ limitNumber),
      },
    });

  } catch(error){
    console.error("Errro fetching member:", error);
    res.status(500).json({message: "Internal Server Error"})
  }
}