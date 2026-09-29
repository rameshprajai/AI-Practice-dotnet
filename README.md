# AI-Practice-dotnet

SecureBank banking demo application built to practice **AI-assisted feature development** using GitHub Copilot Custom Agents, React, TypeScript, and ASP.NET Core/C#.

The project follows an end-to-end feature delivery workflow:

```text
Business Analysis
        ↓
Solution Architecture
        ↓
Backend Development
        ↓
Frontend Development
        ↓
E2E QA
```

---

# 1. Project Overview

This project demonstrates how a banking feature can be delivered using specialized AI agents.

Current application flow:

```text
Sign In
   ↓
Dashboard
   ↓
Transfer
```

Current Transfer feature includes:

* From Account dropdown
* To Account / Recipient
* Amount
* Description
* Transfer Money button
* Recent Recipients
* Recipient selection

The application is intended for **development, learning, and AI-agent workflow practice**.

It is not a production banking application.

---

# 2. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Vitest
* Playwright

## Backend

* C#
* ASP.NET Core
* .NET 10
* xUnit
* In-memory repositories

## AI Development

* GitHub Copilot
* VS Code Custom Agents
* Business Analyst Agent
* Solution Architect Agent
* Backend Agent
* Frontend Agent
* QA Agent
* Project Lead Agent

---

# 3. Prerequisites

Install the following:

* VS Code
* Git
* Node.js
* npm
* .NET SDK 10.x

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check .NET:

```bash
dotnet --version
```

Expected .NET SDK:

```text
10.0.401
```

---

# 4. Project Structure

```text
AI-Practice-dotnet/
│
├── .github/
│   ├── agents/
│   │   ├── 01_business_analyst.agent.md
│   │   ├── 02_solution_architect.agent.md
│   │   ├── 03_backend.agent.md
│   │   ├── 04_frontend.agent.md
│   │   ├── 05_qa.agent.md
│   │   └── project-lead.agent.md
│   │
│   ├── instructions/
│   │   ├── backend-aspnet-instruction.md
│   │   └── frontend-react-instruction.md
│   │
│   └── skills/
│       ├── SKILL.md
│       ├── aspnet-core/
│       └── react/
│
├── Apps/
│   ├── Backend/
│   │   ├── SecureBank.Api/
│   │   ├── SecureBank.Api.Tests/
│   │   ├── SecureBankBackend.slnx
│   │   └── README.md
│   │
│   └── Frontend/
│       ├── src/
│       ├── tests/
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── architecture/
│   ├── backend/
│   ├── business-analysis/
│   ├── frontend/
│   └── qa-reports/
│
├── .gitignore
└── README.md
```

---

# 5. Backend

Backend location:

```text
Apps/Backend/
```

Backend project:

```text
Apps/Backend/SecureBank.Api/
```

## Start Backend

From the project root:

```bash
dotnet run --project Apps/Backend/SecureBank.Api/SecureBank.Api.csproj --urls http://0.0.0.0:5155
```

Backend URL:

```text
http://localhost:5155
```

### Important

The backend currently runs on **port 5155** when started using the command above.

`launchSettings.json` contains the default development port `5062`, but the explicit `--urls` argument overrides it.

For this project, use:

```text
http://localhost:5155
```

as the backend URL.

For detailed backend information, see:

```text
Apps/Backend/README.md
```

---

# 6. Frontend

Frontend location:

```text
Apps/Frontend/
```

Move into the frontend:

```bash
cd Apps/Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

If the configured Vite port is different, use the URL displayed in the terminal.

For detailed frontend information, see:

```text
Apps/Frontend/README.md
```

---

# 7. Running Backend + Frontend

Use two terminals.

### Terminal 1 — Backend

From project root:

```bash
dotnet run --project Apps/Backend/SecureBank.Api/SecureBank.Api.csproj --urls http://0.0.0.0:5155
```

Backend:

```text
http://localhost:5155
```

### Terminal 2 — Frontend

```bash
cd Apps/Frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Application flow:

```text
Frontend
   │
   │ HTTP API
   ↓
Backend
   │
   ↓
In-Memory Repository
```

---

# 8. Environment Variables

Frontend environment configuration uses:

```text
Apps/Frontend/.env
Apps/Frontend/.env.development
Apps/Frontend/.env.production
```

Frontend variables exposed to the browser must use:

```text
VITE_
```

prefix.

Example:

```text
VITE_API_BASE_URL=http://localhost:5155
```

Do not hardcode API URLs in React source code.

Do not commit:

* passwords
* API keys
* access tokens
* secrets
* production credentials

---

# 9. Backend Unit Tests

Backend tests are located at:

```text
Apps/Backend/SecureBank.Api.Tests/
```

Run:

