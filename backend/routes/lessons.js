import express from 'express';
import { Lesson } from '../models/index.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all lessons
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { sortBy = 'title', limit } = req.query;
    
    // Build query options
    const validSortFields = ['title', 'created_date', 'updated_date'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'title';
    
    const queryOptions = {
      where: {
        is_sample: false,
      },
      order: [[sortField, 'ASC']],
    };
    
    // Add limit
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        queryOptions.limit = limitNum;
      }
    }
    
    const lessons = await Lesson.findAll(queryOptions);
    
    // Parse topics JSON and validate lessons
    const validLessons = [];
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    
    lessons.forEach(lesson => {
      const lessonData = lesson.toJSON();
      
      // Ensure topics is an array
      const parsedLesson = {
        ...lessonData,
        topics: (() => {
          if (!lessonData.topics) return [];
          if (typeof lessonData.topics === 'string') {
            try {
              return JSON.parse(lessonData.topics);
            } catch {
              return [];
            }
          }
          return Array.isArray(lessonData.topics) ? lessonData.topics : [];
        })()
      };
      
      // Validate lesson has required fields for proper display
      const isValid = 
        parsedLesson.title && 
        parsedLesson.title.trim() !== '' &&
        parsedLesson.level && 
        parsedLesson.level.trim() !== '' &&
        validLevels.includes(parsedLesson.level.toLowerCase()) &&
        parsedLesson.description && 
        parsedLesson.description.trim() !== '';
      
      if (isValid) {
        validLessons.push(parsedLesson);
      } else {
        // Log warning for invalid lesson
        console.warn(`⚠️  Skipping invalid lesson (ID: ${parsedLesson.id || 'unknown'}):`, {
          id: parsedLesson.id,
          title: parsedLesson.title || 'MISSING',
          level: parsedLesson.level || 'MISSING',
          description: parsedLesson.description ? 'present' : 'MISSING',
          issues: [
            !parsedLesson.title || parsedLesson.title.trim() === '' ? 'missing or empty title' : null,
            !parsedLesson.level || parsedLesson.level.trim() === '' ? 'missing or empty level' : null,
            !validLevels.includes(parsedLesson.level?.toLowerCase()) ? `invalid level (must be one of: ${validLevels.join(', ')})` : null,
            !parsedLesson.description || parsedLesson.description.trim() === '' ? 'missing or empty description' : null
          ].filter(Boolean)
        });
      }
    });
    
    res.json(validLessons);
  } catch (error) {
    next(error);
  }
});

// Get single lesson by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findByPk(id);
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    const lessonData = lesson.toJSON();
    // Parse topics JSON (PostgreSQL JSONB is already parsed, but handle string case)
    const parsedLesson = {
      ...lessonData,
      topics: (() => {
        if (!lessonData.topics) return [];
        if (typeof lessonData.topics === 'string') {
          try {
            return JSON.parse(lessonData.topics);
          } catch {
            return [];
          }
        }
        return Array.isArray(lessonData.topics) ? lessonData.topics : [];
      })()
    };
    
    // Validate lesson has required fields
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    const isValid = 
      parsedLesson.title && 
      parsedLesson.title.trim() !== '' &&
      parsedLesson.level && 
      parsedLesson.level.trim() !== '' &&
      validLevels.includes(parsedLesson.level.toLowerCase()) &&
      parsedLesson.description && 
      parsedLesson.description.trim() !== '';
    
    if (!isValid) {
      // Log warning for invalid lesson
      console.warn(`⚠️  Invalid lesson requested (ID: ${id}):`, {
        id: parsedLesson.id,
        title: parsedLesson.title || 'MISSING',
        level: parsedLesson.level || 'MISSING',
        description: parsedLesson.description ? 'present' : 'MISSING',
        issues: [
          !parsedLesson.title || parsedLesson.title.trim() === '' ? 'missing or empty title' : null,
          !parsedLesson.level || parsedLesson.level.trim() === '' ? 'missing or empty level' : null,
          !validLevels.includes(parsedLesson.level?.toLowerCase()) ? `invalid level (must be one of: ${validLevels.join(', ')})` : null,
          !parsedLesson.description || parsedLesson.description.trim() === '' ? 'missing or empty description' : null
        ].filter(Boolean)
      });
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(parsedLesson);
  } catch (error) {
    next(error);
  }
});

export default router;

