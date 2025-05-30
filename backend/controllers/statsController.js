// stats.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStats = async (req, res) => {
  try {
    // count users with role = 'member'
    const membersCount = await prisma.users.count({
      where: { role: "member" }
    });

    // count users with role = 'trainer'
    const trainersCount = await prisma.users.count({
      where: { role: "trainer" }
    });

    // count all events
    const eventsCount = await prisma.events.count();

    return res.json({
      membersCount,
      trainersCount,
      eventsCount
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
