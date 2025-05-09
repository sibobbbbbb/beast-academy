import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    omit: {
      users: {
        password: true
      }
    }
})
