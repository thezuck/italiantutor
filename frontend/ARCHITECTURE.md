# ItalianLearn - Architecture Description

## Overview

ItalianLearn is a modern, single-page web application designed to help users learn Italian through interactive lessons and an AI-powered tutoring system. The application is built using React with Vite as the build tool, leveraging the Base44 SDK for backend services, authentication, and data management.

## Technology Stack

### Core Framework & Build Tools
- **React 18.2.0** - UI library
- **Vite 6.1.0** - Build tool and development server
- **React Router DOM 7.2.0** - Client-side routing
- **@tanstack/react-query** - Server state management (used but may need to be added to dependencies)

### Backend Integration
- **@base44/sdk 0.1.2** - Backend-as-a-Service SDK providing:
  - Authentication
  - Entity management (Lessons, ChatMessages, UserProgress)
  - Integration services (LLM, Email, File operations)

### UI Framework & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (comprehensive set of components)
- **Framer Motion 12.4.7** - Animation library
- **Lucide React 0.475.0** - Icon library
- **shadcn/ui** - Component library built on Radix UI and Tailwind

### Form & Validation
- **React Hook Form 7.54.2** - Form state management
- **Zod 3.24.2** - Schema validation
- **@hookform/resolvers 4.1.2** - Form validation resolvers

### Additional Libraries
- **Sonner 2.0.1** - Toast notifications
- **next-themes 0.4.4** - Theme management (dark mode support)
- **date-fns 3.6.0** - Date utilities
- **recharts 2.15.1** - Charting library

## Project Structure

```
italiano-ai-a294a856/
├── src/
│   ├── api/                    # Backend integration layer
│   │   ├── base44Client.js    # Base44 SDK client configuration
│   │   ├── entities.js        # Entity exports (Lesson, ChatMessage, UserProgress, User)
│   │   └── integrations.js    # Integration service exports (LLM, Email, File ops)
│   ├── components/
│   │   ├── chat/              # Chat-specific components
│   │   │   ├── ChatInput.jsx
│   │   │   └── ChatMessageBubble.jsx
│   │   ├── lessons/           # Lesson-specific components
│   │   │   └── LessonCard.jsx
│   │   └── ui/                # Reusable UI components (shadcn/ui)
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── textarea.jsx
│   │       ├── badge.jsx
│   │       ├── toaster.jsx
│   │       └── ... (40+ UI components)
│   ├── hooks/
│   │   └── use-mobile.jsx     # Mobile detection hook
│   ├── lib/
│   │   └── utils.js           # Utility functions (cn helper for class merging)
│   ├── pages/                 # Route-level page components
│   │   ├── index.jsx          # Router configuration
│   │   ├── Layout.jsx          # Main layout wrapper with navigation
│   │   ├── Home.jsx            # Landing page with lessons overview
│   │   ├── Chat.jsx            # AI tutor chat interface
│   │   └── LessonDetail.jsx    # Individual lesson view
│   ├── utils/
│   │   └── index.ts           # Utility functions (createPageUrl)
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Application entry point
│   ├── index.css              # Global styles and Tailwind directives
│   └── App.css                # App-specific styles
├── public/                    # Static assets
├── index.html                 # HTML entry point
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── components.json            # shadcn/ui configuration
├── jsconfig.json             # JavaScript/JSX path aliases
└── package.json              # Dependencies and scripts
```

## Architecture Layers

### 1. Presentation Layer

#### Entry Point (`main.jsx`)
- Initializes React application
- Renders root `App` component
- Imports global CSS styles

#### Root Component (`App.jsx`)
- Minimal wrapper component
- Renders `Pages` component (router)
- Includes `Toaster` for global notifications

#### Routing (`pages/index.jsx`)
- Configures React Router with BrowserRouter
- Defines route-to-component mapping:
  - `/` → Home
  - `/Home` → Home
  - `/Chat` → Chat
  - `/LessonDetail` → LessonDetail (with query params)