```bash
dotnet test Apps/Backend/SecureBank.Api.Tests/SecureBank.Api.Tests.csproj
```

Or:

```bash
dotnet test Apps/Backend/SecureBankBackend.slnx
```

Backend implementation should include creating and executing unit tests.

---

# 10. Frontend Unit Tests

Frontend tests are located within:

```text
Apps/Frontend/src/
```

Run the frontend test command from:

```bash
cd Apps/Frontend
```

Then:

```bash
npm test
```

If the project uses the configured Vitest command, follow the scripts defined in:

```text
Apps/Frontend/package.json
```

---

# 11. Playwright E2E Tests

E2E tests are located at:

```text
Apps/Frontend/tests/
```

Playwright configuration:

```text
Apps/Frontend/playwright.config.ts
```

From the frontend directory:

```bash
cd Apps/Frontend
```

Run E2E tests:

```bash
npx playwright test
```

For headed execution:

```bash
npx playwright test --headed
```

Test results and screenshots are generated according to the Playwright configuration.

`test-results/` is ignored by Git.

---

# 12. AI Agent Workflow

The main feature development workflow is:

```text
User Story / Reference
        ↓
       BA
        ↓
       SA
        ↓
       BE
        ↓
       FE
        ↓
       QA
```

## BA — Business Analyst

Agent:

```text
.github/agents/01_business_analyst.agent.md
```

Creates:

```text
docs/business-analysis/<feature>-user-story.md
```

Responsibilities:

* Understand business requirements
* Analyze reference UI/design
* Define user story
* Capture acceptance criteria
* Provide UI information needed by frontend development

---

# 13. SA — Solution Architect

Agent:

```text
.github/agents/02_solution_architect.agent.md
```

Architecture documents:

```text
docs/architecture/
```

Main backend handoff:

```text
docs/architecture/api-handoff-summary.md
```

Architecture methodology:

```text
Capability Mapping
        ↓
Resource Modeling
        ↓
Contract Definition
        ↓
Flow Validation
```

The API handoff is consumed by the Backend Agent.

---

# 14. BE — Backend Agent

Agent:

```text
.github/agents/03_backend.agent.md
```

Backend instructions:

```text
.github/instructions/backend-aspnet-instruction.md
```

ASP.NET Core skill:

```text
.github/skills/aspnet-core/SKILL.md
```

Inputs:

```text
docs/business-analysis/<feature>-user-story.md
docs/architecture/api-handoff-summary.md
```

Responsibilities:

* Implement ASP.NET Core APIs
* Follow architecture contracts
* Implement business logic
* Create/update unit tests
* Execute tests
* Update backend development log

Backend logs:

```text
docs/backend/<feature>-backend-development-log.md
```

---

# 15. FE — Frontend Agent

Agent:

```text
.github/agents/04_frontend.agent.md
```

Frontend instructions:

```text
.github/instructions/frontend-react-instruction.md
```

React skill:

```text
.github/skills/react/vercel-react-best-practices/SKILL.md
```

Inputs:

```text
docs/business-analysis/<feature>-user-story.md
docs/architecture/api-handoff-summary.md
```

Responsibilities:

* Implement the UI
* Follow the existing application theme
* Use documented API contracts
* Avoid inventing APIs
* Avoid changing business requirements
* Create/update frontend unit tests
* Execute tests

The existing signup page is the visual theme reference for the application.

---

# 16. QA Agent

Agent:

```text
.github/agents/05_qa.agent.md
```

The QA Agent is focused on **E2E testing**.

Technology:

```text
Playwright
```

Inputs include:

* User story
* Local application URL
* Optional Figma reference
* Optional API handoff
* Optional test credentials

Reports:

```text
docs/qa-reports/<feature>-test-report.md
```

Screenshots are feature-specific, for example:

```text
docs/qa-reports/login-failure-01.png
docs/qa-reports/login-final-success.png
```

---

# 17. Project Lead Agent

Agent:

```text
.github/agents/project-lead.agent.md
```

This agent provides project-level coordination across the feature delivery workflow.

The specialized agents remain responsible for their respective areas.

---

# 18. Documentation Structure

## Business Analysis

```text
docs/business-analysis/
```

Contains user stories and business requirements.

## Architecture

```text
docs/architecture/
```

Contains:

* API contracts
* API endpoint lists
* API journey diagrams
* API handoff summary

## Backend

```text
docs/backend/
```

Contains backend development logs.

## Frontend

```text
docs/frontend/
```

Contains frontend development documentation.

## QA

```text
docs/qa-reports/
```

Contains E2E test reports and screenshots.

---

# 19. Recommended Startup After One Month

When returning to the project after a long gap:

### Step 1 — Open project

