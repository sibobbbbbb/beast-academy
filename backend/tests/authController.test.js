import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createMockReq, createMockRes, mockPrisma } from './setup.js'

// Create mock functions that we can access in tests
const mockBcryptHash = vi.fn()
const mockBcryptCompare = vi.fn()
const mockJwtSign = vi.fn()
const mockJwtVerify = vi.fn()
const mockCloudinaryUpload = vi.fn()
const mockUpdateUserLoginSimple = vi.fn()
const mockGoogleVerifyToken = vi.fn()

// Mock all dependencies BEFORE importing controllers
vi.mock('../db/prisma/prisma.js', () => ({
  prisma: mockPrisma
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrisma)
}))

// Mock bcrypt dengan KEDUA cara import (default dan named)
vi.mock('bcryptjs', () => ({
  default: {
    hash: mockBcryptHash,
    compare: mockBcryptCompare,
  },
  hash: mockBcryptHash,
  compare: mockBcryptCompare,
}))

// Mock jwt dengan KEDUA cara import (default dan named)
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: mockJwtSign,
    verify: mockJwtVerify,
  },
  sign: mockJwtSign,
  verify: mockJwtVerify,
}))

vi.mock('../config/cloudinary.js', () => ({
  default: {
    v2: {
      uploader: {
        upload_stream: mockCloudinaryUpload,
        destroy: vi.fn(),
      },
    },
    config: vi.fn(),
  }
}))

vi.mock('cloudinary', () => ({
  default: {
    v2: {
      uploader: {
        upload_stream: mockCloudinaryUpload,
        destroy: vi.fn(),
      },
    },
    config: vi.fn(),
  }
}))

vi.mock('google-auth-library', () => ({
  OAuth2Client: vi.fn(() => ({
    verifyIdToken: mockGoogleVerifyToken,
  }))
}))

vi.mock('../controllers/activityController.js', () => ({
  updateUserLoginSimple: mockUpdateUserLoginSimple
}))

vi.mock('express-validator', () => ({
  body: vi.fn(() => ({
    isEmail: vi.fn(() => ({
      withMessage: vi.fn(() => ({
        run: vi.fn(() => Promise.resolve())
      }))
    }))
  })),
  validationResult: vi.fn(() => ({
    isEmpty: vi.fn(() => true),
    array: vi.fn(() => [])
  }))
}))

vi.mock('node-fetch', () => ({
  default: vi.fn()
}))

