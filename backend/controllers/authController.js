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

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: { role, username, email, password: hashedPassword },
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
};

// Login User dengan httpOnly Cookie
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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
