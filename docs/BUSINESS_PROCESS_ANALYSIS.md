# Business Process Analysis — Hotel ERP

## Industry and stakeholders
Hotel operations connect front desk/reception, hotel manager, finance, guests and housekeeping. Stakeholders include receptionists, guests, managers, accountants and support personnel.

## Typical operational challenges
- Manual reservations and spreadsheets can create duplicated room bookings.
- Unlinked guest, room and invoice records lead to slow administration.
- Staff may not know which room is occupied or available.
- Revenue reporting becomes slow and error-prone.

These are **industry examples for analysis**, not claims proven about a specific hotel. Provide interviews/observations if your group has actual evidence.

## Proposed integrated process (implemented prototype)
1. Admin creates room inventory; receptionist records customer data.
2. Reservation links a customer and room with start/end dates.
3. API rejects active reservations with overlapping date ranges for the same room.
4. Check-in changes the room's operational state to `Occupied`; check-out changes it to `Available`.
5. Billing generates the amount based on the reservation's stored nightly rate and nights.
6. Payments update the bill status (`Pending` → `Partial` → `Paid`), which feeds dashboard totals.

## Expected improvements
One shared dataset, fewer data-entry mistakes, centralized booking records, traceable invoices, consistent dashboard statistics, and clearer process ownership.

## Scope limits
The assignment requires four business modules; this prototype uses Reservations, Rooms, Customers and Billing. Authentication and Dashboard are support features. Housekeeping and Employee Management were part of a *different later project* and are **not** reconstructed here.
