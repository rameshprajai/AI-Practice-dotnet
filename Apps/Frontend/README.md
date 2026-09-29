# SecureBank Frontend

React + TypeScript frontend for the SecureBank banking demo application.

The application provides authentication, dashboard, and money-transfer functionality and communicates with the ASP.NET Core backend.

## Technology Stack

* React
* TypeScript
* Vite
* Node.js
* npm
* Vitest
* Playwright

## Prerequisites

Install the following before running the application:

* Node.js
* npm
* VS Code
* ASP.NET Core SDK for running the backend

Verify Node.js and npm:

```bash
node --version
npm --version
```

## Project Location

```text
Apps/Frontend/
```

## Install Dependencies

From the frontend directory:

```bash
cd Apps/Frontend
npm install
```

## Start Frontend

Run the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in the browser.

## Backend Dependency

The frontend communicates with the SecureBank ASP.NET Core backend.

Backend project:

```text
Apps/Backend/SecureBank.Api/
```

Start the backend before using features that require API connectivity.

The backend URL is configured through the frontend environment configuration. Do not hardcode API URLs, tokens, secrets, or keys in source code.

## Application Flow

The current application flow is:

```text
Sign In
   ↓
Dashboard
   ↓
Transfer Money
   ↓
Select From Account
   ↓
Select / Enter Recipient
   ↓
Enter Amount
   ↓
Enter Description
   ↓
Transfer Money
```

The dashboard also provides access to the application's available banking features.

## Frontend Tests

### Unit Tests

Run the unit tests:

```bash
npm test
```

Run tests in watch mode if supported by the configured test script:

```bash
npm run test:watch
```

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## E2E Tests

Playwright is used for end-to-end testing.

Run the E2E test suite:

```bash
npx playwright test
```

Run tests with the browser UI:

```bash
npx playwright test --ui
```

View the generated Playwright report when available:

```bash
npx playwright show-report
```

Generated Playwright test results are intentionally excluded from Git.

## Important Frontend Rules

* Do not hardcode backend URLs in React source files.
* Do not commit secrets, tokens, passwords, or API keys.
* Use environment variables for environment-specific configuration.
* Only variables intended for the Vite client should use the `VITE_` prefix.
* Follow the existing application UI/theme pattern.
* Do not redesign existing screens unless the requirement explicitly asks for it.
* Do not invent API contracts.
* Use the documented API contracts from:

```text
docs/architecture/api-handoff-summary.md
docs/architecture/api-contract.md
```

## AI Development Workflow

This project uses GitHub Copilot custom agents for feature development.

The general workflow is:

```text
Business Analyst
       ↓
Solution Architect
       ↓
Backend
       ↓
Frontend
       ↓
QA
```

Frontend implementation consumes:

```text
docs/business-analysis/<feature>-user-story.md
docs/architecture/api-handoff-summary.md
```

Frontend development instructions:

```text
.github/instructions/frontend-react-instruction.md
```

React development skill:

```text
.github/skills/react/vercel-react-best-practices/SKILL.md
```

Frontend development logs:

```text
docs/frontend/
```

## Frontend Structure

```text
Apps/Frontend/
├── public/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── transfer/
│   ├── assets/
│   ├── test/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── tests/
├── package.json
├── playwright.config.ts
├── vite.config.ts
└── README.md
```

## Troubleshooting

### Port 5173 is already in use

Check the process:

```bash
lsof -i :5173
```

Stop the process if required:

```bash
kill -9 <PID>
```

Then start the frontend again:

```bash
npm run dev
```

### Dependencies are missing

From `Apps/Frontend`:

```bash
npm install
```

Then:

```bash
npm run dev
```

### Backend API is not responding

Make sure the ASP.NET Core backend is running and that the frontend API configuration points to the correct backend URL.

Backend project:

```text
Apps/Backend/SecureBank.Api/
```

## Related Documentation

Architecture:

```text
docs/architecture/
```

Business analysis:

```text
docs/business-analysis/
```

Frontend development logs:

```text
docs/frontend/
```

QA reports:

```text
docs/qa-reports/
```

For complete project setup, start with the root project README:

```text
README.md
```
