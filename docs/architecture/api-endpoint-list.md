# API Endpoint List

## API Overview
This feature supports user account creation and sign-in for SecureBank. The endpoint list below captures the API surface required by the signup and sign-in user stories while keeping the mock data strategy consistent with the project requirement.

## Endpoint List

| API Name | HTTP Method | URL | Authentication | Purpose | Related Business Feature |
| --- | --- | --- | --- | --- | --- |
| Create Account | POST | /api/v1/auth/signup | Public / No authentication required | Creates a new SecureBank user account after validating required input | User Story: Signup / Create Account |
| Sign In | POST | /api/v1/auth/signin | Public / No authentication required | Validates an existing email and password pair for an authenticated session or redirect flow | User Story: Signin / Sign In |

## Endpoint Details

### 1) Create Account
- Method: POST
- URL: /api/v1/auth/signup
- Authentication: Public
- Purpose: Register a new user using full name, email, password, and confirm password data.
- Related Business Feature: New user signup flow

### 2) Sign In
- Method: POST
- URL: /api/v1/auth/signin
- Authentication: Public
- Purpose: Authenticate a returning user using a registered email and password.
- Related Business Feature: Existing customer sign-in flow

## Request Contract
### Headers
| Header | Required | Description |
| --- | --- | --- |
| Content-Type | Yes | Must be application/json |

### Request Body - Create Account
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePass!123",
  "confirmPassword": "SecurePass!123"
}
```

### Request Body - Sign In
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePass!123"
}
```

### Field Rules
| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| fullName | string | Yes | Cannot be empty; should contain a non-empty display name |
| email | string | Yes | Must be a valid email format and should be unique in the mock registry for signup |
| password | string | Yes | Must meet SecureBank password policy; value must be masked in the UI |
| confirmPassword | string | Yes | Must match password exactly |

## Response Contract

### Success Response - Create Account
Status: 201 Created

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "mock-user-001",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com"
  }
}
```

### Success Response - Sign In
Status: 200 OK

```json
{
  "success": true,
  "message": "Sign in successful",
  "user": {
    "id": "mock-user-001",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com"
  }
}
```

### Error Responses
| Status Code | Description | Example Condition |
| --- | --- | --- |
| 400 | Bad Request | Required field missing, invalid email, password mismatch |
| 401 | Unauthorized | Credentials do not match a mock user |
| 409 | Conflict | Email already exists in mock registry |
| 422 | Unprocessable Entity | Password does not satisfy policy |
| 500 | Internal Server Error | Unexpected mock API failure |

### Error Payload Example
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The email or password you entered is incorrect."
  }
}
```

## Validation Requirements
- Full name must be present for signup.
- Email must be syntactically valid for both signup and sign-in.
- Email must be unique within the mock dataset during signup.
- Password is required for both flows.
- Confirm password must exactly match password during signup.
- Sign-in submission must be blocked if any required field is missing or invalid.
- Authentication must reject unrecognized credentials without revealing unnecessary account details.

## Authentication Requirements
- Public endpoint
- No login token required for first-time sign-up or sign-in in the current feature scope
- User is anonymous during account creation and authentication attempts
- Successful sign-in may trigger a client-side redirect or session creation as part of the post-login flow

## Data Source Strategy
This feature does not use a database.

- Use a mock in-memory user list or JSON fixture to simulate successful and failed registrations and sign-ins.
- The mock layer should store sample user records keyed by email for uniqueness and credential validation.
- No persistence across app restarts is required unless explicitly defined for local demo behavior.
- The backend contract should treat the mock data layer as a temporary substitute for production persistence.

## Related User Story Coverage
- Signup: Create new SecureBank account
- Signin: Authenticate a returning customer with registered email and password
