import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the backend directory
const envPath = join(__dirname, '../.env');
console.log('[DEBUG] Looking for .env file at:', envPath);
console.log('[DEBUG] .env file exists:', existsSync(envPath));

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.warn('[DEBUG] Error loading .env file:', result.error);
} else {
  console.log('[DEBUG] .env file loaded successfully');
}

console.log('[DEBUG] Environment variables loaded:');
console.log('[DEBUG] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('[DEBUG] OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
console.log('[DEBUG] OPENAI_API_KEY preview:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'not set');
console.log('[DEBUG] process.env.OPENAI_MODEL (raw):', process.env.OPENAI_MODEL);
console.log('[DEBUG] process.env.OPENAI_MODEL type:', typeof process.env.OPENAI_MODEL);

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.warn(`⚠️  Warning: Missing required environment variables: ${missingVars.join(', ')}`);
  console.warn('   Please check your .env file');
}

// Export environment configuration
export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_NAME: process.env.DB_NAME || 'italiantutor',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is required in production');
    }
    return 'dev-secret-change-in-production';
  })(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
};

console.log('[DEBUG] Exported env.OPENAI_API_KEY exists:', !!env.OPENAI_API_KEY);
console.log('[DEBUG] Exported env.OPENAI_API_KEY length:', env.OPENAI_API_KEY?.length || 0);
console.log('[DEBUG] Exported env.OPENAI_MODEL:', env.OPENAI_MODEL);

// Validate JWT_SECRET in production
if (env.NODE_ENV === 'production' && (!env.JWT_SECRET || env.JWT_SECRET === 'dev-secret-change-in-production')) {
  throw new Error('JWT_SECRET must be set to a secure value in production');
}

export default env;

