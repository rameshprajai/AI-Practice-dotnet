# SecureBank Backend

Backend API for the SecureBank banking demo application.

This project implements authentication and money-transfer APIs using **ASP.NET Core and C#**. The backend currently uses **in-memory repositories** for demo/development purposes.

---

## Technology Stack

* **Language:** C#
* **Framework:** ASP.NET Core
* **.NET SDK:** 10.0.401
* **Testing:** xUnit
* **Data Storage:** In-memory repositories
* **API Style:** REST
* **Development Environment:** VS Code

---

## Prerequisites

Install the following before running the backend:

* .NET SDK 10.x
* VS Code
* Git

Verify the .NET SDK:

```bash
dotnet --version
```

Expected version:

```text
10.0.401
```

---

## Backend Location

```text
Apps/Backend/
```

Main API project:

```text
Apps/Backend/SecureBank.Api/
```

Solution:

```text
Apps/Backend/SecureBankBackend.slnx
```

---

## Project Structure

```text
Apps/Backend/
│
├── SecureBank.Api/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── TransferController.cs
│   │
│   ├── Exceptions/
│   │   ├── SigninException.cs
│   │   ├── SignupValidationException.cs
│   │   └── TransferExceptions.cs
│   │
│   ├── Models/
│   │   ├── SigninRequest.cs
│   │   ├── SignupRequest.cs
│   │   ├── TransferModels.cs
│   │   └── UserAccount.cs
│   │
│   ├── Repositories/
│   │   ├── IUserRepository.cs
│   │   ├── ITransferRepository.cs
│   │   ├── InMemoryUserRepository.cs
│   │   └── InMemoryTransferRepository.cs
│   │
│   ├── Services/
│   │   ├── ISigninService.cs
│   │   ├── ISignupService.cs
│   │   ├── ITransferService.cs
│   │   ├── SigninService.cs
│   │   ├── SignupService.cs
│   │   └── TransferService.cs
│   │
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── SecureBank.Api.csproj
│   └── SecureBank.Api.http
│
├── SecureBank.Api.Tests/
│   ├── SignupEndpointTests.cs
│   ├── TransferEndpointTests.cs
│   ├── UnitTest1.cs
│   └── SecureBank.Api.Tests.csproj
│
├── SecureBankBackend.slnx
└── README.md
```

---

# Setup

From the repository root:

```bash
cd Apps/Backend
```

Restore dependencies:

```bash
dotnet restore
```

Build the solution:

```bash
dotnet build
```

---

# Run Backend

From the repository root:

```bash
dotnet run --project Apps/Backend/SecureBank.Api/SecureBank.Api.csproj --urls http://0.0.0.0:5155
```

The backend will be available at:

```text
http://localhost:5155
```

### Important

The project `launchSettings.json` contains the default development port `5062`, but the current application startup uses the explicit `--urls` option with port **5155**.

Therefore, for this project use:

```text
http://localhost:5155
```

as the backend API base URL.

---

# Frontend Connection

The React frontend communicates with the backend through:

```text
http://localhost:5155
```

Do not hardcode this URL inside React source code.

Frontend API URLs should be configured through Vite environment variables according to:

```text
.env
.env.development
.env.production
```

Only variables prefixed with:

```text
VITE_
```

are exposed to the frontend.

---

# Application Flow

The current banking demo flow is:

```text
Sign In
   ↓
Dashboard
   ↓
Transfer
```

The Transfer feature includes:

* From Account dropdown
* To Account / Recipient
* Amount
* Description
* Transfer Money
* Recent Recipients
* Recipient selection

Selecting a recent recipient populates the recipient account number in the To Account field.

---

# API Controllers

## AuthController

Handles authentication-related APIs.

Typical responsibilities:

* User signup
* User signin

---

## TransferController

Handles transfer-related APIs.

Typical responsibilities:

* Retrieve accounts
* Retrieve recent recipients
* Submit money transfer

The exact API contracts are documented in:

```text
docs/architecture/
```

and the consolidated backend handoff is:

```text
docs/architecture/api-handoff-summary.md
```

---

# Data Storage

The current backend uses in-memory repositories:

```text
InMemoryUserRepository
InMemoryTransferRepository
```

This means data is stored only while the backend process is running.

Restarting the backend will reset the in-memory data.

This is intentional for the current demo application and is **not persistent production storage**.

---

# Backend Architecture

The backend follows a simple layered structure:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
In-Memory Data
```

### Controllers

Receive HTTP requests and return API responses.

### Services

Contain business logic and validation.

### Repositories

Handle data access.

### Models

Represent API requests, responses, and domain data.

### Exceptions

Contain feature-specific exceptions and validation errors.

---

# Unit Tests

Backend tests are located at:

```text
Apps/Backend/SecureBank.Api.Tests/
```

Run all backend tests:

```bash
dotnet test Apps/Backend/SecureBank.Api.Tests/SecureBank.Api.Tests.csproj
```

Or run tests for the complete solution:

```bash
dotnet test Apps/Backend/SecureBankBackend.slnx
```

The backend development workflow requires tests to be created and executed after implementation.

---

# Development Logs

Feature-specific backend development logs are stored under:

```text
docs/backend/
```

Example:

```text
docs/backend/transfer-backend-development-log.md
```

These logs document implementation decisions, changes, tests, and validation.

---

# AI Development Workflow

Backend implementation is part of the project's AI-assisted delivery pipeline:

```text
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

The Backend Agent is:

```text
.github/agents/03_backend.agent.md
```

Backend Agent inputs:

```text
docs/business-analysis/<feature>-user-story.md
docs/architecture/api-handoff-summary.md
```

Backend technology instructions:

```text
.github/instructions/backend-aspnet-instruction.md
```

ASP.NET Core skill:

```text
.github/skills/aspnet-core/SKILL.md
```

---

# Backend Agent Responsibilities

The Backend Agent should:

1. Read the selected business-analysis document.
2. Read the API architecture handoff.
3. Follow the ASP.NET Core backend instructions.
4. Follow the ASP.NET Core coding skill.
5. Implement the required backend functionality.
6. Follow the documented API contracts.
7. Create/update backend unit tests.
8. Execute the tests.
9. Fix implementation issues identified by tests.
10. Update the backend development log.

---

# Configuration

Application config
