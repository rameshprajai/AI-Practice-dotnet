# API Journey Diagram

## Signup Workflow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend UI
    participant API as Signup API
    participant Mock as Mock Data Layer

    User->>Frontend: Opens Create Account page
    Frontend->>User: Displays full name, email, password, confirm password inputs
    User->>Frontend: Enters registration details
    Frontend->>Frontend: Validates required fields and password match

    alt Validation fails
        Frontend-->>User: Show inline error messages
    else Validation passes
        Frontend->>API: POST /api/v1/auth/signup
        API->>Mock: Validate fields and check email uniqueness
        Mock-->>API: Validation result

        alt Email exists or invalid payload
            API-->>Frontend: 400 / 409 / 422 response with error payload
            Frontend-->>User: Show error and keep form editable
        else Account can be created
            API->>Mock: Save mock user record
            Mock-->>API: Created user object
            API-->>Frontend: 201 Created response
            Frontend-->>User: Show success state and continue onboarding flow
        end
    end
```

## Error Scenario: Password mismatch

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend UI
    participant API as Signup API

    User->>Frontend: Enters password and different confirm password
    Frontend->>Frontend: Detect mismatch
    Frontend-->>User: Show validation error for confirm password
    User->>Frontend: Corrects value and resubmits
    Frontend->>API: POST /api/v1/auth/signup
    API-->>Frontend: 400 Bad Request if validation still fails
    Frontend-->>User: Display corrected message and allow retry
```

## Sign-In Workflow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend UI
    participant API as Sign-In API
    participant Mock as Mock Data Layer

    User->>Frontend: Opens Sign in page
    Frontend->>User: Displays email and password inputs
    User->>Frontend: Enters registered email and password
    Frontend->>Frontend: Validates required fields and email format

    alt Validation fails
        Frontend-->>User: Show inline validation errors
    else Validation passes
        Frontend->>API: POST /api/v1/auth/signin
        API->>Mock: Check email and password against mock registry
        Mock-->>API: Credential match result

        alt Credentials invalid
            API-->>Frontend: 400 / 401 response with authentication error
            Frontend-->>User: Show error and allow retry
        else Credentials valid
            API-->>Frontend: 200 OK success response
            Frontend-->>User: Redirect to post-login experience
        end
    end
```

## Error Scenario: Invalid credentials

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend UI
    participant API as Sign-In API

    User->>Frontend: Enters unregistered email or wrong password
    Frontend->>Frontend: Validates required fields
    Frontend->>API: POST /api/v1/auth/signin
    API-->>Frontend: 401 Unauthorized for invalid credentials
    Frontend-->>User: Display generic authentication error and allow retry
```

## Business Flow Summary
1. User opens the signup page.
2. User fills in the required form fields.
3. Frontend validates required fields and confirm-password match.
4. If valid, request is sent to the signup API.
5. Backend/mock validation checks required fields, email format, and uniqueness.
6. If accepted, a mock user record is created and success response is returned.
7. If rejected, the user sees error messaging and can retry.
8. User opens the sign-in page and submits registered email and password.
9. Frontend validates required fields.
10. Backend/mock validation checks email and password against the mock registry.
11. If correct, the user is redirected into the authenticated experience.
12. If incorrect, the user receives a clear auth error and retries.

## Data Source Note
This flow uses a mock data layer and does not include a database-backed persistence workflow for either the signup or sign-in feature.
