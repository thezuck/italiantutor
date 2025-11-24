# ItalianLearn Backend API

Express.js backend with PostgreSQL database for the ItalianLearn application.

## Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `env.example`):
```bash
cp env.example .env
```

3. Update `.env` with your configuration. See `env.example` for all available options:
```
# Required
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database (use either DATABASE_URL or individual parameters)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/italiantutor

# Optional (with defaults)
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_EXPIRES_IN=7d
```

4. Create the database (or use the script):
```bash
# Option 1: Use the provided script
npm run create-db

# Option 2: Use psql directly
PGPASSWORD=admin psql -U postgres -h localhost -c "CREATE DATABASE italiantutor"
```

5. Run migrations to create tables:
```bash
npm run migrate
```

6. Seed the database with initial data:
```bash
npm run seed
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout (client-side token removal)

### Lessons
- `GET /api/lessons` - Get all lessons (optional auth)
  - Query params: `sortBy` (title, created_date, updated_date), `limit`
- `GET /api/lessons/:id` - Get single lesson (optional auth)

### Chat Messages
- `GET /api/chat-messages` - Get user's chat messages (requires auth)
  - Query params: `user_email`, `lesson_id`, `sortBy`, `limit`
- `POST /api/chat-messages` - Create new message (requires auth)
  - Body: `{ message, role, lesson_id? }`

### User Progress
- `GET /api/user-progress` - Get user progress (requires auth)
  - Query params: `user_email`, `lesson_id`
- `POST /api/user-progress` - Create or update progress (requires auth)
  - Body: `{ lesson_id, completed?, progress_percentage? }`
- `PUT /api/user-progress/:id` - Update progress by ID (requires auth)
  - Body: `{ completed?, progress_percentage? }`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are stored in localStorage on the frontend and sent with each authenticated request.

## Database Schema

### Users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `full_name` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Lessons
- `id` (VARCHAR PRIMARY KEY)
- `title`, `description`, `content` (TEXT)
- `level` (VARCHAR: beginner, intermediate, advanced)
- `topics` (JSONB array)
- `duration` (VARCHAR)
- `created_date`, `updated_date` (TIMESTAMP)
- `created_by_id` (VARCHAR)
- `is_sample` (BOOLEAN)

### Chat Messages
- `id` (VARCHAR PRIMARY KEY)
- `user_email` (VARCHAR)
- `message` (TEXT)
- `role` (VARCHAR: user, tutor)
- `lesson_id` (VARCHAR, FK to lessons)
- `created_date`, `updated_date` (TIMESTAMP)
- `created_by_id` (VARCHAR)
- `is_sample` (BOOLEAN)

### User Progress
- `id` (VARCHAR PRIMARY KEY)
- `user_email` (VARCHAR)
- `lesson_id` (VARCHAR, FK to lessons)
- `completed` (BOOLEAN)
- `progress_percentage` (INTEGER 0-100)
- `created_date`, `updated_date` (TIMESTAMP)
- `created_by_by_id` (VARCHAR)
- `is_sample` (BOOLEAN)
- UNIQUE constraint on (user_email, lesson_id)

## Environment Variables

All environment variables are loaded from `.env` file and centralized in `config/env.js`. 

**Required variables:**
- `JWT_SECRET` - Secret key for JWT token signing (required in production)

**Optional variables (with defaults):**
- `NODE_ENV` - Environment mode (development/production, default: development)
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - Full PostgreSQL connection string (recommended)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Individual database connection parameters
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:5173)

See `env.example` for a complete template.

## Development

### Scripts
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run create-db` - Create the database (if it doesn't exist)
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm run setup` - Run all setup steps (create-db, migrate, seed)

### Error Handling

The API uses centralized error handling middleware. Errors are returned in the format:
```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

