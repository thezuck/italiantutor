import '../config/env.js'; // Load environment variables
import { sequelize, User, Lesson, ChatMessage, UserProgress } from '../models/index.js';

const createTables = async () => {
  try {
    // Sync all models - this will create tables if they don't exist
    // { alter: true } will update existing tables to match models
    // { force: false } ensures we don't drop existing tables
    await sequelize.sync({ alter: false });
    
    console.log('✅ Database tables created/verified successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

createTables()
  .then(async () => {
    console.log('Migration completed');
    await sequelize.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Migration failed:', error);
    await sequelize.close();
    process.exit(1);
  });

