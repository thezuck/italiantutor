# Mainserver Libraries

This document lists all backend and frontend libraries used in the mainserver application, along with their versions and purposes.

## Backend Dependencies

### Core Framework & Server
- **express** (^4.18.2) - Fast, unopinionated web framework for Node.js that handles HTTP requests and routing
- **cors** (^2.8.5) - Express middleware for enabling Cross-Origin Resource Sharing (CORS)
- **dotenv** (^16.3.1) - Loads environment variables from .env files into process.env

### Database & ORM
- **sequelize** (^6.35.1) - Promise-based ORM for PostgreSQL, MySQL, SQLite and others
- **pg** (^8.11.3) - PostgreSQL client for Node.js

### AWS & Storage
- **@aws-sdk/client-s3** (^3.515.0) - AWS SDK v3 client for S3 operations
- **@aws-sdk/lib-storage** (^3.515.0) - AWS SDK v3 library for multipart uploads to S3
- **@aws-sdk/s3-request-presigner** (^3.876.0) - AWS SDK v3 library for generating presigned S3 URLs
- **aws-sdk** (^2.1692.0) - Legacy AWS SDK v2 (used for compatibility with some services)

### Authentication & Security
- **jsonwebtoken** (^9.0.2) - Implementation of JSON Web Tokens for authentication
- **bcryptjs** (^3.0.2) - Library for hashing and comparing passwords securely
- **google-auth-library** (^9.15.1) - Google authentication library for OAuth and service accounts
- **googleapis** (^131.0.0) - Google APIs client library for Node.js

### AI & Machine Learning
- **openai** (^5.15.0) - Official OpenAI API client for GPT models and other AI services
- **opik** (^1.8.38) - AI observability and tracing platform for monitoring AI applications

### HTTP & API
- **axios** (^1.11.0) - Promise-based HTTP client for making API requests
- **node-fetch** (^2.7.0) - Light-weight module that brings window.fetch to Node.js
- **form-data** (^4.0.0) - Library for creating multipart/form-data streams

### File Upload
- **multer** (^1.4.5-lts.1) - Express middleware for handling multipart/form-data file uploads

### Validation
- **express-validator** (^7.0.1) - Express middleware for request validation and sanitization

### Utilities
- **uuid** (^11.1.0) - Library for generating RFC-compliant UUIDs
- **uuidv7** (^1.0.2) - UUID v7 implementation for time-ordered unique identifiers
- **csv-parser** (^3.0.0) - Streaming CSV parser for Node.js

### Logging
- **winston** (^3.17.0) - Versatile logging library with support for multiple transports

### Development Dependencies
- **nodemon** (^3.0.2) - Development tool that automatically restarts Node.js applications when file changes are detected

---

## Frontend Dependencies

### Core Framework
- **react** (^18.2.0) - JavaScript library for building user interfaces
- **react-dom** (^18.2.0) - React package for DOM rendering
- **react-router-dom** (^7.2.0) - Declarative routing for React applications

### Build Tool
- **vite** (^6.1.0) - Next-generation frontend build tool with fast HMR

### UI Component Libraries

#### Radix UI Primitives
A comprehensive set of unstyled, accessible UI components:
- **@radix-ui/react-accordion** (^1.2.3) - Accordion component for collapsible content
- **@radix-ui/react-alert-dialog** (^1.1.6) - Alert dialog for important user confirmations
- **@radix-ui/react-aspect-ratio** (^1.1.2) - Component for maintaining aspect ratios
- **@radix-ui/react-avatar** (^1.1.3) - Avatar component for user images and initials
- **@radix-ui/react-checkbox** (^1.1.4) - Accessible checkbox component
- **@radix-ui/react-collapsible** (^1.1.3) - Collapsible content container
- **@radix-ui/react-context-menu** (^2.2.6) - Right-click context menu component
- **@radix-ui/react-dialog** (^1.1.6) - Modal dialog component
- **@radix-ui/react-dropdown-menu** (^2.1.6) - Dropdown menu component
- **@radix-ui/react-hover-card** (^1.1.6) - Hover card for additional information on hover
- **@radix-ui/react-label** (^2.1.2) - Accessible label component
- **@radix-ui/react-menubar** (^1.1.6) - Horizontal menu bar component
- **@radix-ui/react-navigation-menu** (^1.2.5) - Navigation menu with keyboard support
- **@radix-ui/react-popover** (^1.1.6) - Popover component for floating content
- **@radix-ui/react-progress** (^1.1.2) - Progress bar component
- **@radix-ui/react-radio-group** (^1.2.3) - Radio button group component
- **@radix-ui/react-scroll-area** (^1.2.3) - Custom scrollable area component
- **@radix-ui/react-select** (^2.1.6) - Custom select dropdown component
- **@radix-ui/react-separator** (^1.1.2) - Visual separator line component
- **@radix-ui/react-slider** (^1.2.3) - Slider input component
- **@radix-ui/react-slot** (^1.1.2) - Utility for merging props onto children
- **@radix-ui/react-switch** (^1.1.3) - Toggle switch component
- **@radix-ui/react-tabs** (^1.1.3) - Tabbed interface component
- **@radix-ui/react-toggle** (^1.1.2) - Toggle button component
- **@radix-ui/react-toggle-group** (^1.1.2) - Group of toggle buttons
- **@radix-ui/react-tooltip** (^1.1.8) - Tooltip component for hover hints

