# ItalianLearn Frontend

React + Vite frontend for the ItalianLearn application.

## Setup

### Prerequisites
- Node.js 18+
- Backend API running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:3001/api
```

### Running the App

Development mode:
```bash
npm run dev
```

The app will run on `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Features

- **Home Page**: Browse available Italian lessons
- **Chat**: Interactive AI tutor chat interface
- **Lesson Details**: View lesson content and track progress
- **User Progress**: Track completion status for each lesson

## Tech Stack

- React 18
- Vite
- React Router
- React Query (TanStack Query)
- Tailwind CSS
- Radix UI components
- Framer Motion

## API Integration

The frontend communicates with the backend API via REST endpoints. Authentication is handled via JWT tokens stored in localStorage.

Make sure the backend server is running before starting the frontend.
