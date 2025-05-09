import { PrismaClient } from "@prisma/client";

class ExtendedPrismaClient extends PrismaClient {
  constructor() {
    super();

    // Override users.findMany
    const originalFindMany = this.users.findMany.bind(this.users);
    this.users.findMany = (args = {}) => {
      args.where = {
        ...args.where,
        role: { not: 'admin' }
      };
      return originalFindMany(args);
    };

    // Override users.count
    const originalCount = this.users.count.bind(this.users);
    this.users.count = (args = {}) => {
      args.where = {
        ...args.where,
        role: { not: 'admin' }
      };
      return originalCount(args);
    };
  }
}


export const prisma = new ExtendedPrismaClient({
    omit: {
      users: {
        password: true
      }
    }
})
