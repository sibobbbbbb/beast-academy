import { prisma } from "../db/prisma/prisma.js";

// Assign multiple members to a trainer
export const assignTrainer = async (req, res) => {
    const { trainerId, memberIds } = req.body;

    if (!Array.isArray(memberIds) || typeof trainerId !== "number") {
      return res.status(400).json({ message: "Invalid input format" });
    }

    try {
      const data = memberIds.map(memberId => ({
        trainer_id: trainerId,
        member_id: memberId,
      }));

      await prisma.trained_by.createMany({
        data,
        skipDuplicates: true,
      });

      res.status(200).json({ message: "Students assigned successfully" });
    } catch (error) {
      console.error("AssignTrainer error:", error);
      res.status(500).json({ message: "Failed to assign students" });
    }
  };

// Remove members from a trainer
export const removeStudents = async (req, res) => {
    const { trainerId, memberIds } = req.body;

    if (!Array.isArray(memberIds) || typeof trainerId !== "number") {
      return res.status(400).json({ message: "Invalid input format" });
    }

    try {
      await prisma.trained_by.deleteMany({
        where: {
          trainer_id: trainerId,
          member_id: { in: memberIds },
        },
      });

      res.status(200).json({ message: "Students removed successfully" });
    } catch (error) {
      console.error("RemoveStudents error:", error);
      res.status(500).json({ message: "Failed to remove students" });
    }
  };

// Fetch all students assigned to a trainer
export const getStudents = async (req, res) => {
    const { trainerId } = req.params;

    try {
      const students = await prisma.trained_by.findMany({
        where: { trainer_id: parseInt(trainerId) },
        include: {
          users: true, // Assuming this joins to the `users` model
        },
      });

      res.status(200).json(students);
    } catch (error) {
      console.error("GetStudents error:", error);
      res.status(500).json({ message: "Failed to retrieve students" });
    }
  };
