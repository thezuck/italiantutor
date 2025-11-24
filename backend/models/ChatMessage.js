import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  user_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['user', 'tutor']],
    },
  },
  lesson_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    references: {
      model: 'lessons',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_by_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_sample: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'chat_messages',
  timestamps: true,
  createdAt: 'created_date',
  updatedAt: 'updated_date',
  underscored: true,
});

export default ChatMessage;

