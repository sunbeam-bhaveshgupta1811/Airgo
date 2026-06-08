# Airline Reservation System PRD

## 1. Product Overview

The Airline Reservation System is a web application for customers to search flights, book tickets, make payments, download/view tickets, manage their profile, and submit feedback. Admin users can manage airlines, flights, scheduled flights, passengers, feedback, dashboards, and performance reporting.

The frontend is built with React and Vite, using React Router for navigation, Axios-backed service modules for API access, Bootstrap/React Bootstrap for UI support, and route guards for role-based access.

## 2. Goals

- Let customers complete a full flight booking journey from search to ticket confirmation.
- Provide secure authentication for customers and admins.
- Give admins tools to manage airline inventory and monitor operational data.
- Keep booking data reliable across multi-step flows.
- Present a responsive, understandable interface for common airline reservation tasks.

## 3. User Personas

- Customer: Searches flights, compares fares, enters passenger details, pays, and views tickets.
- Admin: Manages airlines, flights, schedules, passengers, customer feedback, and dashboard metrics.
- Guest visitor: Views the home page, about page, contact page, FAQ, and can register or log in.

## 4. Core User Flows

### Customer Authentication

1. Customer registers with personal details.
2. Customer verifies email when required.
3. Customer logs in.
4. Customer can request forgot-password and reset-password flows.
5. Protected customer pages require `CUSTOMER` or `USER` roles.

### Customer Booking

1. Customer searches one-way flights by source, destination, and departure date.
2. App retrieves matching flights from the customer flight search service.
3. Customer selects a flight and fare class.
4. Customer enters passenger details.
5. Customer reviews booking preview.
6. Customer pays using card or UPI.
7. App confirms booking and redirects to ticket page.
8. Customer views ticket details.

### Customer Account and Feedback

1. Customer views profile after authentication.
2. Customer changes password where supported.
3. Customer submits feedback from the protected customer area.

### Admin Authentication and Management

1. Admin logs in from the admin login route.
2. Protected admin pages require `ADMIN` role.
3. Admin views dashboard and performance chart.
4. Admin manages airlines, flights, scheduled flights, passenger lists, profile, and feedback.

## 5. Functional Requirements

### Authentication

- Support customer registration.
- Support login for customer and admin roles.
- Support email verification and resend verification.
- Support forgot password and reset password.
- Redirect unauthorized users away from protected routes.
- Store and use role information consistently for route access.

### Flight Search

- Accept source, destination, and departure date.
- Prevent searching past dates.
- Show loading/searching state while the request is active.
- Display a no-results message when no flights match.
- Transform backend flight fields into UI-friendly flight list data.

### Booking

- Preserve selected flight, fare class, passenger data, and total price across booking steps.
- Validate that booking preview has both flight and passenger data.
- Let users navigate back before payment.
- Calculate total fare from selected price and passenger count.

### Payment

- Support card and UPI payment modes.
- Validate cardholder name, card number, expiry, CVV, and UPI ID.
- Generate or use a transaction/booking identifier.
- Store booking confirmation for ticket display.
- Clear temporary booking session data after successful payment.

### Ticket

- Display confirmed booking and passenger details.
- Support ticket viewing after successful payment.
- Keep ticket data resilient when reached from payment state or stored confirmation.

### Admin

- View admin dashboard.
- Add and manage airlines.
- Manage flights and scheduled flights.
- View passenger list.
- View customer feedback.
- View profile and performance chart.

### Feedback and Support Content

- Provide About, Contact Us, and FAQ access from the public/customer layout.
- Allow authenticated customers to submit feedback.
- Allow admins to view feedback.

## 6. Non-Functional Requirements

- Frontend must build successfully with Vite.
- API calls should remain inside `src/services`.
- Route-level components should remain inside `src/pages`.
- CSS should remain inside `src/styles`.
- UI should be responsive enough for common laptop and desktop usage.
- Protected routes must fail closed for unauthorized users.
- Booking and payment screens must handle missing session data gracefully.

## 7. API Dependencies

The frontend expects backend endpoints for:

- Authentication: signup, login, forgot password, reset password, email verification, resend verification.
- Customer: flight search, booking, payment, profile, ticket.
- Admin: dashboard metrics, airline management, flight management, feedback, profile.

The base backend URL is read from `config.js`.

## 8. Success Metrics

- Customer can complete search to ticket confirmation without manual refresh.
- Admin can view and manage airline/flight data from protected admin routes.
- Unauthorized users cannot access protected customer or admin routes.
- Production build succeeds without unresolved imports.
- Booking/payment screens recover cleanly from missing or invalid state.

## 9. Out of Scope

- Native mobile applications.
- Real payment gateway settlement.
- Multi-city or round-trip booking completion unless added in future requirements.
- Loyalty programs and coupons beyond the current special fare display.
- Advanced seat map selection.

## 10. Future Enhancements

- Add full round-trip booking support.
- Add seat selection with cabin layout.
- Add booking history for customers.
- Add cancellation and refund workflows.
- Add admin editing flows for existing airlines/flights.
- Add automated tests for route protection, booking persistence, and payment validation.