```bash
cd AI-Practice-dotnet
code .
```

### Step 2 — Check .NET

```bash
dotnet --version
```

Expected:

```text
10.0.401
```

### Step 3 — Start backend

```bash
dotnet run --project Apps/Backend/SecureBank.Api/SecureBank.Api.csproj --urls http://0.0.0.0:5155
```

Backend:

```text
http://localhost:5155
```

### Step 4 — Start frontend

Open another terminal:

```bash
cd Apps/Frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Step 5 — Run tests when required

Backend:

```bash
dotnet test Apps/Backend/SecureBank.Api.Tests/SecureBank.Api.Tests.csproj
```

Frontend:

```bash
cd Apps/Frontend
npm test
```

E2E:

```bash
npx playwright test
```

---

# 20. Git Workflow

Check current status:

```bash
git status
```

Check branches:

```bash
git branch
```

Pull latest changes:

```bash
git pull
```

After making changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Describe the change"
```

Push:

```bash
git push
```

Remote repository:

```text
https://github.com/rameshprajai/AI-Practice-dotnet
```

---

# 21. Troubleshooting

## Backend port already in use

Check:

```bash
lsof -i :5155
```

Find backend processes:

```bash
ps aux | grep "SecureBank.Api" | grep -v grep
```

Stop a process:

```bash
kill <PID>
```

If required:

```bash
kill -9 <PID>
```

Then restart the backend.

---

## Frontend port already in use

Check:

```bash
lsof -i :5173
```

Stop the process if required:

```bash
kill <PID>
```

Then restart:

```bash
npm run dev
```

---

## Backend build problem

From the project root:

```bash
dotnet clean
dotnet restore
dotnet build
```

---

## Frontend dependency problem

From:

```text
Apps/Frontend/
```

Run:

```bash
npm install
```

Then:

```bash
npm run dev
```

---

## Frontend cannot connect to backend

Verify backend is running:

```text
http://localhost:5155
```

Check the frontend environment configuration and confirm the API base URL points to:

```text
http://localhost:5155
```

---

# 22. Important Project Rules

### Backend

* Use ASP.NET Core / C#
* Follow `.github/instructions/backend-aspnet-instruction.md`
* Follow `.github/skills/aspnet-core/SKILL.md`
* Follow the API handoff
* Create and execute unit tests
* Keep business logic in services
* Keep data access in repositories

### Frontend

* Use React + TypeScript
* Follow `.github/instructions/frontend-react-instruction.md`
* Follow the React best-practices skill
* Preserve the existing application theme
* Do not invent APIs
* Do not hardcode API URLs
* Create and execute unit tests

### QA

* QA Agent is for E2E testing
* Use Playwright
* Validate the implemented user journey
* Generate test reports and screenshots

---

# 23. Important Files — Quick Reference

| Purpose              | File / Folder                                               |
| -------------------- | ----------------------------------------------------------- |
| BA Agent             | `.github/agents/01_business_analyst.agent.md`               |
| SA Agent             | `.github/agents/02_solution_architect.agent.md`             |
| Backend Agent        | `.github/agents/03_backend.agent.md`                        |
| Frontend Agent       | `.github/agents/04_frontend.agent.md`                       |
| QA Agent             | `.github/agents/05_qa.agent.md`                             |
| Project Lead         | `.github/agents/project-lead.agent.md`                      |
| ASP.NET Instructions | `.github/instructions/backend-aspnet-instruction.md`        |
| React Instructions   | `.github/instructions/frontend-react-instruction.md`        |
| ASP.NET Skill        | `.github/skills/aspnet-core/SKILL.md`                       |
| React Skill          | `.github/skills/react/vercel-react-best-practices/SKILL.md` |
| Backend App          | `Apps/Backend/SecureBank.Api/`                              |
| Backend Tests        | `Apps/Backend/SecureBank.Api.Tests/`                        |
| Frontend App         | `Apps/Frontend/`                                            |
| Architecture Handoff | `docs/architecture/api-handoff-summary.md`                  |
| Backend Logs         | `docs/backend/`                                             |
| QA Reports           | `docs/qa-reports/`                                          |

---

# 24. URLs

| Application | URL                     |
| ----------- | ----------------------- |
| Frontend    | `http://localhost:5173` |
| Backend     | `http://localhost:5155` |

---

# Start Here

If you return to this project after a long gap, start with this README.

Then:

```text
1. Check prerequisites
        ↓
2. Start Backend
        ↓
3. Start Frontend
        ↓
4. Run tests if required
        ↓
5. Review .github/agents/ for AI workflow
        ↓
6. Review docs/ for feature documentation
```

For detailed setup:

```text
Backend  → Apps/Backend/README.md
Frontend → Apps/Frontend/README.md
```
