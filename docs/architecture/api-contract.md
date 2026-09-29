# API Contract

## Endpoint Details

### API Name
Create Account

### HTTP Method
POST

### URL
/api/v1/auth/signup

### Description
Registers a new SecureBank user with the minimum required signup fields. This is a public endpoint for anonymous account creation.

## Request Contract

### Headers
| Header | Required | Type | Notes |
| --- | --- | --- | --- |
| Content-Type | Yes | string | Must be application/json |

### Request Body
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePass!123",
  "confirmPassword": "SecurePass!123"
}
```

### Request Field Definitions
| Field | Type | Required | Description |
| --- | --- | --- | --- |
| fullName | string | Yes | The new user’s full name |
| email | string | Yes | Email address used for account creation and login identity |
| password | string | Yes | User-selected password |
| confirmPassword | string | Yes | Must match password exactly |

## Response Contract

### Success Response
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

### Error Response
Status: 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields and try again."
  }
}
```

### Error Response Mapping
| Status Code | Error Code | Meaning |
| --- | --- | --- |
| 400 | VALIDATION_ERROR | Missing or invalid required fields |
| 409 | EMAIL_ALREADY_EXISTS | Mock data layer indicates the email is already registered |
| 422 | PASSWORD_POLICY_VIOLATION | Password does not satisfy required policy |
| 500 | INTERNAL_SERVER_ERROR | Unexpected API failure |

## Validation Rules

### Required fields
- fullName must be present and non-empty
- email must be present and valid
- password must be present
- confirmPassword must be present

### Field validation
- `email` must match common email format validation rules
- `password` must not be empty
- `confirmPassword` must match `password`
- `fullName` should not be blank or whitespace-only

### Business validation
- The email should be unique within the mock dataset
- The mock backend should reject invalid payloads before creating a user object
- The signup process must block submission when required fields are missing or mismatched

## Authentication Requirements
- Public endpoint
- No current bearer token or session is required for account creation
- This is an anonymous user action only

## Data Source Strategy (Mock Only)
This feature uses mock API/data and does not rely on a database.

### Implementation expectation
- The application should use an in-memory mock repository or static JSON fixture representing user records.
- Each signup request is validated against this mock repository.
- New users are stored in memory only for the current runtime session.
- Duplicate email checks are performed in the mock dataset, not against a database.
- The mock strategy is intended for design validation and local/frontend-backend integration testing only.

### Example mock store
```json
[
  {
    "id": "mock-user-001",
    "fullName": "John Smith",
    "email": "john.smith@example.com"
  }
]
```

## Endpoint Details

### API Name
Sign In

### HTTP Method
POST

### URL
/api/v1/auth/signin

### Description
Authenticates a returning SecureBank customer using the email and password associated with an existing account. This endpoint is public and designed to validate credentials against mock account data.

## Request Contract

### Headers
| Header | Required | Type | Notes |
| --- | --- | --- | --- |
| Content-Type | Yes | string | Must be application/json |

### Request Body
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePass!123"
}
```

### Request Field Definitions
| Field | Type | Required | Description |
| --- | --- | --- | --- |
| email | string | Yes | Email address associated with an existing account |
| password | string | Yes | Password entered for the matching account |

## Response Contract

### Success Response
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

### Error Response
Status: 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The email or password you entered is incorrect."
  }
}
```

### Error Response Mapping
| Status Code | Error Code | Meaning |
| --- | --- | --- |
| 400 | VALIDATION_ERROR | Missing or invalid required fields |
| 401 | INVALID_CREDENTIALS | Email/password do not match the mock user registry |
| 500 | INTERNAL_SERVER_ERROR | Unexpected API failure |

## Validation Rules

### Required fields
- email must be present and valid
- password must be present

### Field validation
- `email` must match standard email validation rules
- `password` must be non-empty

### Business validation
- The mock auth layer should verify email and password against existing mock records
- Authentication must fail cleanly when the email exists but the password is wrong
- The system must not reveal whether the account exists or not beyond the standard invalid-credentials message

## Authentication Requirements
- Public endpoint for anonymous sign-in attempts
- No bearer token is required for the initial sign-in request
- The frontend can handle route transition or session creation after a successful response

## Data Source Strategy (Mock Only)
This feature uses mock API/data and does not rely on a database.

### Implementation expectation
- The application should use an in-memory mock repository or static JSON fixture representing valid user credentials.
- Each sign-in request is validated against this registry before granting access.
- User credentials are compared to mock records only for the runtime session.
- The auth mock should be treated as a temporary replacement for production persistence and identity validation.

### Example mock store
```json
[
  {
    "id": "mock-user-001",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "SecurePass!123"
  }
]
```

## Open API Questions
- What is the exact SecureBank password policy for signup?
- What is the exact success destination after account creation?
- What are the final validation copy and UI error message strings?
- Are additional onboarding or email verification steps required after this screen?
- What is the exact success destination after a valid sign-in?
- What is the required invalid-credentials copy for the final product?
- Is there a forgot-password or password-reset flow tied to this page?
- Are there multi-factor or social sign-in requirements outside the current design?
