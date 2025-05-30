import { PrismaClient } from "@prisma/client";

class ExtendedPrismaClient extends PrismaClient {
  constructor() {
    super();

    // Helper to merge with AND
    const andNotAdmin = (where = {}) => {
      const notAdmin = { role: { not: 'admin' } };
      if (Object.keys(where).length === 0) return notAdmin;
      if (where.AND) {
        return { ...where, AND: [notAdmin, ...[].concat(where.AND)] };
      }
      return { AND: [notAdmin, where] };
    };

    // Patch all relevant user model methods
    const patchMethod = (method) => {
      const original = this.users[method].bind(this.users);
      this.users[method] = (args = {}) => {
        args.where = andNotAdmin(args.where);
        return original(args);
      };
    };

    // Patch findMany, count, findFirst, findUnique, etc.
    ['findMany', 'count', 'findFirst', 'findUnique', 'findFirstOrThrow', 'findUniqueOrThrow'].forEach(patchMethod);
  }
}

export const prisma = new ExtendedPrismaClient({
  omit: {
    users: {
      password: true
    }
  }
});
