import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createMockReq, createMockRes, mockPrisma } from './setup.js'

// Mock all dependencies BEFORE importing controllers
vi.mock('../db/prisma/prisma.js', () => ({
  prisma: mockPrisma
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrisma)
}))

vi.mock('../config/cloudinary.js', () => ({
  default: {
    v2: {
      uploader: {
        upload_stream: vi.fn(),
        destroy: vi.fn(),
      },
    },
  }
}))

vi.mock('cloudinary', () => ({
  default: {
    v2: {
      uploader: {
        upload_stream: vi.fn(),
        destroy: vi.fn(),
      },
    },
  }
}))

vi.mock('../controllers/activityController.js', () => ({
  recalculateActivity: vi.fn()
}))

// Import setelah semua mock
const cloudinary = await import('../config/cloudinary.js')
const { recalculateActivity } = await import('../controllers/activityController.js')

// Import controller functions
const { 
  createEventController,
  readEventController,
  updateEventController,
  deleteEventContorller,
  readEventControllerId,
  likeEventController,
  unlikeEventController,
  readLikedEventControllerId,
  getEventsByCriteria,
  getEventsCountByCriteria,
  getLikedEvents
} = await import('../controllers/eventController.js')

describe('Event Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createEventController', () => {
    test('should create event successfully with image', async () => {
      const req = createMockReq({
        title: 'Test Event',
        description: 'Test Description',
        joinform: 'https://example.com/join'
      }, {}, {}, null, {
        buffer: Buffer.from('fake-image-data')
      })
      const res = createMockRes()

      const mockEvent = {
        id: 1,
        title: 'Test Event',
        images: 'https://test-url.com/test-image.jpg',
        description: 'Test Description',
        joinform: 'https://example.com/join',
        posted_at: new Date()
      }

      // Mock Cloudinary upload for test environment
      process.env.NODE_ENV = 'test'
      mockPrisma.events.create.mockResolvedValue(mockEvent)

      await createEventController(req, res)

      expect(mockPrisma.events.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Event',
          images: 'https://test-url.com/test-image.jpg',
          description: 'Test Description',
          joinform: 'https://example.com/join',
          posted_at: expect.any(Date)
        }
      })

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event created successfully',
        data: mockEvent
      })
    })

    test('should create event successfully without image', async () => {
      const req = createMockReq({
        title: 'Test Event',
        description: 'Test Description'
      })
      const res = createMockRes()

      const mockEvent = {
        id: 1,
        title: 'Test Event',
        images: '',
        description: 'Test Description',
        joinform: 'https://example.com/join-form',
        posted_at: new Date()
      }

      mockPrisma.events.create.mockResolvedValue(mockEvent)

      await createEventController(req, res)

      expect(mockPrisma.events.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Event',
          images: '',
          description: 'Test Description',
          joinform: 'https://example.com/join-form',
          posted_at: expect.any(Date)
        }
      })

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event created successfully',
        data: mockEvent
      })
    })

    test('should return error if title is missing', async () => {
      const req = createMockReq({
        description: 'Test Description'
        // missing title
      })
      const res = createMockRes()

      await createEventController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title and description are required fields'
      })
    })

    test('should handle database error', async () => {
      const req = createMockReq({
        title: 'Test Event',
        description: 'Test Description'
      })
      const res = createMockRes()

      mockPrisma.events.create.mockRejectedValue(new Error('Database error'))

      await createEventController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create event',
        error: 'Database error'
      })
    })
  })

  describe('readEventController', () => {
    test('should get events with pagination (first page)', async () => {
      const req = createMockReq({}, {}, { page: '1' })
      const res = createMockRes()

      const mockEvents = [
        { id: 1, title: 'Event 1', description: 'Desc 1' },
        { id: 2, title: 'Event 2', description: 'Desc 2' }
      ]

      mockPrisma.events.count.mockResolvedValue(25)
      mockPrisma.events.findMany.mockResolvedValue(mockEvents)

      await readEventController(req, res)

      expect(mockPrisma.events.count).toHaveBeenCalled()
      expect(mockPrisma.events.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        orderBy: { posted_at: 'desc' },
        select: {
          id: true,
          title: true,
          images: true,
          description: true,
          posted_at: true,
          joinform: true
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success fetching data',
        data: mockEvents,
        pagination: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 25,
          hasMore: true
        }
      })
    })

    test('should handle pagination for subsequent pages', async () => {
      const req = createMockReq({}, {}, { page: '2' })
      const res = createMockRes()

      const mockEvents = [
        { id: 3, title: 'Event 3', description: 'Desc 3' }
      ]

      mockPrisma.events.count.mockResolvedValue(25)
      mockPrisma.events.findMany.mockResolvedValue(mockEvents)

      await readEventController(req, res)

      expect(mockPrisma.events.findMany).toHaveBeenCalledWith({
        skip: 20,
        take: 5,
        orderBy: { posted_at: 'desc' },
        select: {
          id: true,
          title: true,
          images: true,
          description: true,
          posted_at: true,
          joinform: true
        }
      })
    })

    test('should handle database error', async () => {
      const req = createMockReq({}, {}, { page: '1' })
      const res = createMockRes()

      mockPrisma.events.count.mockRejectedValue(new Error('Database error'))

      await readEventController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to get data',
        error: 'Database error'
      })
    })
  })

  describe('readEventControllerId', () => {
    test('should get event by id successfully', async () => {
      const req = createMockReq({}, { id: '1' })
      const res = createMockRes()

      const mockEvent = {
        id: 1,
        title: 'Test Event',
        description: 'Test Description'
      }

      mockPrisma.events.findUnique.mockResolvedValue(mockEvent)

      await readEventControllerId(req, res)

      expect(mockPrisma.events.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event found',
        data: mockEvent
      })
    })

    test('should return 404 if event not found', async () => {
      const req = createMockReq({}, { id: '999' })
      const res = createMockRes()

      mockPrisma.events.findUnique.mockResolvedValue(null)

      await readEventControllerId(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event not found'
      })
    })
  })

  describe('likeEventController', () => {
    test('should like event successfully', async () => {
      const req = createMockReq({
        event_id: 1,
        user_id: 1
      })
      const res = createMockRes()

      const mockLike = {
        id: 1,
        u_id: 1,
        e_id: 1
      }

      mockPrisma.liked_by.create.mockResolvedValue(mockLike)
      recalculateActivity.mockResolvedValue()

      await likeEventController(req, res)

      expect(mockPrisma.liked_by.create).toHaveBeenCalledWith({
        data: {
          u_id: 1,
          e_id: 1
        }
      })

      expect(recalculateActivity).toHaveBeenCalledWith(1, true)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event liked successfully',
        data: mockLike
      })
    })

    test('should handle database error', async () => {
      const req = createMockReq({
        event_id: 1,
        user_id: 1
      })
      const res = createMockRes()

      mockPrisma.liked_by.create.mockRejectedValue(new Error('Database error'))

      await likeEventController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to like event',
        error: 'Database error'
      })
    })
  })

  describe('unlikeEventController', () => {
    test('should unlike event successfully', async () => {
      const req = createMockReq({
        event_id: 1,
        user_id: 1
      })
      const res = createMockRes()

      const mockResult = { count: 1 }

      mockPrisma.liked_by.deleteMany.mockResolvedValue(mockResult)
      recalculateActivity.mockResolvedValue()

      await unlikeEventController(req, res)

      expect(mockPrisma.liked_by.deleteMany).toHaveBeenCalledWith({
        where: {
          e_id: 1,
          u_id: 1
        }
      })

      expect(recalculateActivity).toHaveBeenCalledWith(1, true)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event unliked successfully',
        data: mockResult
      })
    })
  })

  describe('getLikedEvents', () => {
    test('should get liked events for user', async () => {
      const userId = 1
      const timewindow = 7

      const mockLikedEvents = [
        { id: 1, u_id: 1, e_id: 1 },
        { id: 2, u_id: 1, e_id: 2 }
      ]

      mockPrisma.liked_by.findMany.mockResolvedValue(mockLikedEvents)

      const result = await getLikedEvents(userId, timewindow)

      expect(mockPrisma.liked_by.findMany).toHaveBeenCalledWith({
        where: {
          u_id: 1,
          created_at: {
            gte: expect.any(Date)
          }
        }
      })

      expect(result).toEqual(mockLikedEvents)
    })

    test('should get all liked events if no timewindow', async () => {
      const userId = 1

      const mockLikedEvents = [
        { id: 1, u_id: 1, e_id: 1 }
      ]

      mockPrisma.liked_by.findMany.mockResolvedValue(mockLikedEvents)

      const result = await getLikedEvents(userId)

      expect(mockPrisma.liked_by.findMany).toHaveBeenCalledWith({
        where: {
          u_id: 1
        }
      })

      expect(result).toEqual(mockLikedEvents)
    })
  })

  describe('getEventsByCriteria', () => {
    test('should get events by criteria', async () => {
      const criteria = {
        where: { title: { contains: 'test' } }
      }

      const mockEvents = [
        { id: 1, title: 'Test Event' }
      ]

      mockPrisma.events.findMany.mockResolvedValue(mockEvents)

      const result = await getEventsByCriteria(criteria)

      expect(mockPrisma.events.findMany).toHaveBeenCalledWith(criteria)
      expect(result).toEqual(mockEvents)
    })
  })

  describe('getEventsCountByCriteria', () => {
    test('should get events count by criteria', async () => {
      const criteria = {
        where: { title: { contains: 'test' } }
      }

      mockPrisma.events.count.mockResolvedValue(5)

      const result = await getEventsCountByCriteria(criteria)

      expect(mockPrisma.events.count).toHaveBeenCalledWith(criteria)
      expect(result).toBe(5)
    })
  })
})