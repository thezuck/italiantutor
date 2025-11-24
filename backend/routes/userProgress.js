import express from 'express';
import { uuidv7 } from 'uuidv7';
import { UserProgress } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get user progress
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { user_email, lesson_id } = req.query;
    
    // Ensure user can only access their own progress
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
    
    const progressRecords = await UserProgress.findAll({
      where: whereClause,
    });
    
    res.json(progressRecords.map(record => record.toJSON()));
  } catch (error) {
    next(error);
  }
});

// Create or update user progress
router.post('/',
  authenticateToken,
  [
    body('lesson_id').notEmpty(),
    body('completed').optional().isBoolean(),
    body('progress_percentage').optional().isInt({ min: 0, max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { lesson_id, completed = false, progress_percentage = 0 } = req.body;
      const user_email = req.user.email;

      // Check if progress exists
      const [progress, created] = await UserProgress.findOrCreate({
        where: {
          user_email,
          lesson_id,
        },
        defaults: {
          id: uuidv7(),
          user_email,
          lesson_id,
          completed,
          progress_percentage,
        },
      });

      if (!created) {
        // Update existing
        progress.completed = completed;
        progress.progress_percentage = progress_percentage;
        await progress.save();
      }

      res.status(created ? 201 : 200).json(progress.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

// Update user progress by ID
router.put('/:id',
  authenticateToken,
  [
    body('completed').optional().isBoolean(),
    body('progress_percentage').optional().isInt({ min: 0, max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { completed, progress_percentage } = req.body;

      // Verify ownership and find progress
      const progress = await UserProgress.findOne({
        where: {
          id,
          user_email: req.user.email,
        },
      });

      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }

      // Update fields
      if (completed !== undefined) {
        progress.completed = completed;
      }

      if (progress_percentage !== undefined) {
        progress.progress_percentage = progress_percentage;
      }

      if (completed === undefined && progress_percentage === undefined) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      await progress.save();

      res.json(progress.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

export default router;

