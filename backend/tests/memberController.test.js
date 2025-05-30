import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createMockReq, createMockRes, mockPrisma } from './setup.js'

// Create mock functions that we can access in tests
const mockBcryptHash = vi.fn()
const mockBcryptCompare = vi.fn()
const mockJwtVerify = vi.fn()
const mockCloudinaryUpload = vi.fn()
const mockBodyValidation = vi.fn()
const mockValidationResult = vi.fn()

// Mock all dependencies BEFORE importing controllers
vi.mock('../db/prisma/prisma.js', () => ({
  prisma: mockPrisma
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: mockBcryptHash,
    compare: mockBcryptCompare,
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: mockJwtVerify,
  }
}))

vi.mock('../config/cloudinary.js', () => ({
  default: {
    v2: {
      uploader: {
        upload_stream: mockCloudinaryUpload,
        destroy: vi.fn(),
      },
    },
  }
}))

vi.mock('uuid', () => ({
  v4: vi.fn(() => '123456')
}))

vi.mock('express-validator', () => ({
  body: mockBodyValidation,
  validationResult: mockValidationResult
}))

// Import controller functions setelah mock
const {
  addMemberControllers,
  getMemberControllers,
  getMemberByIdControllers,
  deleteMemberControllers,
  updateMemberControllers,
  getProfileControllers,
  updateProfileControllers,
  checkPhoneNumberController,
  changePasswordController
} = await import('../controllers/memberController.js')

