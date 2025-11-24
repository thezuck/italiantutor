# Italian Tutor

An interactive Italian learning application with AI-powered tutoring. This full-stack application consists of a React frontend and a Node.js/Express backend with PostgreSQL database.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Windows](#windows)
  - [macOS](#macos)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
  - [Windows](#running-on-windows)
  - [macOS](#running-on-macos)
- [Project Structure](#project-structure)
- [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download Node.js](https://nodejs.org/)
- **PostgreSQL** (version 14 or higher) - [Download PostgreSQL](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

### Verifying Installation

#### Windows (PowerShell or Command Prompt)
```powershell
node --version
npm --version
psql --version
```

#### macOS (Terminal)
```bash
node --version
npm --version
psql --version
```

## Installation

### Windows

1. **Clone or download the repository**
   ```powershell
   git clone <repository-url>
   cd italiantutor
   ```

2. **Install Backend Dependencies**
   ```powershell
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```powershell
   cd ../frontend
   npm install
   ```

4. **Set up PostgreSQL Database**
   
   - Open **pgAdmin** (PostgreSQL GUI) or use **psql** command line
   - Create a new database named `italiantutor`
   - Or use the provided script (see [Configuration](#configuration) section)

### macOS

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd italiantutor
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up PostgreSQL Database**
   
   - If you installed PostgreSQL via Homebrew, it should be running automatically
   - Create the database using psql:
   ```bash
   psql postgres
   CREATE DATABASE italiantutor;
   \q
   ```
   - Or use the provided script (see [Configuration](#configuration) section)

## Configuration

### Backend Configuration

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create environment file**
   ```bash
   # Windows (PowerShell)
   Copy-Item env.example .env
   
   # macOS / Linux
   cp env.example .env
   ```

3. **Edit the `.env` file** with your configuration:

   **Required settings:**
   ```env
   # JWT Secret - Generate a secure random string
   # On Windows PowerShell: [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   # On macOS/Linux: openssl rand -base64 32
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # Database connection
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/italiantutor
   
   # OpenAI API Key (required for chat functionality)
   OPENAI_API_KEY=your-openai-api-key-here
   OPENAI_MODEL=gpt-5-mini
   ```

   **Optional settings (with defaults):**
   ```env
   NODE_ENV=development
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   JWT_EXPIRES_IN=7d
   ```

4. **Set up the database**
   ```bash
   # Create database, run migrations, and seed data
   npm run setup
   
   # Or run individually:
   npm run create-db      # Create database
   npm run migrate        # Create tables
   npm run seed           # Add initial data
   ```

### Frontend Configuration

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Create environment file (optional)**
   
   The frontend will default to `http://localhost:3001/api` if no `.env` file is present. If you need to change the API URL:
   
   ```bash
   # Windows (PowerShell)
   New-Item -Path .env -ItemType File
   
   # macOS / Linux
   touch .env
   ```
   
   Add to `.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

## Running the Application

The application requires both the backend and frontend servers to be running simultaneously. You'll need **two terminal windows/tabs** - one for the backend and one for the frontend.

### Running on Windows

#### Terminal 1: Backend Server

1. **Open PowerShell or Command Prompt**
2. **Navigate to backend directory**
   ```powershell
   cd path\to\italiantutor\backend
   ```
3. **Start the backend server**
   ```powershell
   npm run dev
   ```
4. **Verify it's running** - You should see:
   ```
   Server running on port 3001
   Environment: development
   ✅ Connected to PostgreSQL database via Sequelize
   ```

#### Terminal 2: Frontend Server

1. **Open a new PowerShell or Command Prompt window**
2. **Navigate to frontend directory**
   ```powershell
   cd path\to\italiantutor\frontend
   ```
3. **Start the frontend server**
   ```powershell
   npm run dev
   ```
4. **Verify it's running** - You should see:
   ```
   VITE v6.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Running on macOS

#### Terminal 1: Backend Server

1. **Open Terminal**
2. **Navigate to backend directory**
   ```bash
   cd ~/path/to/italiantutor/backend
   ```
3. **Start the backend server**
   ```bash
   npm run dev
   ```
4. **Verify it's running** - You should see:
   ```
   Server running on port 3001
   Environment: development
   ✅ Connected to PostgreSQL database via Sequelize
   ```

#### Terminal 2: Frontend Server

1. **Open a new Terminal window or tab** (⌘T)
2. **Navigate to frontend directory**
   ```bash
   cd ~/path/to/italiantutor/frontend
   ```
3. **Start the frontend server**
   ```bash
   npm run dev
   ```
4. **Verify it's running** - You should see:
   ```
   VITE v6.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
italiantutor/
├── backend/              # Node.js/Express backend API
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Sequelize database models
│   ├── routes/          # API route handlers
│   ├── scripts/         # Database setup scripts
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
│
├── frontend/            # React/Vite frontend
│   ├── src/
│   │   ├── api/         # API client functions
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── package.json     # Frontend dependencies
│
└── README.md           # This file
```

## Additional Resources

- **Backend Documentation**: See [backend/README.md](backend/README.md) for detailed API documentation
- **Frontend Documentation**: See [frontend/README.md](frontend/README.md) for frontend-specific details

## Troubleshooting

### Database Connection Issues

**Windows:**
- Ensure PostgreSQL service is running: Check Services app or run `net start postgresql-x64-14` (adjust version number)
- Verify connection string in `.env` matches your PostgreSQL credentials

**macOS:**
- Check if PostgreSQL is running: `brew services list` (if installed via Homebrew)
- Start PostgreSQL if needed: `brew services start postgresql@14` (adjust version number)
- Verify connection string in `.env` matches your PostgreSQL credentials

### Port Already in Use

If port 3001 (backend) or 5173 (frontend) is already in use:

**Windows:**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS:**
```bash
# Find process using port 3001
lsof -ti:3001
# Kill process
kill -9 $(lsof -ti:3001)
```

### Module Not Found Errors

If you encounter module not found errors, try:

```bash
# In backend directory
cd backend
rm -rf node_modules package-lock.json
npm install

# In frontend directory
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Development Scripts

### Backend Scripts
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run create-db` - Create the database
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm run setup` - Run all setup steps (create-db, migrate, seed)

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Support

For issues or questions, please refer to the individual README files in the `backend/` and `frontend/` directories for more detailed documentation.

