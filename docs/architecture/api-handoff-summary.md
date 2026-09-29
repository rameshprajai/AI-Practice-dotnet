# API Handoff Summary

## Overview
This document is the entry point for SecureBank API design for the authenticated dashboard and transfer experience. It maps the business requirements from the dashboard and transfer-money user stories to the implementation expectations for the frontend and backend teams.

The current feature scope includes the authenticated dashboard landing page and the Transfer Money workflow. This design intentionally uses mock API/data and does not introduce a database dependency.

## API Documentation Set

| Document | Purpose | Primary Consumer |
| --- | --- | --- |
| [api-endpoint-list.md](api-endpoint-list.md) | Lists approved API operations for the dashboard, sign-in, and transfer flow | Backend + Frontend |
| [api-journey-diagram.md](api-journey-diagram.md) | Shows the request/response business flow for sign-in, dashboard access, and transfer submission | Frontend + QA |
| [api-contract.md](api-contract.md) | Defines request/response payloads, validation rules, mock data strategy, and authentication requirements | Backend + Frontend |

## Current Feature Scope
- Redirect an authenticated user to the dashboard after successful sign-in
- Protect the dashboard route so only valid sessions can access it
- Load an authenticated landing page with core account summary information
- Support the Transfer Money journey from the dashboard navigation
- Allow a user to select a source account, recipient, and amount
- Validate transfer inputs before processing
- Use mock session, account, and transfer data only; no database is required

## Frontend Consumer Notes
- The frontend must redirect the user to the dashboard after a successful sign-in response.
- The frontend must treat the dashboard and Transfer Money pages as protected authenticated routes.
- The frontend must verify that a valid session or auth state exists before rendering protected data.
- The frontend must handle loading, empty, success, warning, and error states gracefully for transfer input and account data.
- If the user is unauthenticated or the session is invalid, the frontend must route them back to sign-in.
- The transfer screen should present consistent validation states for empty fields, invalid amounts, restricted recipients, and insufficient funds.

## Backend Consumer Notes
- The backend must expose a dashboard overview endpoint and a transfer-processing endpoint built to accept mock-authenticated requests.
- The backend must validate that the caller has a valid authenticated session or mock auth state before returning dashboard or transfer data.
- The backend must reject unauthorized access consistently with a 401 response or equivalent route-level block.
- The backend must not rely on a database for this project context; account, beneficiary, and transfer data are simulated in memory.
- Successful transfer processing should return a minimal payload that supports UI confirmation and a route return to the dashboard.

## Business Flow
### Dashboard Flow
1. User signs in successfully using valid credentials.
2. The frontend receives a successful sign-in response.
3. The frontend redirects the user to the dashboard route.
4. The dashboard page requests authenticated overview data from the mock API.
5. The backend validates the active session or mock auth state.
6. If the session is valid, the backend returns the dashboard summary payload.
7. If the session is missing or invalid, the backend denies access and the frontend redirects to the sign-in screen.

### Transfer Money Flow
1. User opens the Transfer Money screen from the dashboard.
2. The frontend loads mock source-account and recipient options from the mock API.
3. The user selects the source account, recipient, and transfer amount.
4. The frontend validates the form before submission.
5. The backend validates the request, the selected account, and available funds.
6. If valid, the mock transfer service creates a transfer record in in-memory storage and returns a success confirmation.
7. If invalid, the backend returns a validation or business-rule error.
8. The user receives a success or error message and can either retry or return to the dashboard.

## API Design for Transfer Money

### Required Endpoints
| Method | Endpoint | Purpose | Auth Requirement |
| --- | --- | --- | --- |
| GET | /api/v1/accounts | Returns the authenticated user’s available source accounts | Required |
| GET | /api/v1/recipients | Returns valid recipient or beneficiary options for the user | Required |
| POST | /api/v1/transfers | Submits the transfer request | Required |
| GET | /api/v1/transfers/{id} | Returns a specific transferred record or confirmation payload | Required |

### Expected Transfer Request
```json
{
  "fromAccountId": "ACC-1001",
  "toAccountId": "ACC-2004",
  "amount": 250.00,
  "currency": "USD",
  "memo": "Monthly rent payment"
}
```

### Expected Transfer Success Response
```json
{
  "success": true,
  "message": "Transfer processed successfully",
  "transfer": {
    "id": "TRF-1001",
    "fromAccountId": "ACC-1001",
    "toAccountId": "ACC-2004",
    "amount": 250.00,
    "currency": "USD",
    "status": "completed",
    "createdAt": "2026-09-28T10:15:00Z"
  }
}
```

### Expected Transfer Error Response
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "The selected account does not have enough available funds for this transfer."
  }
}
```

## Validation Requirements
- Transfer submission must require a valid authenticated session.
- `fromAccountId` must be present and belong to the authenticated user.
- `toAccountId` must be present and represent a valid recipient or account.
- `amount` must be greater than 0.
- The amount must not exceed the source account balance or transfer limit.
- The source account must be active and eligible for transfers.
- The user must be able to correct invalid fields and retry without losing context.
- Failed processing must provide a clear error message and safe recovery path.

## Authentication Requirements
- Dashboard and transfer screens are restricted to authenticated users only.
- Sign-in remains a public endpoint for anonymous users.
- Transfer APIs must reject anonymous callers with a 401 or equivalent unauthorized response.
- The mock auth layer may use session state, a signed-in user object, or in-memory auth identity rather than a database-backed auth provider.
- Expired or invalid sessions must redirect the user to sign-in and prevent protected screen access.

## Mock Data Strategy
This project uses mock API/data rather than a persistent database.

- Authenticated user state is simulated using an in-memory mock user registry or static JSON fixture.
- Dashboard data is created from a mock authenticated profile, balance/summary payload, and recent activity entries.
- Account and recipient data are represented as in-memory arrays or mock JSON objects included in the service layer.
- Transfer requests are validated against in-memory account balances and rule checks before a mock transfer record is created.
- Invalid session states, expired auth states, insufficient-funds states, and empty transfer states are simulated in the mock layer.
- The mock strategy is intentionally limited to the current feature flow and does not assume persistent storage, production persistence, or database-backed transactional processing.

## Mock Data Example
```json
{
  "user": {
    "id": "mock-user-001",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com"
  },
  "accounts": [
    {
      "id": "ACC-1001",
      "ownerId": "mock-user-001",
      "type": "Checking",
      "balance": 2450.75,
      "currency": "USD",
      "status": "active"
    },
    {
      "id": "ACC-2004",
      "ownerId": "mock-user-001",
      "type": "Savings",
      "balance": 4200.00,
      "currency": "USD",
      "status": "active"
    }
  ],
  "recipients": [
    {
      "id": "BEN-001",
      "name": "Alicia Hart",
      "accountId": "ACC-3001",
      "nickname": "Family Savings"
    }
  ],
  "transfers": []
}
```

## Usage Rules
- Do not add API behavior beyond what is mapped to the dashboard and transfer-money requirement set.
- Do not invent new endpoints without approval.
- Document missing behavior as open questions instead of assuming requirements.
- Keep all detailed request/response definitions in the API contract and endpoint documentation rather than duplicating them here.

## Open API Questions
- What is the exact recipient selection model for the final Figma: saved beneficiaries, account lookup, or a manual entry flow?
- Is a transfer review/confirmation step required before the final submit action?
- What are the final transfer limits and currency rules for the business flow?
- What fraud or compliance checks must be enforced before a transfer is accepted?
- Does the final product require additional transfer states such as pending approval or scheduled transfers?
