import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createMockReq, createMockRes, mockPrisma } from './setup.js'

// Create mock functions
const mockRecalculateActivity = vi.fn()

// Mock all dependencies BEFORE importing controllers
vi.mock('../db/prisma/prisma.js', () => ({
  prisma: mockPrisma
}))

vi.mock('../controllers/activityController.js', () => ({
  recalculateActivity: mockRecalculateActivity
}))

// Import controller functions setelah mock
const {
  createNote,
  getMemberNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getTrainerNotes,
  getTrainerNotecountForPerson,
  checkTrainerAccess
} = await import('../controllers/notesController.js')

describe('Notes Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createNote', () => {
    test('should create note successfully', async () => {
      const req = createMockReq({
        memberId: 2,
        notes: 'Great progress in today\'s session'
      }, {}, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()

      const mockAssignment = {
        id: 1,
        trainer_id: 1,
        member_id: 2,
        notes: 'Great progress in today\'s session',
        status: 'active',
        start_date: new Date()
      }

      mockPrisma.training_assignments.create.mockResolvedValue(mockAssignment)
      mockRecalculateActivity.mockResolvedValue()

      await createNote(req, res)

      expect(mockPrisma.training_assignments.create).toHaveBeenCalledWith({
        data: {
          trainer_id: 1,
          member_id: 2,
          start_date: expect.any(Date),
          notes: 'Great progress in today\'s session',
          status: 'active'
        }
      })

      expect(mockRecalculateActivity).toHaveBeenCalledWith(2, true)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note created successfully',
        data: mockAssignment
      })
    })

    test('should return error if required fields missing', async () => {
      const req = createMockReq({
        memberId: 2
        // missing notes
      }, {}, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()

      await createNote(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Member ID and notes are required'
      })
    })

    test('should return error if memberId missing', async () => {
      const req = createMockReq({
        notes: 'Test notes'
        // missing memberId
      }, {}, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()

      await createNote(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Member ID and notes are required'
      })
    })

    test('should handle database error', async () => {
      const req = createMockReq({
        memberId: 2,
        notes: 'Test notes'
      }, {}, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()

      mockPrisma.training_assignments.create.mockRejectedValue(new Error('Database error'))

      await createNote(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' })
    })
  })

  describe('getMemberNotes', () => {
    test('should get member notes successfully', async () => {
      const req = createMockReq({}, { memberId: '2' })
      const res = createMockRes()

      const mockNotes = [
        {
          id: 1,
          trainer_id: 1,
          member_id: 2,
          notes: 'First note',
          created_at: new Date(),
          users_training_assignments_trainer_idTousers: {
            id: 1,
            username: 'trainer1',
            email: 'trainer@example.com',
            avatar: 'trainer-avatar.jpg'
          }
        },
        {
          id: 2,
          trainer_id: 1,
          member_id: 2,
          notes: 'Second note',
          created_at: new Date(),
          users_training_assignments_trainer_idTousers: {
            id: 1,
            username: 'trainer1',
            email: 'trainer@example.com',
            avatar: 'trainer-avatar.jpg'
          }
        }
      ]

      mockPrisma.training_assignments.findMany.mockResolvedValue(mockNotes)

      await getMemberNotes(req, res)

      expect(mockPrisma.training_assignments.findMany).toHaveBeenCalledWith({
        where: { member_id: 2 },
        orderBy: { created_at: 'desc' },
        include: {
          users_training_assignments_trainer_idTousers: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true
            }
          }
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockNotes)
    })

    test('should handle database error in getMemberNotes', async () => {
      const req = createMockReq({}, { memberId: '2' })
      const res = createMockRes()

      mockPrisma.training_assignments.findMany.mockRejectedValue(new Error('Database error'))

      await getMemberNotes(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' })
    })
  })

  describe('getNoteById', () => {
    test('should get note by id successfully', async () => {
      const req = createMockReq({}, { id: '1' })
      const res = createMockRes()

      const mockNote = {
        id: 1,
        trainer_id: 1,
        member_id: 2,
        notes: 'Test note',
        users_training_assignments_trainer_idTousers: {
          id: 1,
          username: 'trainer1',
          email: 'trainer@example.com',
          avatar: 'trainer-avatar.jpg'
        },
        users_training_assignments_member_idTousers: {
          id: 2,
          username: 'member1',
          email: 'member@example.com',
          avatar: 'member-avatar.jpg'
        }
      }

      mockPrisma.training_assignments.findUnique.mockResolvedValue(mockNote)

      await getNoteById(req, res)

      expect(mockPrisma.training_assignments.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          users_training_assignments_trainer_idTousers: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true
            }
          },
          users_training_assignments_member_idTousers: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true
            }
          }
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        ...mockNote,
        trainer: mockNote.users_training_assignments_trainer_idTousers,
        member: mockNote.users_training_assignments_member_idTousers,
        users_training_assignments_trainer_idTousers: undefined,
        users_training_assignments_member_idTousers: undefined
      })
    })

    test('should return 404 if note not found', async () => {
      const req = createMockReq({}, { id: '999' })
      const res = createMockRes()

      mockPrisma.training_assignments.findUnique.mockResolvedValue(null)

      await getNoteById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Note not found' })
    })
  })

  describe('updateNote', () => {
    test('should update note successfully', async () => {
      const req = createMockReq({
        notes: 'Updated note content',
        status: 'completed'
      }, { id: '1' }, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()

      const existingNote = {
        id: 1,
        trainer_id: 1,
        member_id: 2,
        notes: 'Original note',
        status: 'active',
        end_date: null
      }

      const updatedNote = {
        ...existingNote,
        notes: 'Updated note content',
        status: 'completed',
        updated_at: new Date()
      }

      mockPrisma.training_assignments.findUnique.mockResolvedValue(existingNote)
      mockPrisma.training_assignments.update.mockResolvedValue(updatedNote)

      await updateNote(req, res)

      expect(mockPrisma.training_assignments.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          notes: 'Updated note content',
          status: 'completed',
          end_date: null,
          updated_at: expect.any(Date)
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note updated successfully',
        data: updatedNote
      })
    })

    test('should return error if user not authorized', async () => {
      const req = createMockReq({
        notes: 'Updated note'
      }, { id: '1' }, {}, { userId: 2, role: 'trainer' })
      const res = createMockRes()

      const existingNote = {
        id: 1,
        trainer_id: 1,
        member_id: 2
      }

      mockPrisma.training_assignments.findUnique.mockResolvedValue(existingNote)

      await updateNote(req, res)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Not authorized to update this note'
      })
    })
  })

  describe('deleteNote', () => {
    test('should delete note successfully', async () => {
      const req = createMockReq({}, { id: '1' }, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()

      const existingNote = {
        id: 1,
        trainer_id: 1,
        member_id: 2
      }

      mockPrisma.training_assignments.findUnique.mockResolvedValue(existingNote)
      mockPrisma.training_assignments.delete.mockResolvedValue()
      mockRecalculateActivity.mockResolvedValue()

      await deleteNote(req, res)

      expect(mockPrisma.training_assignments.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })

      expect(mockRecalculateActivity).toHaveBeenCalledWith(2, true)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note deleted successfully'
      })
    })

    test('should return error if user not authorized', async () => {
      const req = createMockReq({}, { id: '1' }, {}, { userId: 2, role: 'trainer' })
      const res = createMockRes()

      const existingNote = {
        id: 1,
        trainer_id: 1,
        member_id: 2
      }

      mockPrisma.training_assignments.findUnique.mockResolvedValue(existingNote)

      await deleteNote(req, res)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Not authorized to delete this note'
      })
    })
  })

  describe('getTrainerNotes', () => {
    test('should get trainer notes successfully', async () => {
      const req = createMockReq({}, {}, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()

      const mockNotes = [
        {
          id: 1,
          trainer_id: 1,
          member_id: 2,
          notes: 'First note',
          created_at: new Date(),
          users_training_assignments_member_idTousers: {
            id: 2,
            name: 'Member Name'
          }
        }
      ]

      mockPrisma.training_assignments.findMany.mockResolvedValue(mockNotes)

      await getTrainerNotes(req, res)

      expect(mockPrisma.training_assignments.findMany).toHaveBeenCalledWith({
        where: { trainer_id: 1 },
        orderBy: { created_at: 'desc' },
        include: {
          users_training_assignments_member_idTousers: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockNotes)
    })
  })

  describe('getTrainerNotecountForPerson', () => {
    test('should get note count for person within timewindow', async () => {
      const userId = 2
      const timewindow = 7

      mockPrisma.training_assignments.count.mockResolvedValue(5)

      const result = await getTrainerNotecountForPerson(userId, timewindow)

      expect(mockPrisma.training_assignments.count).toHaveBeenCalledWith({
        where: {
          member_id: 2,
          created_at: {
            gte: expect.any(Date)
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      expect(result).toBe(5)
    })

    test('should get all note count for person without timewindow', async () => {
      const userId = 2

      mockPrisma.training_assignments.count.mockResolvedValue(10)

      const result = await getTrainerNotecountForPerson(userId)

      expect(mockPrisma.training_assignments.count).toHaveBeenCalledWith({
        where: {
          member_id: 2
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      expect(result).toBe(10)
    })
  })

  describe('checkTrainerAccess', () => {
    test('should allow admin access', async () => {
      const req = createMockReq({}, { memberId: '2' }, {}, { userId: 1, role: 'admin' })
      const res = createMockRes()
      const next = vi.fn()

      await checkTrainerAccess(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    test('should allow member access to own data', async () => {
      const req = createMockReq({}, { memberId: '1' }, {}, { userId: 1, role: 'member' })
      const res = createMockRes()
      const next = vi.fn()

      await checkTrainerAccess(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    test('should allow trainer access to their assigned member', async () => {
      const req = createMockReq({}, { memberId: '2' }, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()
      const next = vi.fn()

      const mockTrainerMember = {
        trainer_id: 1,
        member_id: 2
      }

      mockPrisma.trained_by.findUnique.mockResolvedValue(mockTrainerMember)

      await checkTrainerAccess(req, res, next)

      expect(mockPrisma.trained_by.findUnique).toHaveBeenCalledWith({
        where: {
          trainer_id_member_id: {
            trainer_id: 1,
            member_id: 2
          }
        }
      })

      expect(next).toHaveBeenCalled()
    })

    test('should deny trainer access to unassigned member', async () => {
      const req = createMockReq({}, { memberId: '3' }, {}, { userId: 1, role: 'trainer' })
      const res = createMockRes()
      const next = vi.fn()

      mockPrisma.trained_by.findUnique.mockResolvedValue(null)

      await checkTrainerAccess(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        error: 'You do not have access to this member'
      })
      expect(next).not.toHaveBeenCalled()
    })

    test('should deny unauthorized access', async () => {
      const req = createMockReq({}, { memberId: '2' }, {}, { userId: 1, role: 'unknown' })
      const res = createMockRes()
      const next = vi.fn()

      await checkTrainerAccess(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
      expect(next).not.toHaveBeenCalled()
    })
  })
})