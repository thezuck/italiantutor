import sequelize from '../config/database.js';
import User from './User.js';
import Lesson from './Lesson.js';
import ChatMessage from './ChatMessage.js';
import UserProgress from './UserProgress.js';

// Define associations
ChatMessage.belongsTo(Lesson, {
  foreignKey: 'lesson_id',
  as: 'lesson',
});

Lesson.hasMany(ChatMessage, {
  foreignKey: 'lesson_id',
  as: 'chatMessages',
});

UserProgress.belongsTo(Lesson, {
  foreignKey: 'lesson_id',
  as: 'lesson',
});

Lesson.hasMany(UserProgress, {
  foreignKey: 'lesson_id',
  as: 'userProgress',
});

export {
  sequelize,
  User,
  Lesson,
  ChatMessage,
  UserProgress,
};

