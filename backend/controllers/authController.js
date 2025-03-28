import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import { body, validationResult } from 'express-validator';
import cloudinary from 'cloudinary'; 

dotenv.config();
const prisma = new PrismaClient();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Registrasi User
export const register = async (req, res) => {
  await Promise.all([
    body("email").isEmail().withMessage("Format email tidak valid").run(req),
  ]);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
      const { role, username, email, password } = req.body;
      const img_file = req.file;

      // Validate input fields
      if (!role || !username || !email || !password || !img_file) {
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

      // Upload image to Cloudinary
      let cloudinaryUrl = null;
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream(
            { 
              folder: 'members', 
              transformation: [
                { quality: "auto", fetch_format: "auto" }
              ]
            }, 
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(img_file.buffer);
        });

        cloudinaryUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(400).json({ message: "Gagal mengunggah gambar" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Use a transaction to ensure data consistency across tables
      const result = await prisma.$transaction(async (prisma) => {
          // Create user record first
          const user = await prisma.users.create({
              data: { role, username, email, password: hashedPassword },
          });

          // If the role is 'member', also create a record in the members table
          // and link it in the member_user table
          if (role === 'member') {
              // Create member record
              const member = await prisma.members.create({
                  data: {
                      name: username,
                      email: email,
                      img_url: cloudinaryUrl, 
                      stat1: 50,   
                      stat2: 50,
                      stat3: 50,
                      stat4: 50,
                      stat5: 50
                  }
              });

              // Create relation in member_user table
              await prisma.member_user.create({
                  data: {
                      u_id: user.id,
                      m_id: member.id
                  }
              });

              return { user, member };
          }

          return { user };
      });

      res.status(201).json({ 
          message: 'User registered successfully', 
          user: result.user,
          member: result.member || null
      });
  } catch (error) {
      console.error('Registration error:', error);
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
    const { email, name, picture, sub: googleId } = payload;

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Find if user already exists
      let user = await prisma.users.findUnique({ where: { email } });

      let isNewUser = false;
      let member = null;

      if (!user) {
        // Create a new user with Google data
        isNewUser = true;
        user = await prisma.users.create({
          data: {
            email,
            username: name || email.split('@')[0],
            password: '', // No password for OAuth users
            role: 'member', // Default role
            provider: 'google',
            provider_id: googleId,
            avatar: picture
          }
        });
        
        // For new members, create an entry in the members table
        if (user.role === 'member') {
          member = await prisma.members.create({
            data: {
              name: user.username,
              email: user.email,
              img_url: picture || '',
              stat1: 50, // Default values
              stat2: 50,
              stat3: 50,
              stat4: 50,
              stat5: 50
            }
          });
          
          // Create the relationship in member_user table
          await prisma.member_user.create({
            data: {
              u_id: user.id,
              m_id: member.id
            }
          });
        }
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
        }
        
        // Check if the user is a member but doesn't have a member record
        if (user.role === 'member') {
          // Check if user already has a member record
          const existingMemberRelation = await prisma.member_user.findFirst({
            where: { u_id: user.id }
          });
          
          if (!existingMemberRelation) {
            // Create missing member record
            member = await prisma.members.create({
              data: {
                name: user.username,
                email: user.email,
                img_url: picture || '',
                stat1: 50,
                stat2: 50,
                stat3: 50,
                stat4: 50,
                stat5: 50
              }
            });
            
            // Create the relationship
            await prisma.member_user.create({
              data: {
                u_id: user.id,
                m_id: member.id
              }
            });
          }
        }
      }
      
      return { user, isNewUser, member };
    });

    // Generate JWT token
    const authToken = jwt.sign(
      { userId: result.user.id, role: result.user.role },
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
      message: result.isNewUser ? 'Account created and login successful' : 'Login successful',
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
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
      
      let userInfo;
      let googleId;
      let email;
      let name;
      let picture;
      
      // Check if id_token exists
      if (!tokens.id_token) {
        console.log('No ID token received from Google, using access token to get user info');
        
        // Use access token to get user info instead
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`
          }
        });
        
        if (!userInfoResponse.ok) {
          return res.status(400).json({ error: 'Failed to fetch user information from Google' });
        }
        
        userInfo = await userInfoResponse.json();
        console.log('Retrieved user info using access token');
        
        // Extract user info
        email = userInfo.email;
        name = userInfo.name;
        picture = userInfo.picture;
        googleId = userInfo.id;
      } else {
        // Verify the ID token
        const ticket = await googleClient.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
        googleId = payload.sub;
      }
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required from Google account' });
      }
      
      // Use a transaction to ensure data consistency
      const result = await prisma.$transaction(async (prisma) => {
        // Find if user already exists
        let user = await prisma.users.findUnique({ where: { email } });
        let isNewUser = false;
        let member = null;
        
        if (!user) {
          // Create a new user with Google data
          isNewUser = true;
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
          
          // For new members, create entry in members and member_user tables
          if (user.role === 'member') {
            member = await prisma.members.create({
              data: {
                name: user.username,
                email: user.email,
                img_url: picture || '',
                stat1: 50, // Default starting values
                stat2: 50,
                stat3: 50,
                stat4: 50,
                stat5: 50
              }
            });
            
            // Create the relationship in member_user table
            await prisma.member_user.create({
              data: {
                u_id: user.id,
                m_id: member.id
              }
            });
            
            console.log('Created member record and linked to user:', member.id);
          }
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
          
          // Check if the user is a member but doesn't have a member record
          if (user.role === 'member') {
            // Check if user already has a member record
            const existingMemberRelation = await prisma.member_user.findFirst({
              where: { u_id: user.id }
            });
            
            if (!existingMemberRelation) {
              // Create missing member record
              member = await prisma.members.create({
                data: {
                  name: user.username,
                  email: user.email,
                  img_url: picture || '',
                  stat1: 50,
                  stat2: 50,
                  stat3: 50,
                  stat4: 50,
                  stat5: 50
                }
              });
              
              // Create the relationship
              await prisma.member_user.create({
                data: {
                  u_id: user.id,
                  m_id: member.id
                }
              });
              
              console.log('Created missing member record for existing user:', member.id);
            }
          }
        }
        
        return { user, isNewUser, member };
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: result.user.id, role: result.user.role },
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
        message: result.isNewUser ? 'Account created and login successful' : 'Google authentication successful',
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role
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