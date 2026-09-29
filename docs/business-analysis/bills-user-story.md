# User Story: Pay Bills

## Feature / Page Name
- Pay Bills / Manage and pay bills

## Figma Design URL
- https://device-savor-72618845.figma.site/dashboard/bills

## Target Platform
- Web
- Responsive behavior is not specified in the accessible reference.

## Primary User Role / Persona
- Authenticated SecureBank customer / account holder

## Description

As an authenticated SecureBank customer

I want to enter bill payment details or act on an upcoming bill

So that I can manage and pay my bills from my SecureBank account.

---

## Screen Summary

### Screen Name
- Pay Bills

### Purpose
- Let an authenticated customer enter details for a bill payment and review bills due this month, with a visible payment action for unpaid bills.

### User Role
- Authenticated SecureBank customer / account holder

### Available Actions
- Navigate among Dashboard, Transfer Money, and Pay Bills.
- Select a bill type.
- Enter an account or reference number and payment amount.
- Select a payment account.
- Submit the form using Pay Bill.
- Select Pay Now for an upcoming bill that is not marked Paid.
- Log out.

### Navigation Flow
- The page is available under the authenticated Dashboard area.
- The visible application navigation links to Dashboard, Transfer Money, and Pay Bills.
- The user can return to another listed section or log out.
- The reference does not show what screen or confirmation follows Pay Bill or Pay Now.

### Permissions
- The SecureBank header exposes a Logout action, and the page is within the dashboard area. Treat it as an authenticated customer page.
- Exact access-denied behavior and account-level eligibility rules are not shown.

### Business Rules
- The page separates manual bill entry (“Pay New Bill”) from listed upcoming bills (“Upcoming Bills”).
- A listed bill marked Paid is presented with a Paid status rather than a Pay Now action.
- Listed bills not marked Paid show a Pay Now action.
- The manual payment form presents bill type, account/reference number, amount, and payment account controls.
- Requiredness, amount limits, bill-type-specific reference formats, duplicate-payment handling, processing timing, and confirmation behavior are not defined by the reference and require product confirmation.
- The list heading says “Bills due this month.” Visible examples are Electric Bill (City Power, due 2026-05-05, $89.20), Internet (FastNet, due 2026-05-08, $59.99), Mobile Phone (TelecomPlus, due 2026-05-10, marked Paid), and Water Bill (City Water, due 2026-05-12, $34.50). Confirm whether these are static design examples or dynamically supplied bill data.

### Dependencies
- Authenticated customer session and application navigation
- Bill-type options and bill payment form handling
- Customer payment-account options
- Upcoming-bill data, including payee, due date, amount, and payment status
- Bill payment processing and outcome feedback (details not shown in the reference)

---

## UI Analysis

### Screen Layout
- SecureBank header with a Logout link and navigation to Dashboard, Transfer Money, and Pay Bills.
- Main content headed “Pay Bills,” with the description “Manage and pay your bills.”
- “Pay New Bill” section with the description “Enter bill payment details.”
- Manual form fields appear in this order: Bill Type, Account/Reference Number, Amount $, Payment Account, followed by Pay Bill.
- “Upcoming Bills” section with the description “Bills due this month.” It shows bill entries with category/name, provider, due date, amount where visible, and a payment action or status.

### Screen States
- Default: the form and upcoming-bill entries are visible.
- Paid: the Mobile Phone entry is marked Paid.
- Payable: Electric Bill, Internet, and Water Bill entries show Pay Now.
- Focus, hover, active, disabled, loading, empty, success, warning, error, and permission-restricted states are not depicted in the accessible reference.
- No alternate screens, confirmation dialog, or payment result is exposed by the reference content.

### Responsive Behavior
- The reference is a web page. No separate mobile/tablet layout, breakpoints, or responsive interaction behavior is specified.

---

## UI Components

