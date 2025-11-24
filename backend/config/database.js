import { Sequelize } from 'sequelize';
import env from './env.js';

// Create Sequelize instance
const sequelize = env.DATABASE_URL
  ? new Sequelize(env.DATABASE_URL, {
      dialect: 'postgres',
      logging: env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    })
  : new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dialect: 'postgres',
      logging: env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database via Sequelize');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
    process.exit(-1);
  });

export default sequelize;