- Implements dynamic page resolution based on URL

#### Layout Component (`pages/Layout.jsx`)
- Provides consistent navigation and structure
- Features:
  - Sticky navigation bar with logo
  - Desktop and mobile-responsive menu
  - User authentication display
  - Logout functionality
  - Active route highlighting
- Manages user state via Base44 auth

### 2. Page Components

#### Home Page (`pages/Home.jsx`)
**Purpose**: Landing page displaying available lessons and user progress

**Features**:
- Hero section with call-to-action buttons
- Statistics dashboard (total lessons, completed count, AI availability)
- Grid of lesson cards
- Progress tracking integration

**Data Management**:
- Fetches lessons using React Query: `base44.entities.Lesson.list()`
- Fetches user progress: `base44.entities.UserProgress.filter()`
- Calculates completion statistics

**State**:
- User information (from Base44 auth)
- Lessons list (from React Query cache)
- User progress data (from React Query cache)

#### Chat Page (`pages/Chat.jsx`)
**Purpose**: Interactive AI tutor chat interface

**Features**:
- Real-time message display
- Message input with Enter key support
- Typing indicators
- Auto-scroll to latest message
- Empty state with welcome message

**Data Management**:
- Fetches chat messages: `base44.entities.ChatMessage.filter()`
- Creates messages via mutations
- Currently uses mock AI responses (fakeResponses array)
- Query invalidation on message creation

**State**:
- User information
- Messages list
- Typing indicator
- Message input state (handled by ChatInput component)

**Note**: Currently implements fake AI responses. Integration with actual LLM service (via `base44.integrations.Core.InvokeLLM`) is prepared but not yet implemented.

#### Lesson Detail Page (`pages/LessonDetail.jsx`)
**Purpose**: Detailed view of individual lessons

**Features**:
- Lesson content display
- Progress tracking
- Mark as complete functionality
- Topic badges
- Level indicators (beginner/intermediate/advanced)
- Navigation back to home

**Data Management**:
- Fetches lesson from lessons list (filtered by URL param)
- Fetches user progress for specific lesson
- Creates/updates progress records via mutations

**State**:
- User information
- Lesson data (from lessons query)
- Progress data (from userProgress query)
- Mutation state for completion

### 3. Component Layer

#### Chat Components

**ChatInput** (`components/chat/ChatInput.jsx`)
- Textarea input with auto-resize
- Send button with loading state
- Enter key submission (Shift+Enter for new line)
- Disabled state during loading

**ChatMessageBubble** (`components/chat/ChatMessageBubble.jsx`)
- Displays individual chat messages
- Different styling for user vs. tutor messages
- Avatar icons (User/Bot)
- Timestamp display
- Framer Motion animations

#### Lesson Components

**LessonCard** (`components/lessons/LessonCard.jsx`)
- Displays lesson preview in grid
- Shows completion status
- Level and duration badges
- Topic tags
- Hover effects with animations
- Links to lesson detail page

#### UI Components (`components/ui/`)
Comprehensive set of reusable components built on Radix UI:
- Form controls (Button, Input, Textarea, Select, Checkbox, etc.)
- Layout (Card, Separator, Tabs, Accordion)
- Feedback (Toast, Alert, Dialog, Popover)
- Navigation (Dropdown Menu, Context Menu, Navigation Menu)
- Data display (Table, Badge, Avatar, Progress)
- And 30+ more components

All components follow shadcn/ui patterns with:
- Tailwind CSS styling
- Radix UI accessibility
- TypeScript-ready (though project uses JSX)
- Customizable via props and CSS variables

### 4. API Integration Layer

#### Base44 Client (`api/base44Client.js`)
- Singleton client instance
- Configured with app ID: `6924082bdb41c0c3a294a856`
- Authentication required for all operations
- Provides access to:
  - `base44.auth` - Authentication methods
  - `base44.entities` - Entity CRUD operations
  - `base44.integrations` - Integration services

