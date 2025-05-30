// stats.js
import { prisma } from "../db/prisma/prisma.js";


export const getStats = async (req, res) => {

  // Add this temporarily to see what roles exist

  try {
    // count users with role = 'member'
const membersCount = await prisma.users.count({
  where:{ 
    role: 'member'
  }
});

const trainersCount = await prisma.users.count({
  where:{ 
    role: 'trainer'
  }
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

export const getTrainerStats = async (req, res) => {
  const trainerId = parseInt(req.params.trainerId, 10);

    console.log(`${trainerId} requested`)

  if (isNaN(trainerId)) {
    return res.status(400).json({ message: "Invalid trainer ID" });
  }

  try {
    // 1) Count of students: users related via the trained_by join
    const studentsCount = await prisma.users.count({
      where: {
        trained_by_trained_by_member_idTousers: {
          some: { trainer_id: trainerId }
        }
      }
    });

    // 2) Total notes given by this trainer
    //    (Adjust model name `notes` and field names if your schema differs)
    const notesGiven = await prisma.training_assignments.count({
      where: { trainer_id: trainerId }
    });

    // 3) Count of active notes (assuming a boolean `active` field)
    const activeNotes = await prisma.training_assignments.count({
      where: {
        trainer_id: trainerId,
        status: "active"
      }
    });

    return res.json({ studentsCount, notesGiven, activeNotes });
  } catch (error) {
    console.error("Error fetching trainer stats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
