import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createMockReq, createMockRes, mockPrisma } from './setup.js'

// Create mock functions
const mockGetTrainerNotecountForPerson = vi.fn()
const mockGetLikedEvents = vi.fn()
const mockGetEventsCountByCriteria = vi.fn()

// Mock all dependencies BEFORE importing controllers
vi.mock('../db/prisma/prisma.js', () => ({
  prisma: mockPrisma
}))

vi.mock('../controllers/notesController.js', () => ({
  getTrainerNotecountForPerson: mockGetTrainerNotecountForPerson
}))

vi.mock('../controllers/eventController.js', () => ({
  getLikedEvents: mockGetLikedEvents,
  getEventsCountByCriteria: mockGetEventsCountByCriteria
}))

// Import controller functions setelah mock
const {
  getActivity,
  recalculateActivity,
  initDefaultJudgeValues,
  auditAndFixUserMetrics,
  updateUserLoginSimple
} = await import('../controllers/activityController.js')

describe('Activity Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getActivity', () => {
      test('should get activity successfully', async () => {
      const req = createMockReq({}, { id: '1' })
      const res = createMockRes()

      // SEDIAKAN SEMUA MOCK YANG DIBUTUHKAN OLEH `recalculateActivity`
      
      // 1. Mock untuk config
      mockPrisma.activity_config.findUnique.mockImplementation(({ where: { key } }) => {
        if (key === 'weeklyTrainingTarget') {
          return Promise.resolve({ value: '8' });
        }
        if (key === 'postActivenessWindow') {
          return Promise.resolve({ value: '7' });
        }
        if (key === 'scoreWeights') {
          return Promise.resolve({ value: '[5,3,2]' });
        }
        return Promise.resolve(null);
      });
      
      // 2. Mock untuk jumlah event
      mockGetEventsCountByCriteria.mockResolvedValue(10);
      
      // 3. Mock untuk data user (agar tidak error "user not found")
      mockPrisma.user_activity_score.findUnique.mockResolvedValue({
        user_id: 1,
        notes_received_weekly: 5,
        days_since_last_login: 1,
        post_interactions_monthly: 5
      });
      
      // 4. Mock untuk proses update score di akhir
      mockPrisma.user_activity_score.upsert.mockResolvedValue({});

      // Jalankan fungsi yang diuji
      await getActivity(req, res)

      // Sekarang ekspektasi ini akan terpenuhi
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Status Ok' })
    })
  })

  describe('recalculateActivity', () => {
    test('should recalculate activity score successfully', async () => {
      const userId = 1
      const refreshDB = true

      // Mock config values
      mockPrisma.activity_config.findUnique.mockImplementation(({ where: { key } }) => {
        if (key === 'weeklyTrainingTarget') {
          return Promise.resolve({ value: '8' });
        }
        if (key === 'postActivenessWindow') {
          return Promise.resolve({ value: '7' });
        }
        if (key === 'scoreWeights') {
          // Pastikan ini mengembalikan string JSON dari sebuah array
          return Promise.resolve({ value: '[5,3,2]' });
        }
        return Promise.resolve(null); // Fallback jika key tidak ada
      });

      // Mock events count
      mockGetEventsCountByCriteria.mockResolvedValue(10)

      // Mock user metrics
      const mockMetrics = {
        user_id: 1,
        notes_received_weekly: 6,
        days_since_last_login: 2,
        post_interactions_monthly: 8
      }

      mockPrisma.user_activity_score.findUnique.mockResolvedValue(mockMetrics)

      // Mock refresh functions
      mockGetLikedEvents.mockResolvedValue([{ id: 1 }, { id: 2 }])
      mockGetTrainerNotecountForPerson.mockResolvedValue(6)

      mockPrisma.user_activity_score.upsert.mockResolvedValue({
        ...mockMetrics,
        activity_score: 7.5
      })

      const result = await recalculateActivity(userId, refreshDB)

      expect(mockPrisma.user_activity_score.findUnique).toHaveBeenCalledWith({
        where: { user_id: 1 }
      })

      expect(mockPrisma.user_activity_score.upsert).toHaveBeenCalledWith({
        where: { user_id: 1 },
        update: { activity_score: expect.any(Number) },
        create: { user_id: 1, activity_score: expect.any(Number) }
      })
      console.log('Activity score recalculated:', result)
      expect(result).toBeGreaterThan(0)
    })

    test('should handle missing metrics', async () => {
      const userId = 999

      mockPrisma.activity_config.findUnique.mockImplementation(({ where: { key } }) => {
        if (key === 'weeklyTrainingTarget') {
          return Promise.resolve({ value: '8' });
        }
        if (key === 'postActivenessWindow') {
          return Promise.resolve({ value: '7' });
        }
        if (key === 'scoreWeights') {
          return Promise.resolve({ value: '[5,3,2]' });
        }
        return Promise.resolve(null);
      });
      mockGetEventsCountByCriteria.mockResolvedValue(10)
      mockPrisma.user_activity_score.findUnique.mockResolvedValue(null)

      // Mock console.warn
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await recalculateActivity(userId)

      expect(consoleSpy).toHaveBeenCalledWith(`No metrics found for user ${userId}`)
      expect(result).toBeUndefined()

      consoleSpy.mockRestore()
    })
  })

  describe('initDefaultJudgeValues', () => {
    test('should initialize default config values', async () => {
      mockPrisma.activity_config.createMany.mockResolvedValue({ count: 3 })

      await initDefaultJudgeValues()

      expect(mockPrisma.activity_config.createMany).toHaveBeenCalledWith({
        data: [
          { key: 'weeklyTrainingTarget', value: '8' },
          { key: 'postActivenessWindow', value: '7' },
          { key: 'scoreWeights', value: '[5,3,2]' }
        ],
        skipDuplicates: true
      })
    })

    test('should handle database error', async () => {
      mockPrisma.activity_config.createMany.mockRejectedValue(new Error('Database error'))

      await expect(initDefaultJudgeValues()).rejects.toThrow('Database error')
    })
  })

  describe('auditAndFixUserMetrics', () => {
    test('should audit and fix user metrics', async () => {
      const mockUsers = [
        { id: 1 },
        { id: 2 }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockUsers)

      // Mock config values
      mockPrisma.activity_config.findUnique
        .mockResolvedValueOnce({ key: 'postActivenessWindow', value: '7' })
        .mockResolvedValueOnce({ key: 'postActivenessWindow', value: '7' })

      // Mock real data - return arrays instead of objects
      mockGetTrainerNotecountForPerson
        .mockResolvedValueOnce(5) // User 1: 5 notes
        .mockResolvedValueOnce(5) // User 2: 5 notes
      
      mockGetLikedEvents
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }]) // User 1: 2 likes
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }]) // User 2: 2 likes

      // Mock stored data - both users have mismatches
      mockPrisma.user_activity_score.findUnique
        .mockResolvedValueOnce({
          user_id: 1,
          notes_received_weekly: 3, // mismatch (should be 5)
          post_interactions_monthly: 1 // mismatch (should be 2)
        })
        .mockResolvedValueOnce({
          user_id: 2,
          notes_received_weekly: 3, // mismatch (should be 5)
          post_interactions_monthly: 1 // mismatch (should be 2)
        })

      // Mock recalculateActivity calls
      mockPrisma.activity_config.findUnique
        .mockResolvedValueOnce({ key: 'weeklyTrainingTarget', value: '8' })
        .mockResolvedValueOnce({ key: 'postActivenessWindow', value: '7' })
        .mockResolvedValueOnce({ key: 'scoreWeights', value: '[5,3,2]' })
        .mockResolvedValueOnce({ key: 'weeklyTrainingTarget', value: '8' })
        .mockResolvedValueOnce({ key: 'postActivenessWindow', value: '7' })
        .mockResolvedValueOnce({ key: 'scoreWeights', value: '[5,3,2]' })

      mockGetEventsCountByCriteria.mockResolvedValue(10)

      mockPrisma.user_activity_score.upsert.mockResolvedValue()

      // Mock console methods
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await auditAndFixUserMetrics({ autoFix: true })

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({ select: { id: true } })
      expect(consoleLogSpy).toHaveBeenCalledWith('[Audit] Done. Total mismatches: 2 (fixed)')

      consoleLogSpy.mockRestore()
    })

    test('should audit without fixing', async () => {
      const mockUsers = [{ id: 1 }]

      mockPrisma.users.findMany.mockResolvedValue(mockUsers)

      // Mock config values
      mockPrisma.activity_config.findUnique
        .mockResolvedValueOnce({ key: 'postActivenessWindow', value: '7' })

      // Mock real data
      mockGetTrainerNotecountForPerson.mockResolvedValue(5)
      mockGetLikedEvents.mockResolvedValue([{ id: 1 }])

      // Mock stored data - mismatch scenario
      mockPrisma.user_activity_score.findUnique.mockResolvedValue({
        user_id: 1,
        notes_received_weekly: 3, // mismatch
        post_interactions_monthly: 2 // mismatch
      })

      // Mock console methods
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await auditAndFixUserMetrics({ autoFix: false })

      expect(consoleLogSpy).toHaveBeenCalledWith('[Audit] Done. Total mismatches: 1')

      consoleLogSpy.mockRestore()
    })
  })

  describe('updateUserLoginSimple', () => {
    test('should update user login successfully', async () => {
      const userId = 1

      mockPrisma.$executeRaw.mockResolvedValue()

      const result = await updateUserLoginSimple(userId)

      expect(mockPrisma.$executeRaw).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    test('should handle database error', async () => {
      const userId = 1

      mockPrisma.$executeRaw.mockRejectedValue(new Error('Database error'))

      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await updateUserLoginSimple(userId)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update user login:', expect.any(Error))
      expect(result).toBe(false)

      consoleErrorSpy.mockRestore()
    })
  })
})