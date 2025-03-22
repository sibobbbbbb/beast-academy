import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';

dotenv.config();
const prisma = new PrismaClient();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Google Login
export const googleLogin = async (req, res) => {
    try {
      const { token } = req.body;
  
      // Verify the Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
  
      const payload = ticket.getPayload();
      const { email, name, picture } = payload;
  
      // Find or create the user
      let user = await prisma.users.findUnique({ where: { email } });
  
      if (!user) {
        // Create a new user with Google data
        user = await prisma.users.create({
          data: {
            email,
            username: name,
            password: '', // No password for OAuth users
            role: 'member', // Default role
            provider: 'google',
            providerId: payload.sub,
            avatar: picture
          }
        });
      }
  
      // Generate JWT token
      const authToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Set HTTP-only cookie
      res.cookie('token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
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
      console.error('Google login error:', error);
      res.status(401).json({ error: 'Invalid Google token' });
    }
  };
  
  // Facebook Login
  export const facebookLogin = async (req, res) => {
    try {
      const { accessToken } = req.body;
  
      // Verify the Facebook token
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to verify Facebook token');
      }
      
      const data = await response.json();
      const { id, name, email, picture } = data;
  
      if (!email) {
        return res.status(400).json({ 
          error: 'Email is required. Please ensure your Facebook account has a verified email and grant email permission.' 
        });
      }
  
      // Find or create the user
      let user = await prisma.users.findUnique({ where: { email } });
  
      if (!user) {
        // Create a new user with Facebook data
        user = await prisma.users.create({
          data: {
            email,
            username: name,
            password: '', // No password for OAuth users
            role: 'member', // Default role
            provider: 'facebook',
            providerId: id,
            avatar: picture?.data?.url
          }
        });
      }
  
      // Generate JWT token
      const authToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Set HTTP-only cookie
      res.cookie('token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
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
      console.error('Facebook login error:', error);
      res.status(401).json({ error: 'Invalid Facebook token' });
    }
  };

  export const googleCallback = async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
      }
      
      
      // Ensure all required environment variables are set
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error('Missing Google OAuth credentials in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
      }
  
      // Make sure the redirect URI matches exactly what you configured in Google Cloud Console
      const redirectUri = "http://localhost:5173/auth/google/callback";
      console.log('Using redirect URI:', redirectUri);
      
      try {
        // Exchange the code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
          })
        });
        
        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error('Google token exchange error:', errorData);
          return res.status(400).json({ error: 'Failed to exchange authorization code for tokens' });
        }
        
        const tokens = await tokenResponse.json();
        console.log('Received tokens from Google');
        
        // Check if id_token exists
        if (!tokens.id_token) {
          console.error('No ID token received from Google');
          
          // Use access token to get user info instead
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`
            }
          });
          
          if (!userInfoResponse.ok) {
            return res.status(400).json({ error: 'Failed to fetch user information from Google' });
          }
          
          const userInfo = await userInfoResponse.json();
          console.log('Retrieved user info using access token');
          
          // Process user info directly
          const { email, name, picture, id: googleId } = userInfo;
          
          if (!email) {
            return res.status(400).json({ error: 'Email is required from Google account' });
          }
          
          // Find or create user
          let user = await prisma.users.findUnique({ where: { email } });
          
          if (!user) {
            user = await prisma.users.create({
              data: {
                email,
                username: name || email.split('@')[0],
                role: 'member',
                provider: 'google',
                provider_id: googleId,
                avatar: picture,
                password: null
              }
            });
            console.log('Created new user from Google sign-in:', user.id);
          } else {
            // Update existing user's Google information if needed
            if (user.provider !== 'google' || user.provider_id !== googleId) {
              user = await prisma.users.update({
                where: { id: user.id },
                data: {
                  provider: 'google',
                  provider_id: googleId,
                  avatar: picture || user.avatar
                }
              });
              console.log('Updated existing user with Google information:', user.id);
            } else {
              console.log('Found existing Google user with email:', email);
            }
          }
          
          // Generate JWT
          const token = jwt.sign(
            { userId: user.id, role: user.role },
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
          
          return res.json({
            message: 'Google authentication successful',
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            }
          });
        }
        
        // If we have an ID token, verify it
        const ticket = await googleClient.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;
        
        if (!email) {
          return res.status(400).json({ error: 'Email is required from Google account' });
        }
        
        // Find or create user
        let user = await prisma.users.findUnique({ where: { email } });
        
        if (!user) {
          // Create a new user with Google data
          user = await prisma.users.create({
            data: {
              email,
              username: name || email.split('@')[0],
              role: 'member', // Default role
              provider: 'google',
              provider_id: googleId,
              avatar: picture,
              password: null // No password for OAuth users
            }
          });
          console.log('Created new user from Google sign-in:', user.id);
        } else {
          // Update existing user's Google information if needed
          if (user.provider !== 'google' || user.provider_id !== googleId) {
            user = await prisma.users.update({
              where: { id: user.id },
              data: {
                provider: 'google',
                provider_id: googleId,
                avatar: picture || user.avatar
              }
            });
            console.log('Updated existing user with Google information:', user.id);
          } else {
            console.log('Found existing Google user with email:', email);
          }
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, role: user.role },
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
        
        return res.json({
          message: 'Google authentication successful',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      } catch (tokenError) {
        console.error('Token exchange or verification error:', tokenError);
        return res.status(500).json({ error: 'Failed to authenticate with Google' });
      }
    } catch (error) {
      console.error('Google callback error:', error);
      res.status(500).json({ error: 'An unexpected error occurred during Google authentication' });
    }
  };