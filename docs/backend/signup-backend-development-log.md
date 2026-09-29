# Signup Backend Development Log

## Feature / Page Name
- Signup / Create Account

## Technology Used
- ASP.NET Core Web API
- C#
- .NET 10
- xUnit + Microsoft.AspNetCore.Mvc.Testing
- In-memory mock repository pattern

## Business Requirements Implemented
- Public anonymous signup endpoint for prospective SecureBank customers
- Capture `fullName`, `email`, `password`, and `confirmPassword`
- Validate required fields and invalid email patterns before account creation
- Enforce minimum password length and password matching rules
- Prevent duplicate account creation using email uniqueness check
- Return consistent success and error responses aligned to the API contract
- Allow login flow navigation at the UI layer, without introducing new backend authorization requirements

## APIs Implemented
### POST /api/v1/auth/signup
- Request payload: `fullName`, `email`, `password`, `confirmPassword`
- Success response: `201 Created` with user details and success flag
- Validation error response: `400 Bad Request`
- Duplicate email response: `409 Conflict`

## Authentication Implementation
- Public endpoint intentionally does not require authentication or authorization
- No JWT or secure token flow was introduced because the business requirements and API handoff explicitly define the signup flow as anonymous user registration

## Validation Implementation
- Request body is required
- Full name is required
- Email must be present and in a valid format
- Password is required
- Password must be at least 8 characters
- Confirm password must match the original password
- Duplicate email addresses are rejected
- Validation exceptions are raised in the service layer and handled centrally in middleware

## Files Created / Updated
- `Apps/Backend/SecureBank.Api/Program.cs`
- `Apps/Backend/SecureBank.Api/Controllers/AuthController.cs`
- `Apps/Backend/SecureBank.Api/Services/SignupService.cs`
- `Apps/Backend/SecureBank.Api/Repositories/InMemoryUserRepository.cs`
- `Apps/Backend/SecureBank.Api/Models/UserAccount.cs`
- `Apps/Backend/SecureBank.Api/Models/SignupRequest.cs`
- `Apps/Backend/SecureBank.Api/Exceptions/SignupValidationException.cs`
- `Apps/Backend/SecureBank.Api/Exceptions/SignupConflictException.cs`
- `Apps/Backend/SecureBank.Api.Tests/SignupEndpointTests.cs`

## Test Files Created
- `Apps/Backend/SecureBank.Api.Tests/SignupEndpointTests.cs`

## Test Execution Summary
Command executed:
- `dotnet test SecureBank.Api.Tests/SecureBank.Api.Tests.csproj --nologo`

Results:
- Passed: 5
- Failed: 0
- Skipped: 0
- Build status: succeeded

## Build Status
- Backend project builds successfully under .NET 10
- Test host starts successfully and executes the signup endpoint integration tests without failing

## Known Limitations
- The solution uses in-memory mock data only, as required by the architecture handoff summary
- Password storage is simulated with a base64-encoded value and is not intended for production security use
- Exact UI copy, post-signup navigation target, and full password policy details were not specified in the supplied design, so implementation follows the approved contract and business requirements that were available

## Final Status
- Signup backend functionality is implemented and validated
- API contract and business rules are covered by automated integration tests
- Ready for frontend development and QA handoff