describe('Member Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default express-validator mocks
    mockBodyValidation.mockReturnValue({
      isEmail: vi.fn(() => ({
        withMessage: vi.fn(() => ({
          run: vi.fn(() => Promise.resolve())
        }))
      })),
      optional: vi.fn(() => ({
        isMobilePhone: vi.fn(() => ({
          withMessage: vi.fn(() => ({
            run: vi.fn(() => Promise.resolve())
          }))
        }))
      })),
      notEmpty: vi.fn(() => ({
        withMessage: vi.fn(() => ({
          run: vi.fn(() => Promise.resolve()),
          isIn: vi.fn(() => ({
            withMessage: vi.fn(() => ({
              run: vi.fn(() => Promise.resolve())
            }))
          }))
        }))
      }))
    })
    
    mockValidationResult.mockReturnValue({
      isEmpty: vi.fn(() => true),
      array: vi.fn(() => [])
    })
  })

  describe('addMemberControllers', () => {
    test('should add member successfully', async () => {
      const req = createMockReq({
        username: 'newmember',
        name: 'New Member',
        phone: '1234567890',
        role: 'member',
        email: 'new@example.com'
      }, {}, {}, null, {
        buffer: Buffer.from('fake-image-data')
      })
      const res = createMockRes()

      // Mock no existing email or phone
      mockPrisma.users.findUnique
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null) // phone check

      mockBcryptHash.mockResolvedValue('hashedPassword')
      mockCloudinaryUpload.mockImplementation((options, callback) => {
        const mockResult = {
          end: vi.fn(() => {
            callback(null, { secure_url: 'https://cloudinary.com/member-image.jpg' })
          })
        }
        return mockResult
      })

      mockPrisma.$transaction.mockResolvedValue({ defaultPassword: 'newmember123456' })

      // Get the actual controller function (array[1])
      const controllerFunction = addMemberControllers[1]
      await controllerFunction(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Member berhasil ditambahkan',
        defaultPassword: 'newmember123456'
      })
    })

    test('should return error if email already exists', async () => {
      const req = createMockReq({
        username: 'newmember',
        name: 'New Member',
        email: 'existing@example.com',
        role: 'member'
      }, {}, {}, null, {
        buffer: Buffer.from('fake-image-data')
      })
      const res = createMockRes()

      mockPrisma.users.findUnique.mockResolvedValue({ id: 1, email: 'existing@example.com' })

      const controllerFunction = addMemberControllers[1]
      await controllerFunction(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ message: 'Email sudah digunakan' })
    })
  })

  describe('getMemberControllers', () => {
    test('should get all members for admin', async () => {
      const req = createMockReq({}, {}, {}, { role: 'admin', userId: 1 })
      const res = createMockRes()

      const mockMembers = [
        { id: 1, name: 'Member 1', role: 'member' },
        { id: 2, name: 'Member 2', role: 'trainer' }
      ]

      mockPrisma.users.findMany.mockResolvedValue(mockMembers)

      await getMemberControllers(req, res)

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockMembers)
    })

    test('should get trainer members for trainer role', async () => {
      const req = createMockReq({}, {}, {}, { role: 'trainer', userId: 1 })
      const res = createMockRes()

      const mockTrainerMembers = [
        {
          trainer_id: 1,
          member_id: 2,
          users: { id: 2, name: 'Trainee 1' }
        }
      ]

      mockPrisma.trained_by.findMany.mockResolvedValue(mockTrainerMembers)

      await getMemberControllers(req, res)

      expect(mockPrisma.trained_by.findMany).toHaveBeenCalledWith({
        where: { trainer_id: 1 },
        include: { users: true }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockTrainerMembers)
    })
  })

  describe('getMemberByIdControllers', () => {
    test('should get member by id successfully', async () => {
      const req = createMockReq({}, { id: '1' })
      const res = createMockRes()

      const mockMember = {
        id: 1,
        name: 'Test Member',
        email: 'test@example.com'
      }

      mockPrisma.users.findUnique.mockResolvedValue(mockMember)

      await getMemberByIdControllers(req, res)

      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockMember)
    })
  })

  describe('deleteMemberControllers', () => {
    test('should delete member successfully', async () => {
      const req = createMockReq({}, { id: '1' })
      const res = createMockRes()

      const mockUser = {
        id: 1,
        role: 'member',
        avatar: 'https://cloudinary.com/member-avatar.jpg'
      }

      mockPrisma.users.findUnique.mockResolvedValue(mockUser)
      mockPrisma.users.delete.mockResolvedValue()

      await deleteMemberControllers(req, res)

      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })

      expect(mockPrisma.users.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Member berhasil dihapus' })
    })

    test('should return 404 if member not found', async () => {
      const req = createMockReq({}, { id: '999' })
      const res = createMockRes()

      mockPrisma.users.findUnique.mockResolvedValue(null)

      await deleteMemberControllers(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' })
    })
  })

  describe('updateMemberControllers', () => {
    test('should update member successfully', async () => {
      const req = createMockReq({
        name: 'Updated Name',
        phone_no: '9876543210'
      }, { id: '1' })
      const res = createMockRes()

      // Mock no phone conflict
      mockPrisma.users.findUnique.mockResolvedValue(null)
      mockPrisma.users.update.mockResolvedValue()

      await updateMemberControllers(req, res)

      expect(mockPrisma.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Name',
          phone_no: '9876543210'
        }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Member berhasil diupdate' })
    })

    test('should return error if phone number already used', async () => {
      const req = createMockReq({
        name: 'Updated Name',
        phone_no: '9876543210'
      }, { id: '1' })
      const res = createMockRes()

      // Mock phone conflict
      mockPrisma.users.findUnique.mockResolvedValue({ id: 2, phone_no: '9876543210' })

      await updateMemberControllers(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Nomor telepon sudah digunakan oleh member lain' 
      })
    })
  })

  describe('getProfileControllers', () => {
    test('should get profile successfully', async () => {
      const req = createMockReq({}, {}, {}, null, null, { token: 'valid-token' })
      const res = createMockRes()

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'member'
      }

      mockJwtVerify.mockReturnValue({ userId: 1, role: 'member' })
      mockPrisma.users.findUnique.mockResolvedValue(mockUser)

      await getProfileControllers(req, res)

      expect(mockJwtVerify).toHaveBeenCalledWith('valid-token', 'test-secret-key')
      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    test('should return unauthorized if no token', async () => {
      const req = createMockReq()
      const res = createMockRes()

      await getProfileControllers(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })
  })

  describe('changePasswordController', () => {
    test('should change password successfully', async () => {
      const req = createMockReq({
        oldPassword: 'oldpassword',
        newPassword: 'newpassword'
      }, {}, {}, null, null, { token: 'valid-token' })
      const res = createMockRes()

      const mockUser = {
        id: 1,
        password: 'hashedOldPassword'
      }

      mockJwtVerify.mockReturnValue({ userId: 1 })
      mockPrisma.users.findUnique.mockResolvedValue(mockUser)
      mockBcryptCompare.mockResolvedValue(true)
      mockBcryptHash.mockResolvedValue('hashedNewPassword')
      mockPrisma.users.update.mockResolvedValue()

      await changePasswordController(req, res)

      expect(mockBcryptCompare).toHaveBeenCalledWith('oldpassword', 'hashedOldPassword')
      expect(mockBcryptHash).toHaveBeenCalledWith('newpassword', 10)

      expect(mockPrisma.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'hashedNewPassword' }
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Password berhasil diubah' })
    })

    test('should return error if old password incorrect', async () => {
      const req = createMockReq({
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword'
      }, {}, {}, null, null, { token: 'valid-token' })
      const res = createMockRes()

      const mockUser = {
        id: 1,
        password: 'hashedOldPassword'
      }

      mockJwtVerify.mockReturnValue({ userId: 1 })
      mockPrisma.users.findUnique.mockResolvedValue(mockUser)
      mockBcryptCompare.mockResolvedValue(false)

      await changePasswordController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Password lama tidak sesuai' })
    })

    test('should return error if user not found', async () => {
      const req = createMockReq({
        oldPassword: 'oldpassword',
        newPassword: 'newpassword'
      }, {}, {}, null, null, { token: 'valid-token' })
      const res = createMockRes()

      mockJwtVerify.mockReturnValue({ userId: 999 })
      mockPrisma.users.findUnique.mockResolvedValue(null)

      await changePasswordController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' })
    })
  })
})