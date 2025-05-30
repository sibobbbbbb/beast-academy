import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createMockReq, createMockRes, mockPrisma } from './setup.js'

// Mock all dependencies BEFORE importing controllers
vi.mock('../db/prisma/prisma.js', () => ({
  prisma: mockPrisma
}))

// Import controller functions setelah mock
const {
  assignTrainer,
  removeStudents,
  getStudents
} = await import('../controllers/trainerAssignmentController.js')

describe('Trainer Assignment Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('assignTrainer', () => {
    test('should assign trainer to students successfully', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [2, 3, 4]
      })
      const res = createMockRes()

      mockPrisma.trained_by.createMany.mockResolvedValue({ count: 3 })

      await assignTrainer(req, res)

      expect(mockPrisma.trained_by.createMany).toHaveBeenCalledWith({
        data: [
          { trainer_id: 1, member_id: 2 },
          { trainer_id: 1, member_id: 3 },
          { trainer_id: 1, member_id: 4 }
        ],
        skipDuplicates: true
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Students assigned successfully'
      })
    })

    test('should assign single student to trainer', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [2]
      })
      const res = createMockRes()

      mockPrisma.trained_by.createMany.mockResolvedValue({ count: 1 })

      await assignTrainer(req, res)

      expect(mockPrisma.trained_by.createMany).toHaveBeenCalledWith({
        data: [
          { trainer_id: 1, member_id: 2 }
        ],
        skipDuplicates: true
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Students assigned successfully'
      })
    })

    test('should return error for invalid input format - memberIds not array', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: 'not-an-array'
      })
      const res = createMockRes()

      await assignTrainer(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid input format'
      })
    })

    test('should return error for invalid input format - trainerId not number', async () => {
      const req = createMockReq({
        trainerId: 'not-a-number',
        memberIds: [2, 3]
      })
      const res = createMockRes()

      await assignTrainer(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid input format'
      })
    })

    test('should return error for missing trainerId', async () => {
      const req = createMockReq({
        memberIds: [2, 3]
        // missing trainerId
      })
      const res = createMockRes()

      await assignTrainer(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid input format'
      })
    })

    test('should return error for missing memberIds', async () => {
      const req = createMockReq({
        trainerId: 1
        // missing memberIds
      })
      const res = createMockRes()

      await assignTrainer(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid input format'
      })
    })

    test('should handle database error', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [2, 3]
      })
      const res = createMockRes()

      mockPrisma.trained_by.createMany.mockRejectedValue(new Error('Database error'))

      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await assignTrainer(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith('AssignTrainer error:', expect.any(Error))
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to assign students'
      })

      consoleErrorSpy.mockRestore()
    })

    test('should handle duplicate assignment gracefully', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [2, 3]
      })
      const res = createMockRes()

      // Simulate partial success due to duplicates
      mockPrisma.trained_by.createMany.mockResolvedValue({ count: 1 })

      await assignTrainer(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Students assigned successfully'
      })
    })
  })

  describe('removeStudents', () => {
    test('should remove students from trainer successfully', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [2, 3]
      })
      const res = createMockRes()

      mockPrisma.trained_by.deleteMany.mockResolvedValue({ count: 2 })

      await removeStudents(req, res)

      expect(mockPrisma.trained_by.deleteMany).toHaveBeenCalledWith({
        where: {
          trainer_id: 1,
          member_id: { in: [2, 3] }
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Students removed successfully'
      })
    })

    test('should remove single student from trainer', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [2]
      })
      const res = createMockRes()

      mockPrisma.trained_by.deleteMany.mockResolvedValue({ count: 1 })

      await removeStudents(req, res)

      expect(mockPrisma.trained_by.deleteMany).toHaveBeenCalledWith({
        where: {
          trainer_id: 1,
          member_id: { in: [2] }
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Students removed successfully'
      })
    })

    test('should return error for invalid input format - memberIds not array', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: 'not-an-array'
      })
      const res = createMockRes()

      await removeStudents(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid input format'
      })
    })

    test('should return error for invalid input format - trainerId not number', async () => {
      const req = createMockReq({
        trainerId: 'not-a-number',
        memberIds: [2, 3]
      })
      const res = createMockRes()

      await removeStudents(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid input format'
      })
    })

    test('should handle database error', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [2, 3]
      })
      const res = createMockRes()

      mockPrisma.trained_by.deleteMany.mockRejectedValue(new Error('Database connection failed'))

      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await removeStudents(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith('RemoveStudents error:', expect.any(Error))
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to remove students'
      })

      consoleErrorSpy.mockRestore()
    })

    test('should handle removal of non-existent assignments', async () => {
      const req = createMockReq({
        trainerId: 1,
        memberIds: [999] // non-existent member
      })
      const res = createMockRes()

      mockPrisma.trained_by.deleteMany.mockResolvedValue({ count: 0 })

      await removeStudents(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Students removed successfully'
      })
    })
  })

  describe('getStudents', () => {
    test('should get students assigned to trainer successfully', async () => {
      const req = createMockReq({}, { trainerId: '1' })
      const res = createMockRes()

      const mockStudents = [
        {
          id: 2,
          name: 'Student 1',
          email: 'student1@example.com',
          role: 'member'
        },
        {
          id: 3,
          name: 'Student 2',
          email: 'student2@example.com',
          role: 'member'
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockStudents)

      await getStudents(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {
          trained_by_trained_by_member_idTousers: {
            some: {
              trainer_id: 1
            }
          }
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockStudents)
    })

    test('should return empty array if no students found', async () => {
      const req = createMockReq({}, { trainerId: '1' })
      const res = createMockRes()

      mockPrisma.users.findMany.mockResolvedValue([])

      await getStudents(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    test('should handle invalid trainerId parameter', async () => {
      const req = createMockReq({}, { trainerId: 'invalid' })
      const res = createMockRes()

      // This will cause parseInt to return NaN, which might cause database issues
      mockPrisma.users.findMany.mockRejectedValue(new Error('Invalid trainer ID'))

      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await getStudents(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith('GetStudents error:', expect.any(Error))
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve students'
      })

      consoleErrorSpy.mockRestore()
    })

    test('should handle database connection error', async () => {
      const req = createMockReq({}, { trainerId: '1' })
      const res = createMockRes()

      mockPrisma.users.findMany.mockRejectedValue(new Error('Database connection failed'))

      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await getStudents(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith('GetStudents error:', expect.any(Error))
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve students'
      })

      consoleErrorSpy.mockRestore()
    })

    test('should handle missing trainerId parameter', async () => {
      const req = createMockReq({}, {}) // no trainerId in params
      const res = createMockRes()

      // This should cause parseInt(undefined) which returns NaN
      mockPrisma.users.findMany.mockRejectedValue(new Error('Trainer ID is required'))

      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await getStudents(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith('GetStudents error:', expect.any(Error))
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve students'
      })

      consoleErrorSpy.mockRestore()
    })

    test('should get students with proper trainer relationship', async () => {
      const req = createMockReq({}, { trainerId: '2' })
      const res = createMockRes()

      const mockStudents = [
        {
          id: 5,
          name: 'Advanced Student',
          email: 'advanced@example.com',
          role: 'member',
          trained_by_trained_by_member_idTousers: [
            {
              trainer_id: 2,
              member_id: 5
            }
          ]
        }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockStudents)

      await getStudents(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {
          trained_by_trained_by_member_idTousers: {
            some: {
              trainer_id: 2
            }
          }
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockStudents)
    })
  })
})