#### Entity Exports (`api/entities.js`)
Exports entity handlers:
- `Lesson` - Lesson management
- `ChatMessage` - Chat message storage
- `UserProgress` - User progress tracking
- `User` - User authentication (via `base44.auth`)

#### Integration Exports (`api/integrations.js`)
Exports integration services:
- `InvokeLLM` - Large Language Model invocation
- `SendEmail` - Email sending
- `UploadFile` - File upload
- `GenerateImage` - Image generation
- `ExtractDataFromUploadedFile` - File data extraction
- `CreateFileSignedUrl` - Signed URL generation
- `UploadPrivateFile` - Private file upload

### 5. State Management

#### Server State (React Query)
- **Query Keys**:
  - `["lessons"]` - All lessons
  - `["chatMessages", userEmail]` - User's chat messages
  - `["userProgress", userEmail]` - User's progress records
  - `["userProgress", userEmail, lessonId]` - Specific lesson progress

- **Mutations**:
  - Chat message creation
  - User progress creation/update

- **Cache Invalidation**:
  - Messages invalidated on new message creation
  - Progress invalidated on completion

**Note**: React Query provider setup is not visible in the codebase but is required for the hooks to work. It should be added to `App.jsx` or `main.jsx`.

#### Local State (React useState)
- User information (fetched on mount)
- UI state (mobile menu, typing indicators, form inputs)
- Component-specific state

### 6. Styling Architecture

#### Tailwind CSS Configuration
- Custom color palette with CSS variables
- Extended theme with:
  - Custom border radius variables
  - Color system (background, foreground, card, popover, etc.)
  - Sidebar-specific colors
  - Chart colors
  - Animation keyframes (accordion)

#### Custom Styling
- **CSS Variables**: Defined in `index.css` for theme support
- **Custom Colors**: Coral color palette defined inline in Layout.jsx
- **Gradient Backgrounds**: Used throughout for visual appeal
- **Responsive Design**: Mobile-first approach with breakpoints

#### Design System
- **Primary Color**: Green (600-700 shades)
- **Accent Color**: Coral (50-700 shades)
- **Neutral**: Gray scale
- **Typography**: System fonts with Inter fallback
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corners (lg, md, sm variants)

### 7. Routing Architecture

#### Route Structure
```
/ → Home
/Home → Home
/Chat → Chat
/LessonDetail?id=<lessonId> → LessonDetail
```

#### Navigation
- Programmatic navigation via `react-router-dom` Link components
- URL generation via `createPageUrl()` utility
- Active route detection in Layout component
- Query parameter handling for lesson details

### 8. Authentication Flow

#### Authentication Method
- Base44 SDK handles authentication
- `base44.auth.me()` - Get current user
- `base44.auth.logout()` - Logout user
- Authentication required for all operations (`requiresAuth: true`)

#### User State Management
- User fetched on component mount (useEffect)
- Stored in local component state
- Used to:
  - Filter user-specific data
  - Display user information
  - Enable/disable features

### 9. Data Models

#### Lesson Entity
- `id` - Unique identifier
- `title` - Lesson title
- `description` - Lesson description
- `content` - Full lesson content
- `level` - Difficulty level (beginner/intermediate/advanced)
- `duration` - Estimated duration
- `topics` - Array of topic strings

#### ChatMessage Entity
- `id` - Unique identifier
- `user_email` - User identifier
- `message` - Message content
- `role` - "user" or "tutor"
- `created_date` - Timestamp

#### UserProgress Entity
- `id` - Unique identifier
- `user_email` - User identifier
- `lesson_id` - Lesson identifier
- `completed` - Boolean completion status
- `progress_percentage` - Numeric progress (0-100)

### 10. Build & Development

#### Vite Configuration
- React plugin enabled
- Path alias `@` → `./src`
- JSX support for `.js` files
- Development server with allowed hosts

#### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - ESLint checking