#### Other UI Components
- **cmdk** (^1.0.0) - Command palette/command menu component
- **sonner** (^2.0.1) - Toast notification library
- **vaul** (^1.1.2) - Drawer/bottom sheet component
- **lucide-react** (^0.475.0) - Icon library with React components

### Styling & Theming
- **tailwindcss** (^3.4.17) - Utility-first CSS framework
- **tailwind-merge** (^3.0.2) - Utility for merging Tailwind CSS classes
- **tailwindcss-animate** (^1.0.7) - Animation utilities for Tailwind CSS
- **class-variance-authority** (^0.7.1) - Library for creating variant-based component styles
- **clsx** (^2.1.1) - Utility for constructing className strings conditionally
- **next-themes** (^0.4.4) - Theme management (dark/light mode) for React
- **autoprefixer** (^10.4.20) - PostCSS plugin to add vendor prefixes

### Forms & Validation
- **react-hook-form** (^7.54.2) - Performant, flexible forms with easy validation
- **@hookform/resolvers** (^4.1.2) - Validation resolvers for react-hook-form
- **zod** (^3.24.2) - TypeScript-first schema validation library

### Animation & Interaction
- **framer-motion** (^12.4.7) - Animation library for React
- **@hello-pangea/dnd** (^18.0.1) - Drag and drop library (fork of react-beautiful-dnd)
- **embla-carousel-react** (^8.5.2) - Carousel component for React

### Data Visualization
- **recharts** (^2.15.1) - Composable charting library built on React components

### Content & Display
- **react-markdown** (^10.1.0) - Markdown renderer for React
- **@uiw/react-json-view** (^2.0.0-alpha.39) - JSON viewer component
- **react-day-picker** (^8.10.1) - Date picker component

### Layout
- **react-resizable-panels** (^2.1.7) - Resizable panel layouts

### Date & Time
- **date-fns** (^3.6.0) - Modern JavaScript date utility library

### Utilities
- **uuid** (^13.0.0) - Library for generating UUIDs
- **lodash** (^4.17.21) - Modern JavaScript utility library
- **diff** (^8.0.2) - JavaScript text differencing library
- **input-otp** (^1.4.2) - One-time password input component
- **postcss** (^8.5.3) - Tool for transforming CSS with JavaScript

### Development Dependencies
- **@vitejs/plugin-react** (^4.3.4) - Vite plugin for React applications
- **eslint** (^9.19.0) - JavaScript linter for code quality
- **@eslint/js** (^9.19.0) - ESLint JavaScript configuration
- **eslint-plugin-react** (^7.37.4) - React-specific linting rules
- **eslint-plugin-react-hooks** (^5.0.0) - ESLint rules for React Hooks
- **eslint-plugin-react-refresh** (^0.4.18) - ESLint plugin for React Fast Refresh
- **globals** (^15.14.0) - Global identifiers from different JavaScript environments
- **@types/node** (^22.13.5) - TypeScript type definitions for Node.js
- **@types/react** (^18.2.66) - TypeScript type definitions for React
- **@types/react-dom** (^18.2.22) - TypeScript type definitions for React DOM
- **@flydotio/dockerfile** (^0.7.8) - Dockerfile generator for Fly.io deployment

