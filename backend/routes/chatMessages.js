import express from 'express';
import { uuidv7 } from 'uuidv7';
import { ChatMessage } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get chat messages for user
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { user_email, lesson_id, sortBy = 'created_date', limit = 100 } = req.query;
    
    // Ensure user can only access their own messages
    const email = user_email || req.user.email;
    if (email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const whereClause = {
      user_email: email,
    };
    
    if (lesson_id) {
      whereClause.lesson_id = lesson_id;
    }
    
    // Add sorting
    const validSortFields = ['created_date', 'updated_date'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_date';
    
    const queryOptions = {
      where: whereClause,
      order: [[sortField, 'ASC']],
    };
    
    // Add limit
    const limitNum = parseInt(limit);
    if (!isNaN(limitNum) && limitNum > 0) {
      queryOptions.limit = limitNum;
    }
    
    const messages = await ChatMessage.findAll(queryOptions);
    res.json(messages.map(msg => msg.toJSON()));
  } catch (error) {
    next(error);
  }
});

// Create new chat message
router.post('/',
  authenticateToken,
  [
    body('message').trim().notEmpty(),
    body('role').isIn(['user', 'tutor']),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, role, lesson_id } = req.body;
      const user_email = req.user.email;
      const id = uuidv7();

      const chatMessage = await ChatMessage.create({
        id,
        user_email,
        message,
        role,
        lesson_id: lesson_id || null,
      });

      res.status(201).json(chatMessage.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

export default router;