// Import controller functions setelah mock
const { register, login, logout, getProfile, googleLogin } = await import('../controllers/authController.js')

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    test('should register a new user successfully', async () => {
      const req = createMockReq({
        role: 'member',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }, {}, {}, null, {
        buffer: Buffer.from('fake-image-data')
      })
      const res = createMockRes()

      // Setup mocks
      mockPrisma.users.findUnique.mockResolvedValue(null)
      mockBcryptHash.mockResolvedValue('hashedPassword')
      
      mockCloudinaryUpload.mockImplementation((options, callback) => {
        // Return the stream object with end method
        return {
          end: vi.fn((buffer) => {
            // Call callback with success result
            callback(null, { secure_url: 'https://cloudinary.com/test-image.jpg' })
          })
        }
      })

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: 'member'
      }

      mockPrisma.$transaction.mockResolvedValue({ user: mockUser })

      await register(req, res)

      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({ 
        where: { email: 'test@example.com' } 
      })
      expect(mockBcryptHash).toHaveBeenCalledWith('password123', 10)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: mockUser,
        member: null
      })
    })

    test('should return error if email already exists', async () => {
      const req = createMockReq({
        role: 'member',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }, {}, {}, null, {
        buffer: Buffer.from('fake-image-data')
      })
      const res = createMockRes()

      mockPrisma.users.findUnique.mockResolvedValue({ 
        id: 1, 
        email: 'test@example.com' 
      })

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Email is already in use' 
      })
    })

    test('should return error if required fields are missing', async () => {
      const req = createMockReq({
        role: 'member',
        email: 'test@example.com',
        password: 'password123'
        // missing username and name
      })
      const res = createMockRes()

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'All fields are required' 
      })
    })

    test('should return error if password too short', async () => {
      const req = createMockReq({
        role: 'member',
        username: 'testuser',
        email: 'test@example.com',
        password: '123', // too short
        name: 'Test User'
      }, {}, {}, null, {
        buffer: Buffer.from('fake-image-data')
      })
      const res = createMockRes()

      mockPrisma.users.findUnique.mockResolvedValue(null)

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Password must be at least 8 characters long' 
      })
    })
  })

  describe('login', () => {
    test('should login user successfully', async () => {
      const req = createMockReq({
        email: 'test@example.com',
        password: 'password123'
      })
      const res = createMockRes()

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: 'member',
        password: 'hashedPassword'
      }

      mockPrisma.users.findUnique.mockResolvedValue(mockUser)
      mockBcryptCompare.mockResolvedValue(true)
      mockJwtSign.mockReturnValue('fake-jwt-token')
      mockUpdateUserLoginSimple.mockResolvedValue(true)

      await login(req, res)

      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({ 
        where: { email: 'test@example.com' } 
      })
      expect(mockBcryptCompare).toHaveBeenCalledWith('password123', 'hashedPassword')
      expect(mockJwtSign).toHaveBeenCalledWith(
        { userId: 1, role: 'member' },
        'test-secret-key',
        { expiresIn: '1d' }
      )
      expect(res.cookie).toHaveBeenCalledWith('token', 'fake-jwt-token', expect.any(Object))
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'member'
        }
      })
    })

    test('should return error if user not found', async () => {
      const req = createMockReq({
        email: 'nonexistent@example.com',
        password: 'password123'
      })
      const res = createMockRes()

      mockPrisma.users.findUnique.mockResolvedValue(null)

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Account not found. Please register first.'
      })
    })

    test('should return error if password is incorrect', async () => {
      const req = createMockReq({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      const res = createMockRes()

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      mockPrisma.users.findUnique.mockResolvedValue(mockUser)
      mockBcryptCompare.mockResolvedValue(false)

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        error: 'The email or password you entered is incorrect.'
      })
    })
  })

  describe('logout', () => {
    test('should logout user successfully', () => {
      const req = createMockReq()
      const res = createMockRes()

      logout(req, res)

      expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object))
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' })
    })
  })

  describe('getProfile', () => {
    test('should get user profile successfully', async () => {
      const req = createMockReq({}, {}, {}, null, null, { token: 'valid-token' })
      const res = createMockRes()

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'member',
        avatar: 'avatar-url',
        provider: null,
        created_at: new Date()
      }

      mockJwtVerify.mockReturnValue({ userId: 1 })
      mockPrisma.users.findUnique.mockResolvedValue(mockUser)

      await getProfile(req, res)

      expect(mockJwtVerify).toHaveBeenCalledWith('valid-token', 'test-secret-key')
      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'member',
        avatar: 'avatar-url',
        provider: null,
        created_at: mockUser.created_at
      })
    })

    test('should return unauthorized if no token', async () => {
      const req = createMockReq()
      const res = createMockRes()

      await getProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    test('should return error if user not found', async () => {
      const req = createMockReq({}, {}, {}, null, null, { token: 'valid-token' })
      const res = createMockRes()

      mockJwtVerify.mockReturnValue({ userId: 999 })
      mockPrisma.users.findUnique.mockResolvedValue(null)

      await getProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' })
    })
  })

  describe('googleLogin', () => {
    test('should login with Google successfully for existing user', async () => {
      const req = createMockReq({
        token: 'google-id-token'
      })
      const res = createMockRes()

      const mockPayload = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'profile-pic-url',
        sub: 'google-user-id'
      }

      const mockTicket = {
        getPayload: () => mockPayload
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'test',
        role: 'member'
      }

      mockGoogleVerifyToken.mockResolvedValue(mockTicket)
      mockPrisma.$transaction.mockResolvedValue({
        user: mockUser,
        isNewUser: false,
        member: null
      })
      mockJwtSign.mockReturnValue('jwt-token')

      await googleLogin(req, res)

      expect(mockGoogleVerifyToken).toHaveBeenCalledWith({
        idToken: 'google-id-token',
        audience: 'test-google-client-id'
      })
      expect(res.cookie).toHaveBeenCalledWith('token', 'jwt-token', expect.any(Object))
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id: 1,
          username: 'test',
          email: 'test@example.com',
          role: 'member'
        }
      })
    })

    test('should return error for invalid Google token', async () => {
      const req = createMockReq({
        token: 'invalid-token'
      })
      const res = createMockRes()

      mockGoogleVerifyToken.mockRejectedValue(new Error('Invalid token'))

      await googleLogin(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Google token' })
    })
  })
})