| Component | Type | Description | State | User Action | Validation |
|-----------|------|-------------|-------|-------------|------------|
| SecureBank Header | Header / Brand | Identifies the banking application | Default | User identifies the application | Not Applicable |
| Dashboard | Navigation link | Opens the dashboard area | Default / Active (current item not visually confirmed) | User navigates to Dashboard | Not Applicable |
| Transfer Money | Navigation link | Opens the transfer feature | Default | User navigates to Transfer Money | Not Applicable |
| Pay Bills | Navigation link / Page title | Identifies and opens the current bill-payment feature | Default / Active (current item not visually confirmed) | User remains on or navigates to Pay Bills | Not Applicable |
| Logout | Link | Ends or exits the current authenticated experience | Default | User logs out | Not Applicable; logout confirmation behavior is not shown. |
| Bill Type | Select | Lets the user choose the type of bill to pay | Default | User selects a bill type | Requiredness is implied by the payment form but not explicitly marked. Confirm requiredness, available options, and any bill-type-dependent rules. Prevent invalid or unsupported values from being submitted. |
| Account/Reference Number | Input | Captures the biller account or reference identifier | Default | User enters an identifier | Requiredness is implied but not explicitly marked. Confirm allowed characters, length, format, and when validation occurs. Reject an invalid value once the biller-specific rules are defined. |
| Amount $ | Monetary input | Captures the payment amount | Default | User enters a payment amount | Requiredness and limits are not specified. Confirm currency, decimal precision, minimum/maximum, and validation timing; prevent non-numeric or out-of-policy values from payment. |
| Payment Account | Select | Lets the user choose the account used to pay | Default | User selects an account | Requiredness is implied but not explicitly marked. Confirm eligible account types and behavior when no eligible account is available. |
| Pay Bill | Primary button | Submits the entered bill-payment details | Default | User submits a new bill payment | Submission should be blocked when required inputs are missing or invalid; exact required fields and validation feedback must be confirmed. Processing, duplicate-submit prevention, and result feedback are not shown. |
| Upcoming Bills | Section / List | Presents bills due this month | Default | User reviews listed bills | Not Applicable |
| Bill Entry | List item | Shows bill category/name, provider, due date, amount when present, and action/status | Payable / Paid | User reviews bill details | Not Applicable for display. Confirm required data fields and handling of missing or invalid bill data. |
| Pay Now | Button / Link | Offers an action for a bill not marked Paid | Default | User starts payment for the listed bill | Not Applicable for the control itself. The reference does not specify whether this pre-fills the form, submits directly, or opens a separate step. |
| Paid | Status label | Indicates the Mobile Phone bill has been paid | Paid | User reads payment status | Not Applicable |

---

## Functional Requirements

### Requirement 1: Authenticated Page and Navigation
- The Pay Bills page shall be presented within the SecureBank dashboard area.
- The page shall expose the visible Dashboard, Transfer Money, Pay Bills, and Logout navigation actions.
- Authentication enforcement and the destination after logout must follow the application’s confirmed session behavior; those details are not shown in this design.

### Requirement 2: Manual Bill Payment Details
- The page shall present controls for bill type, account/reference number, amount, and payment account, with a Pay Bill action.
- The system shall use the values selected or entered by the customer when processing the submitted payment.
- The system shall validate required fields and accepted formats before processing, once product rules for requiredness and formats are confirmed.

### Requirement 3: Upcoming Bills
- The page shall show an Upcoming Bills section labeled “Bills due this month.”
- Each listed bill shall present its name/category, provider, due date, and available amount/status information.
- A bill marked Paid shall show the Paid status. A bill not marked Paid shall offer Pay Now, as shown in the reference.

### Requirement 4: Bill Payment Action
- The customer shall be able to invoke Pay Bill for manually entered bill details and Pay Now for a listed payable bill.
- The system shall provide a clear outcome after a payment attempt. The exact confirmation, error, and recovery flows are not specified by the reference and must be defined before implementation.

### Requirement 5: Responsive Presentation
- The page shall render as a web experience. Specific responsive layouts and supported viewport sizes remain to be confirmed.

---

## Acceptance Criteria

```gherkin
Scenario: Pay Bills page displays its main sections
Given an authenticated SecureBank customer opens the Pay Bills page
When the page is displayed
Then the page shows the Pay Bills heading and bill-management description
And the Pay New Bill form and Upcoming Bills section are visible
And the form presents Bill Type, Account/Reference Number, Amount, Payment Account, and Pay Bill
```

