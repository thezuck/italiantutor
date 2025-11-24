import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import authRoutes from './routes/auth.js';
import lessonsRoutes from './routes/lessons.js';
import chatMessagesRoutes from './routes/chatMessages.js';
import userProgressRoutes from './routes/userProgress.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/chat-messages', chatMessagesRoutes);
app.use('/api/user-progress', userProgressRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

