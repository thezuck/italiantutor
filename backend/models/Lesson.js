import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['beginner', 'intermediate', 'advanced']],
    },
  },
  topics: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'lessons',
  timestamps: true,
  createdAt: 'created_date',
  updatedAt: 'updated_date',
  underscored: true,
});

export default Lesson;