```gherkin
Scenario: Customer can choose a bill type and payment account
Given an authenticated customer is viewing the Pay New Bill form
When the customer opens the Bill Type and Payment Account controls
Then the customer can select from the options provided by the application
And the selected values remain associated with the form until submission or navigation
```

```gherkin
Scenario: Customer enters new bill payment details
Given an authenticated customer is viewing the Pay New Bill form
When the customer enters an account/reference number and amount
And selects a bill type and payment account
Then the form contains the details entered or selected by the customer
And the customer can invoke Pay Bill
```

```gherkin
Scenario: Upcoming unpaid bill offers Pay Now
Given the Upcoming Bills list contains a bill not marked Paid
When the customer views that bill
Then the bill entry shows its available identifying and due-date details
And a Pay Now action is available for that entry
```

```gherkin
Scenario: Paid bill is shown as paid
Given the Upcoming Bills list contains a bill with Paid status
When the customer views that bill
Then the entry displays Paid
And it does not present the Pay Now action shown for unpaid entries
```

```gherkin
Scenario: Customer navigates to another visible section
Given an authenticated customer is on the Pay Bills page
When the customer selects Dashboard or Transfer Money
Then the application opens the selected section
```

## Negative Case Scenarios

```gherkin
Scenario: Required payment detail is missing
Given a customer has left one or more required bill-payment fields incomplete
When the customer selects Pay Bill
Then the payment is not processed
And the missing field or fields are identified for correction
```

```gherkin
Scenario: Payment detail fails a confirmed validation rule
Given the product has defined validation rules for the selected bill type and payment account
And a customer enters a value that violates one of those rules
When the customer selects Pay Bill
Then the payment is not processed
And the customer receives an actionable validation message
```

```gherkin
Scenario: Bill payment processing fails
Given a customer submits valid bill-payment details
When the payment service cannot complete the payment
Then the customer is informed that the payment did not complete
And the interface provides the recovery action defined by the product
```

```gherkin
Scenario: Customer attempts to pay a bill marked Paid
Given an upcoming bill is marked Paid
When the customer views its entry
Then the entry shows Paid
And no Pay Now action is offered for that bill
```

---

## Open Questions
- Which bill types and payment accounts are available, and how are they sourced?
- Are bill type, account/reference number, amount, and payment account all mandatory? The form labels imply these are payment details, but the design does not mark required fields.
- What reference-number formats and length rules apply to each bill type?
- What currency, decimal precision, minimum/maximum payment amounts, balance checks, fees, and payment limits apply?
- What does Pay Now do: prefill the Pay New Bill form, open a review step, or submit the listed bill for payment?
- Does either payment action require a review/confirmation step? What success, failure, loading, retry, and duplicate-submission behavior is required?
- Can customers edit or remove upcoming bills, or view bill/payment history? These actions are not shown.
- Are the displayed May 2026 due dates and amounts sample data, or should the list be populated dynamically? How should overdue bills be labeled?
- What should appear if there are no upcoming bills, no eligible payment accounts, or bill data fails to load?
- What responsive layouts and supported viewport sizes are required?
- What authentication restriction and post-logout destination should apply?

## Assumptions
- The page is intended for an authenticated SecureBank customer, based on its placement under the dashboard and the visible Logout action.
- The target platform is Web, based on the supplied browser-accessible reference. Responsive behavior is not assumed.
- The form fields represent inputs for a new bill payment; mandatory status and detailed validation constraints remain unconfirmed.
- The displayed bill examples are documented as seen and are not treated as authoritative live data.

## Design Asset Ambiguity
- The accessible reference exposes one page’s visible text and controls, but not component variants, prototype connections, hover/focus/disabled states, or alternate payment-result screens.
- The Mobile Phone entry is marked Paid and has no amount visible in the extracted reference content. Confirm whether an amount is intentionally omitted.
- The design does not establish what happens after Pay Bill or Pay Now, nor whether either action opens a review or confirmation step.