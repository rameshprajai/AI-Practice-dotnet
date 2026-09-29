# User Story: Signin

## Feature / Page Name
- Signin / Sign In page

## Figma Design URL
- https://device-savor-72618845.figma.site/

## Target Platform
- Web
- Responsive

## Primary User Role / Persona
- Returning SecureBank customer

## Description

As a returning customer

I want to sign in to my SecureBank account with my email and password

So that I can securely access my account information and continue my banking activities.

---

## Screen Summary

### Screen Name
- Sign in

### Purpose
- Allow an existing customer to authenticate into the SecureBank application using valid credentials.

### User Role
- Returning customer with an existing SecureBank account

### Available Actions
- Enter email address
- Enter password
- Submit sign-in form
- Navigate to create-account page

### Navigation Flow
- User lands on the sign-in page from an entry point or from the signup page.
- The user enters their credentials and selects Sign in.
- On success, the user is authenticated and proceeds into the protected banking experience.
- If the user does not have an account, they can select Create account to navigate back to signup.

### Permissions
- This page is intended for unauthenticated users who already have an account.
- Access should be restricted to users without a valid session.

### Business Rules
- A valid email address is required for sign-in.
- A password is required for sign-in.
- The user must have a valid registered account before authentication succeeds.
- Incorrect credentials must not grant access and must show a clear error state.
- Unauthenticated users may access the sign-in page, but authenticated users should be redirected away from it.

### Dependencies
- User account repository or authentication service
- Credential validation logic
- Password verification service
- Secure session creation and redirect flow
- Create-account navigation flow

---

## UI Analysis

### Screen Layout
- The page contains a centered authentication card.
- The SecureBank brand label appears at the top.
- A heading reads: Sign in.
- A supporting line reads: Welcome back.
- A form includes the following fields:
  - Email
  - Password
- A primary action button reads: Sign in
- A secondary link reads: Need an account? Create account

### Available Interactive Elements
- Email input
- Password input
- Sign in button
- Create account link

### Screen States
- Default: empty form before entry
- Focus: active field highlight
- Error: invalid format, missing values, or failed authentication
- Disabled: not shown in the design; available only if the product sets a loading or locked state during authentication
- Loading: should show a submitting state while credentials are processed
- Success: authenticated session established and redirected to the next screen
- Permission Restricted: relevant if the user is already authenticated and tries to access the sign-in page again

### Responsive Behavior
- Layout is designed for a web experience and should adapt responsively for common browser widths.
- Desktop layout uses a centered card with a left brand panel and a right form section.
- Mobile layouts should stack content vertically without removing the required fields or actions.

---

## UI Components

| Component | Type | Description | State | User Action | Validation |
|-----------|------|-------------|-------|-------------|------------|
| SecureBank | Brand label | Shows the app branding for the sign-in surface | Default | User sees the application identity | Not Applicable |
| Sign in | Heading | Page title for account access | Default | User understands the purpose of the screen | Not Applicable |
| Welcome back | Supporting text | Introductory copy encouraging the user to sign in | Default | User reads the context | Not Applicable |
| Email | Text input | Captures the registered email address used to authenticate | Default / Focus / Error | User enters their email | Required. Must be a valid email format. Validation triggered on submit or blur. If invalid or empty, display inline error guidance. |
| Password | Password input | Captures the account password | Default / Focus / Error | User enters their password | Required. Must not be empty. Validation triggered on submit or blur. If empty or incorrect, display inline error message. |
| Sign in | Primary button | Submits the credentials for authentication | Default / Hover / Focus / Loading / Disabled | User selects to sign in | Prevent submission if required inputs are empty or invalid. If authentication fails, show an error message and allow retry. |
| Need an account? | Supporting text | Links new users back to the create-account page | Default / Hover / Focus | User selects Create account | Not Applicable |
| Create account | Link | Routes new users to the signup flow | Default / Hover / Focus | User selects the link to create an account | Not Applicable |

---

## Functional Requirements

### Requirement 1: Authentication Entry
- The sign-in page shall display a form for existing users to log in with their email and password.

