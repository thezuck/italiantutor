import express from 'express';
import { uuidv7 } from 'uuidv7';
import { ChatMessage } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import env from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Initialize OpenAI client only if API key is provided
let openai = null;
if (env.OPENAI_API_KEY) {
  console.log('[DEBUG] Initializing OpenAI client...');
  openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
  console.log('[DEBUG] OpenAI client initialized successfully');
} else {
  console.warn('[DEBUG] OpenAI API key not found - AI features will be disabled');
}

// Load system prompt
let systemPrompt = '';
try {
  const promptPath = join(__dirname, '../prompt.txt');
  systemPrompt = await readFile(promptPath, 'utf-8');
  console.log('[DEBUG] System prompt loaded successfully, length:', systemPrompt.length);
} catch (error) {
  console.error('[DEBUG] Error loading prompt.txt:', error);
  systemPrompt = 'You are a friendly and enthusiastic Italian language tutor.';
  console.log('[DEBUG] Using default system prompt');
}

// Get chat messages for user
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    console.log('[DEBUG] GET /chat-messages - Request received');
    const { user_email, lesson_id, sortBy = 'created_date', limit = 100 } = req.query;
    console.log('[DEBUG] Query params:', { user_email, lesson_id, sortBy, limit });
    console.log('[DEBUG] Authenticated user:', req.user.email);
    
    // Ensure user can only access their own messages
    const email = user_email || req.user.email;
    if (email !== req.user.email) {
      console.warn('[DEBUG] Access denied - email mismatch');
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
    
    console.log('[DEBUG] Query options:', JSON.stringify(queryOptions, null, 2));
    const messages = await ChatMessage.findAll(queryOptions);
    console.log('[DEBUG] Found', messages.length, 'messages');
    res.json(messages.map(msg => msg.toJSON()));
  } catch (error) {
    console.error('[DEBUG] Error in GET /chat-messages:', error);
    next(error);
  }
});

// Create new chat message
router.post('/',
  authenticateToken,
  [
    body('message').trim().notEmpty(),
    body('role').optional().isIn(['user', 'tutor']),
  ],
  async (req, res, next) => {
    try {
      console.log('[DEBUG] POST /chat-messages - Request received');
      console.log('[DEBUG] Request body:', JSON.stringify(req.body, null, 2));
      console.log('[DEBUG] Authenticated user:', req.user.email);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.warn('[DEBUG] Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, role = 'user', lesson_id } = req.body;
      const user_email = req.user.email;
      
      console.log('[DEBUG] Processing message:', { message, role, lesson_id, user_email });
      console.log('[DEBUG] OpenAI client available:', !!openai);
      console.log('[DEBUG] OpenAI API key set:', !!env.OPENAI_API_KEY);
      
      // If this is a user message and OpenAI is configured, fetch previous messages first for context
      let previousMessages = [];
      if (role === 'user' && env.OPENAI_API_KEY) {
        console.log('[DEBUG] Fetching previous messages for context...');
        previousMessages = await ChatMessage.findAll({
          where: {
            user_email,
            ...(lesson_id ? { lesson_id } : {}),
          },
          order: [['created_date', 'ASC']],
          limit: 50, // Limit to last 50 messages for context
        });
        console.log('[DEBUG] Found', previousMessages.length, 'previous messages');
      }
      
      // Create user message
      console.log('[DEBUG] Creating user message...');
      const userMessageId = uuidv7();
      const userMessage = await ChatMessage.create({
        id: userMessageId,
        user_email,
        message,
        role: 'user',
        lesson_id: lesson_id || null,
      });
      console.log('[DEBUG] User message created:', userMessage.id);

      // If this is a user message, generate AI response
      if (role === 'user' && openai && env.OPENAI_API_KEY) {
        try {
          console.log('[DEBUG] Generating AI response...');
          console.log('[DEBUG] Previous messages count:', previousMessages.length);
          console.log('[DEBUG] System prompt length:', systemPrompt.length);

          // Build messages array for OpenAI
          const messages = [
            { role: 'system', content: systemPrompt },
            ...previousMessages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.message,
            })),
            { role: 'user', content: message },
          ];

          console.log('[DEBUG] Total messages for OpenAI:', messages.length);
          console.log('[DEBUG] Calling OpenAI API with model:', env.OPENAI_MODEL);
          console.log('[DEBUG] Full prompt/messages being sent:');
          console.log(JSON.stringify(messages, null, 2));

          // Call OpenAI API
          // Note: For reasoning models, we need higher token limits as reasoning tokens count separately
          const completion = await openai.chat.completions.create({
            model: env.OPENAI_MODEL,
            messages: messages,
            max_completion_tokens: 4000, // Increased to account for reasoning tokens
          });

          console.log('[DEBUG] OpenAI API response received');
          console.log('[DEBUG] Full completion object:');
          console.log(JSON.stringify(completion, null, 2));
          console.log('[DEBUG] completion.choices:', completion.choices);
          console.log('[DEBUG] completion.choices[0]:', completion.choices?.[0]);
          console.log('[DEBUG] completion.choices[0]?.message:', completion.choices?.[0]?.message);
          console.log('[DEBUG] completion.choices[0]?.message?.content:', completion.choices?.[0]?.message?.content);
          
          const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
          console.log('[DEBUG] AI response length:', aiResponse.length);
          console.log('[DEBUG] AI response full content:', aiResponse);
          console.log('[DEBUG] AI response is empty/undefined:', !completion.choices[0]?.message?.content);

          // Create tutor response message
          console.log('[DEBUG] Creating tutor message...');
          const tutorMessageId = uuidv7();
          const tutorMessage = await ChatMessage.create({
            id: tutorMessageId,
            user_email,
            message: aiResponse,
            role: 'tutor',
            lesson_id: lesson_id || null,
          });
          console.log('[DEBUG] Tutor message created:', tutorMessage.id);

          // Return both messages
          console.log('[DEBUG] Returning both messages to client');
          return res.status(201).json({
            userMessage: userMessage.toJSON(),
            tutorMessage: tutorMessage.toJSON(),
          });
        } catch (openaiError) {
          console.error('[DEBUG] OpenAI API error:', openaiError);
          console.error('[DEBUG] OpenAI error details:', {
            message: openaiError.message,
            status: openaiError.status,
            code: openaiError.code,
          });
          // Still return the user message even if AI fails
          return res.status(201).json({
            userMessage: userMessage.toJSON(),
            tutorMessage: null,
            error: 'Failed to generate AI response',
          });
        }
      }

      // If role is tutor or no OpenAI key, just return the message
      console.log('[DEBUG] Skipping AI response (role:', role, ', openai:', !!openai, ', key:', !!env.OPENAI_API_KEY, ')');
      console.log('[DEBUG] Returning user message only');
      res.status(201).json(userMessage.toJSON());
    } catch (error) {
      console.error('[DEBUG] Error in POST /chat-messages:', error);
      console.error('[DEBUG] Error stack:', error.stack);
      next(error);
    }
  }
);

export default router;

