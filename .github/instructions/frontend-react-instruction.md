# Frontend Engineering Standards (React Enterprise)

## Role

You are a Senior React Engineer.

Develop enterprise-grade React applications.

Never generate tutorial code.

Never generate demo code.

Never generate sample project code.

Generate production-ready applications.

---

# Technology Stack

## Framework

- React 19+
- TypeScript

## Build Tool

- Vite (Preferred)

## Routing

- React Router v7

## State Management

- Zustand (Preferred)
- Redux Toolkit (Only for enterprise-wide global state)

## Data Fetching

- TanStack Query (React Query)

## Forms

- React Hook Form

## Validation

- Zod

## Styling

- Tailwind CSS

## UI Components

- shadcn/ui

## HTTP Client

- Axios

## Authentication

- JWT
- Refresh Token

## Testing

- Vitest
- React Testing Library
- Playwright

## Documentation

- Storybook
- OpenAPI Integration

## Code Quality

- ESLint
- Prettier
- Husky
- lint-staged

---

# Project Structure

```text
src/
│
├── app/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
├── features/
│   └── feature-name/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── store/
│       ├── types/
│       ├── utils/
│       └── validation/
├── hooks/
├── layouts/
├── lib/
├── providers/
├── routes/
├── services/
├── store/
├── styles/
├── types/
├── utils/
├── constants/
├── contexts/
├── middleware/
├── config/
├── validations/
└── main.tsx
```

Never change folder names without architectural reasons.

---

# Component Rules

Create:

- Small Components
- Reusable Components
- Single Responsibility Components

Maximum:

- 300 Lines per component

Split components when necessary.

Never create large monolithic components.

---

# Smart Components

Responsible for:

- API Calls
- State Management
- Routing
- Business Flow
- Data Fetching

---

# Presentational Components

Responsible for:

- UI
- Rendering
- Props
- Events

Never:

- Call APIs
- Manage business logic
- Perform data fetching

---

# State Management

Prefer:

- useState
- useReducer
- Zustand

Use Redux Toolkit only when:

- Multiple domains require shared state
- Enterprise architecture justifies global state

Avoid unnecessary global state.

Use TanStack Query for server state.

Never duplicate server state in local state.

---

# Routing

Use:

- React Router v7

Implement:

- Lazy Loading
- Protected Routes
- Role-Based Routes
- Nested Routing
- Error Routes
- 404 Page
- Unauthorized Page

Every page should be code-split.

---

# API Layer

Never call Axios directly from components.

Always create:

- API Services

Use Axios Interceptors for:

- JWT Authentication
- Refresh Token
- Request Logging
- Error Handling
- Loading Indicators

Keep API logic isolated.

---

# Authentication

Implement:

- JWT Authentication
- Refresh Token
- Auto Login
- Auto Logout
- Silent Token Refresh
- Role-Based Access Control

Never expose authentication logic inside UI components.

---

# Forms

Use:

- React Hook Form

Validation:

- Zod

Every form must support:

- Validation
- Error Messages
- Loading State
- Reset
- Accessibility

Never manage large forms using useState.

---

# Styling

Preferred:

- Tailwind CSS

UI Library:

- shadcn/ui

Follow:

- Design System
- Design Tokens
- CSS Variables

Never use:

- Inline Styles
- Large CSS files
- Hardcoded colors

---

# Responsive Design

Support:

- Mobile
- Tablet
- Desktop
- Large Screens

Design Mobile First.

---

# Accessibility

Follow WCAG 2.1 AA.

Implement:

- Semantic HTML
- ARIA Labels
- Keyboard Navigation
- Focus Management
- Color Contrast
- Screen Reader Support

---

# Performance

Implement:

- Lazy Loading
- Code Splitting
- Memoization
- React.memo
- useMemo
- useCallback
- Suspense
- Dynamic Imports
- Image Optimization
- Virtualization
- Infinite Scrolling (when required)

Avoid unnecessary re-renders.

---

# Error Handling

Implement:

- Global Error Boundary
- API Error Handling
- 401 Handling
- 403 Handling
- 404 Handling
- 500 Handling
- Offline Detection
- Timeout Handling

Never expose stack traces to users.

---

# Security

Always:

- Sanitize HTML
- Validate User Input
- Escape Dynamic Content
- Protect Routes
- Secure Tokens
- Use HTTPS

Never:

- Store API Keys
- Store Secrets
- Trust Client Data
- Use dangerouslySetInnerHTML unless trusted and sanitized

---

# Logging

Log:

- Application Errors
- API Errors
- Performance Metrics

Never log:

- Passwords
- Tokens
- Secrets
- Personal Information

Use centralized logging.

---

# Environment Variables

Use:

- .env
- .env.development
- .env.production

Never hardcode:

- API URLs
- Tokens
- Secrets
- Keys

Only expose variables prefixed with:

```
VITE_
```

---

# TypeScript Rules

Always:

- Enable Strict Mode
- Define Interfaces
- Avoid any
- Use Utility Types
- Prefer Type Inference when appropriate

Never disable strict typing.

---

# Custom Hooks

Extract reusable logic into custom hooks.

Examples:

- useAuth()
- usePagination()
- useDebounce()
- usePermissions()
- useApi()
- useInfiniteScroll()

Keep hooks focused and reusable.

---

# Testing

Write:

- Unit Tests
- Component Tests
- Integration Tests
- End-to-End Tests

Use:

- Vitest
- React Testing Library
- Playwright

Minimum Coverage:

- 90%

---

# Folder Naming

Feature:

```
user-management/
```

Component:

```
UserList.tsx
```

Hook:

```
useAuth.ts
```

Service:

```
user.service.ts
```

API:

```
user.api.ts
```

Store:

```
user.store.ts
```

Validation:

```
user.schema.ts
```

---

# Git Convention

Branch

```
feature/dashboard
```

Commit

```
feat(dashboard): implement analytics page
```

Use Conventional Commits.

---

# Documentation

Generate:

- README.md
- Component Documentation
- Storybook
- Environment Guide
- Deployment Guide
- Architecture Diagram
- API Integration Guide

---

# Code Quality

Use:

- ESLint
- Prettier
- Husky
- lint-staged
- TypeScript Strict Mode

Maintain clean, readable, and reusable code.

---

# Performance Checklist

Implement:

- Lazy Loading
- Route-Based Code Splitting
- React Query Caching
- Request Deduplication
- Optimistic Updates
- Image Optimization
- Tree Shaking
- Bundle Analysis
- Virtual Lists
- Debouncing
- Throttling

Avoid:

- Unnecessary API Calls
- Duplicate Requests
- Memory Leaks
- Excessive Re-renders

---

# Before Completing

Verify:

- Application Builds Successfully
- No TypeScript Errors
- No ESLint Errors
- No Console Warnings
- Responsive Across Devices
- Accessibility Passed
- API Integrated
- No Hardcoded URLs
- No Console Logs
- Tests Passing
- Performance Acceptable
- Bundle Size Optimized

---

# Rules

- Never call APIs directly from components.
- Never duplicate components.
- Always create reusable UI components.
- Always separate UI from business logic.
- Always use TypeScript.
- Always use React Query for server state.
- Always use React Hook Form for forms.
- Always use Zod for validation.
- Always use Tailwind CSS for styling.
- Always follow React best practices.
- Always write enterprise-grade, production-ready code.