#### Path Aliases
- `@/` - Points to `src/` directory
- Configured in `vite.config.js` and `jsconfig.json`

## Data Flow

### Lesson Browsing Flow
1. User navigates to Home page
2. `Home.jsx` mounts, fetches user via `base44.auth.me()`
3. React Query fetches lessons list
4. React Query fetches user progress (if user exists)
5. Lessons displayed in grid with progress indicators
6. User clicks lesson → navigates to LessonDetail with lesson ID

### Chat Flow
1. User navigates to Chat page
2. `Chat.jsx` mounts, fetches user
3. React Query fetches user's chat messages
4. User types message and submits
5. Message created via mutation
6. Query invalidated, messages refetched
7. Mock AI response generated and saved
8. UI updates with new messages

### Progress Tracking Flow
1. User views lesson detail
2. Progress record fetched (if exists)
3. User completes lesson
4. Mutation creates or updates progress record
5. Query invalidated
6. UI updates to show completion status

## Security Considerations

1. **Authentication**: All operations require authentication via Base44 SDK
2. **User Isolation**: Data filtered by `user_email` to ensure user data privacy
3. **Client-Side Validation**: Form validation via React Hook Form and Zod
4. **HTTPS**: Should be enforced in production (Base44 SDK handles this)

## Performance Optimizations

1. **React Query Caching**: Reduces redundant API calls
2. **Code Splitting**: Vite automatically code-splits routes
3. **Lazy Loading**: Components loaded on-demand via routing
4. **Memoization**: Framer Motion optimizes animations
5. **Image Optimization**: Should be implemented for any image assets

## Known Limitations & Future Improvements

1. **React Query Provider**: Missing from codebase (needs to be added)
2. **AI Integration**: Currently using mock responses; needs LLM integration
3. **Error Handling**: Limited error boundaries and error states
4. **Loading States**: Some components lack loading indicators
5. **Offline Support**: No offline capabilities
6. **Real-time Updates**: Chat doesn't use real-time subscriptions
7. **Pagination**: Large data sets not paginated
8. **Search/Filter**: No search or filtering capabilities for lessons
9. **Accessibility**: Should audit and improve ARIA labels
10. **Testing**: No test files present

## Deployment Considerations

1. **Environment Variables**: Base44 app ID should be environment-specific
2. **Build Output**: Vite outputs to `dist/` directory
3. **Static Hosting**: Can be deployed to any static host (Vercel, Netlify, etc.)
4. **API Endpoints**: All backend handled by Base44 (no separate API server needed)
5. **CORS**: Base44 SDK handles CORS configuration

## Dependencies Analysis

### Production Dependencies
- **Core**: React, React DOM, React Router
- **Backend**: @base44/sdk
- **UI**: Radix UI components, Tailwind CSS, Framer Motion
- **Forms**: React Hook Form, Zod
- **State**: @tanstack/react-query (should be in dependencies)
- **Utils**: Various utility libraries (clsx, date-fns, etc.)

### Development Dependencies
- **Build**: Vite, Vite React plugin
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Linting**: ESLint with React plugins
- **TypeScript Types**: Type definitions for React, Node

## Component Communication Patterns

1. **Props Down**: Data flows from parent to child via props
2. **Callbacks Up**: Events handled via callback props
3. **Context**: Not currently used (could be added for theme/user context)
4. **State Lifting**: Shared state managed at page level
5. **Query Cache**: Shared server state via React Query

## Accessibility Features

1. **Radix UI**: All UI components built on accessible primitives
2. **Keyboard Navigation**: Supported in interactive components
3. **ARIA Labels**: Provided by Radix UI components
4. **Focus Management**: Handled by component library
5. **Screen Reader Support**: Semantic HTML and ARIA attributes

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- CSS Grid and Flexbox required
- No IE11 support

---

This architecture provides a solid foundation for an Italian learning platform with room for growth in AI integration, real-time features, and enhanced user experience capabilities.

