import { prisma } from "../db/prisma/prisma.js";

export const templateControllers = async (req, res) => {
    try {
      const users = await prisma.users.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };