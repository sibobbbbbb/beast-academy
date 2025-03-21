import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// Registrasi User
export const register = async (req, res) => {
    try {
        const { role, username, email, password } = req.body;

        // Validate input fields
        if (!role || !username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Check if the email is already in use
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const user = await prisma.users.create({
            data: { role, username, email, password: hashedPassword },
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

// Login User dengan httpOnly Cookie
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email exists
        const user = await prisma.users.findUnique({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ 
                error: 'Account not found. Please register first.' 
            });
        }
        
        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'The email or password you entered is incorrect.' 
            });
        }

        // Generate token with user ID and role
        const token = jwt.sign(
            { 
                userId: user.id, 
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Return success message
        res.json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'An error occurred. Please try again.' 
        });
    }
};

// Logout User
export const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    res.json({ message: 'Logout successful' });
};

// Get User Profile dari Cookie
export const getProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.users.findUnique({ where: { id: decoded.userId } });

        res.json(user);
    } catch {
        res.status(403).json({ error: 'Invalid token' });
    }
};
