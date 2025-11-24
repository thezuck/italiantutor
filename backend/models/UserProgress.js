import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  user_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  lesson_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: 'lessons',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
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
  tableName: 'user_progress',
  timestamps: true,
  createdAt: 'created_date',
  updatedAt: 'updated_date',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_email', 'lesson_id'],
    },
  ],
});

export default UserProgress;

