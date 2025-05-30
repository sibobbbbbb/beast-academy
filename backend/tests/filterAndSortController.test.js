import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createMockReq, createMockRes, mockPrisma } from './setup.js'

// Mock all dependencies BEFORE importing controllers
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrisma),
  Prisma: {
    PrismaClientValidationError: class PrismaClientValidationError extends Error {
      constructor(message) {
        super(message)
        this.name = 'PrismaClientValidationError'
      }
    }
  }
}))

vi.mock('../db/prisma/prisma.js', () => ({
  prisma: mockPrisma
}))

// Import controller functions setelah mock
const { getMembers } = await import('../controllers/filterAndSortController.js')

describe('Filter and Sort Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMembers', () => {
    test('should get members with default pagination for admin', async () => {
      const req = createMockReq({}, {}, {}, { role: 'admin', userId: 1 })
      const res = createMockRes()

      const mockMembers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'member',
          created_at: new Date('2024-01-01'),
          trained_by_trained_by_member_idTousers: [],
          trained_by_trained_by_trainer_idTousers: [],
          activity_score: 0
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'trainer',
          created_at: new Date('2024-01-02'),
          trained_by_trained_by_member_idTousers: [],
          trained_by_trained_by_trainer_idTousers: [],
          activity_score: 0
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockMembers)
      mockPrisma.users.count.mockResolvedValue(2)

      await getMembers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { created_at: 'asc' },
        skip: 0,
        take: 10, // actual default limit in controller
        include: expect.any(Object)
      })

      expect(mockPrisma.users.count).toHaveBeenCalledWith({
        where: {}
      })

      expect(res.json).toHaveBeenCalledWith({
        data: mockMembers,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      })
    })

    test('should get members with search filter', async () => {
      const req = createMockReq({}, {}, {
        search: 'john',
        page: '1',
        limit: '5'
      }, { role: 'admin', userId: 1 })
      const res = createMockRes()

      const mockMembers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'member',
          activity_score: 0
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockMembers)
      mockPrisma.users.count.mockResolvedValue(1)

      await getMembers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: { 
          AND: [
            { 
              OR: [
                { name: { contains: 'john', mode: 'insensitive' } },
                { email: { contains: 'john', mode: 'insensitive' } },
                { phone_no: { contains: 'john', mode: 'insensitive' } }
              ]
            }
          ]
        },
        orderBy: { created_at: 'asc' },
        skip: 0,
        take: 5,
        include: expect.objectContaining({
          trained_by_trained_by_member_idTousers: expect.anything(),
          trained_by_trained_by_trainer_idTousers: expect.anything(),
          user_activity_scores: expect.anything()
        })
      })

      expect(res.json).toHaveBeenCalledWith({
        data: mockMembers,
        pagination: {
          total: 1,
          page: 1,
          limit: 5,
          totalPages: 1
        }
      })
    })

    test('should get members with role filter', async () => {
      const req = createMockReq({}, {}, {
        filterBy: 'trainer',
        sortBy: 'name',
        order: 'desc'
      }, { role: 'admin', userId: 1 })
      const res = createMockRes()

      const mockTrainers = [
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'trainer'
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockTrainers)
      mockPrisma.users.count.mockResolvedValue(1)

      await getMembers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: { 
          AND: [ // <-- Tambahkan bungkus AND
            { role: 'trainer' }
          ]
        },
        orderBy: { name: 'desc' },
        skip: 0,
        take: 10,
        include: expect.any(Object) // <-- Gunakan ini
      });
    })

    test('should get trainer members for trainer role', async () => {
      const req = createMockReq({}, {}, {}, { role: 'trainer', userId: 1 })
      const res = createMockRes()

      const mockTrainerMembers = [
        {
          id: 3,
          name: 'Student One',
          email: 'student1@example.com',
          role: 'member',
          trained_by_trained_by_member_idTousers: [
            {
              trainer_id: 1,
              member_id: 3,
              users_trained_by_trainer_idTousers: {
                id: 1,
                name: 'Trainer One'
              }
            }
          ]
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockTrainerMembers)
      mockPrisma.users.count.mockResolvedValue(1)

      await getMembers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {
          trained_by_trained_by_member_idTousers: {
            some: {
              trainer_id: 1
            }
          }
        },
        orderBy: { created_at: 'asc' },
        skip: 0,
        take: 10, // default limit
        include: expect.any(Object) 
      })
    })

    test('should get trainer members with search and filter', async () => {
      const req = createMockReq({}, {}, {
        search: 'student',
        filterBy: 'member'
      }, { role: 'trainer', userId: 1 })
      const res = createMockRes()

      const mockMembers = [
        {
          id: 3,
          name: 'Student One',
          email: 'student1@example.com',
          role: 'member'
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockMembers)
      mockPrisma.users.count.mockResolvedValue(1)

      await getMembers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {
          AND: [
            { role: 'member' },
            {
              OR: [
                { name: { contains: 'student', mode: 'insensitive' } },
                { email: { contains: 'student', mode: 'insensitive' } },
                { phone_no: { contains: 'student', mode: 'insensitive' } }
              ]
            }
          ],
          trained_by_trained_by_member_idTousers: {
            some: {
              trainer_id: 1
            }
          }
        },
        orderBy: { created_at: 'asc' },
        skip: 0,
        take: 10,
        include: expect.any(Object)
      })
    })

    test('should handle pagination correctly', async () => {
      const req = createMockReq({}, {}, {
        page: '2',
        limit: '5'
      }, { role: 'admin', userId: 1 })
      const res = createMockRes()

      const mockMembers = [
        {
          id: 6,
          name: 'User Six',
          email: 'user6@example.com',
          activity_score: 0
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockMembers)
      mockPrisma.users.count.mockResolvedValue(12)

      await getMembers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { created_at: 'asc' },
        skip: 5, // (page 2 - 1) * limit 5
        take: 5,
        include: expect.any(Object)
      })

      expect(res.json).toHaveBeenCalledWith({
        data: mockMembers,
        pagination: {
          total: 12,
          page: 2,
          limit: 5,
          totalPages: 3 // Math.ceil(12/5)
        }
      })
    })

    test('should return error for invalid sortBy field', async () => {
      const req = createMockReq({}, {}, {
        sortBy: 'invalid_field'
      }, { role: 'admin', userId: 1 })
      const res = createMockRes()

      await getMembers(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid sortBy field'
      })
    })

    test('should return error for invalid order value', async () => {
      const req = createMockReq({}, {}, {
        order: 'invalid_order'
      }, { role: 'admin', userId: 1 })
      const res = createMockRes()

      await getMembers(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid order value'
      })
    })

    test('should handle database error', async () => {
      const req = createMockReq({}, {}, {}, { role: 'admin', userId: 1 })
      const res = createMockRes()

      mockPrisma.users.findMany.mockRejectedValue(new Error('Database connection failed'))

      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await getMembers(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching members:', expect.any(Error))
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      })

      consoleErrorSpy.mockRestore()
    })

    test('should use default pagination values for invalid input', async () => {
      const req = createMockReq({}, {}, {
        page: 'invalid',
        limit: 'invalid'
      }, { role: 'admin', userId: 1 })
      const res = createMockRes()

      const mockMembers = []
      mockPrisma.users.findMany.mockResolvedValue(mockMembers)
      mockPrisma.users.count.mockResolvedValue(0)

      await getMembers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { created_at: 'asc' },
        skip: 0, // default page 1
        take: 10, // default limit 10
        include: expect.any(Object)
      })

      expect(res.json).toHaveBeenCalledWith({
        data: mockMembers,
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      })
    })
  })
})