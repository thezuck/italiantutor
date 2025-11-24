import express from 'express';
import { uuidv7 } from 'uuidv7';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get current user
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.user.email },
      attributes: ['id', 'email', 'full_name', 'created_at'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
});

// Register new user
router.post('/register', 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, full_name } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        where: { email },
        attributes: ['id'],
      });

      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate UUID7 for user ID
      const userId = uuidv7();

      // Create user
      const user = await User.create({
        id: userId,
        email,
        password_hash: hashedPassword,
        full_name,
      });

      // Generate token
      const token = jwt.sign(
        { email: user.email, id: user.id },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          created_at: user.created_at,
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password_hash', 'full_name'],
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { email: user.email, id: user.id },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can add token blacklisting here if needed
  res.json({ message: 'Logged out successfully' });
});

export default router;