### Requirement 2: Credential Input
- The user shall be able to enter a registered email address in the Email field.
- The user shall be able to enter a password in the Password field.
- The password field shall mask its value while being entered.

### Requirement 3: Form Submission
- When the user selects Sign in, the system shall validate the form before attempting authentication.
- If the form is valid, the system shall attempt to authenticate the user.
- If the credentials are valid, the user shall be granted access to the authenticated experience.

### Requirement 4: Error Handling
- If the user enters an invalid email or an empty required field, the form shall not submit and shall show validation guidance.
- If the credentials do not match a registered account, the system shall show an authentication error and allow the user to retry.

### Requirement 5: Navigation
- The page shall provide a route to the Create account flow for users who do not yet have an account.
- Successful authentication shall redirect the user away from the sign-in page to the post-login experience.

### Requirement 6: Security Expectations
- Authentication should occur over a secure channel and should never expose credentials in plaintext.
- Sensitive authentication failures should be shown without revealing unnecessary account details.

---

## Acceptance Criteria

```gherkin
Scenario: Successful sign-in
Given a returning customer is on the Sign in page
When they enter a valid registered email address and matching password
And they select Sign in
Then the system validates the credentials
And the user is authenticated successfully
And the user is redirected to the post-login experience
```

```gherkin
Scenario: Empty email and password
Given a user is on the Sign in page
When they select Sign in without entering an email or password
Then the form is not submitted
And the user sees validation messages for the missing required fields
And the user can correct the inputs and retry
```

```gherkin
Scenario: Invalid email format
Given a user is on the Sign in page
When they enter an email value that is not in a valid format
And they select Sign in
Then the form is not submitted
And the user sees an email validation error
And the user can update the email and retry
```

```gherkin
Scenario: Invalid credentials
Given a user is on the Sign in page
When they enter an email and password that do not match an existing account
And they select Sign in
Then the system prevents access
And the user sees an authentication error message
And the user can retry with corrected credentials
```

```gherkin
Scenario: Navigate to create account
Given a user is on the Sign in page
When they select Create account
Then they are routed to the signup/create-account experience
And they can proceed with registering a new account
```

---

## Negative Case Scenarios

```gherkin
Scenario: Password field left empty
Given a user enters an email address but leaves the password blank
When they select Sign in
Then the form is not submitted
And the user sees a required password validation message
And the user can add a password and retry
```

```gherkin
Scenario: Unregistered email
Given a user enters an email that is not associated with an existing account
When they submit the form
Then the authentication request is rejected
And the user sees a clear error message indicating invalid credentials
And the user can try again or create a new account
```

```gherkin
Scenario: Existing authenticated user revisits sign-in page
Given a user is already authenticated
When they access the Sign in page again
Then the system should redirect them away from the sign-in screen
And the user is taken to the authorized experience
```

---

## Open Questions
- What is the exact authentication error message copy required for invalid credentials?
- Are there password recovery or forgot-password requirements tied to this page?
- What is the exact destination after successful sign-in?
- Is the sign-in screen part of a broader secure onboarding or account dashboard flow?
- What should happen if the user is already authenticated and loads this page directly?
- Are there accessibility requirements for keyboard navigation, focus order, and error announcements beyond standard web accessibility conventions?

## Assumptions
- The page is designed for a web application and supports a responsive layout.
- The user must already have a SecureBank account to use this screen.
- Sign-in is a standard email + password flow without MFA or social login in the provided design context.
- The app uses inline validation and real-time or submit-time error messaging.
- The specific post-login destination is not included in the visible design and should be confirmed by product or UX.

## Design Asset Ambiguity
- The visible design supports the core sign-in flow, but it does not explicitly show password recovery, MFA, or alternative sign-in methods.
- The exact destination after successful sign-in is not defined in the provided design reference.
- Exact visual states for pending/loading/error messaging and their final copy are not fully specified; implementation should align with the product’s design system or UX guidelines.

---

## Summary
The Sign in screen supports the core authentication journey for returning SecureBank customers. The design clearly includes email and password entry, submission, and navigation to signup. Several post-authentication and policy details are not visible in the design reference, so they are captured as open questions and assumptions instead of guessed requirements.
