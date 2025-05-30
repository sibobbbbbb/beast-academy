import { vi } from 'vitest'

// Setup environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key'
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud'
process.env.CLOUDINARY_API_KEY = 'test-api-key'
process.env.CLOUDINARY_API_SECRET = 'test-api-secret'
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

// Mock Prisma Client
export const mockPrisma = {
  users: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  events: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  liked_by: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    findMany: vi.fn(),
  },
  training_assignments: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  trained_by: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  user_activity_score: {
    create: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  activity_config: {
    findUnique: vi.fn(),
    createMany: vi.fn(),
  },
  $transaction: vi.fn(),
  $executeRaw: vi.fn(),
}

// Helper functions
export const createMockReq = (body = {}, params = {}, query = {}, user = null, file = null, cookies = {}) => ({
  body,
  params,
  query,
  user,
  file,
  cookies,
})

export const createMockRes = () => {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
    cookie: vi.fn(() => res),
    clearCookie: vi.fn(() => res),
  }
  return res
}

// Mock console untuk test yang lebih bersih
global.console.error = vi.fn()
global.console.warn = vi.fn()