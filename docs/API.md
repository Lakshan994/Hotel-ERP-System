# Hotel ERP REST API

Base URL local: `http://localhost:5000/api`. JSON request/response.

## Auth
- `POST /auth/login` — `{ "email": "admin@example.com", "password": "YOUR_PASSWORD" }` returns `{ success, token, user }`.
- `GET /auth/profile` — `Authorization: Bearer TOKEN`.
- `POST /auth/register` — Admin token required; `{ "fullName": "Staff", "email": "staff@example.com", "password": "strong_password_123", "role": "Receptionist" }`.
- Initial admin is created with `npm run seed:admin`, **not** an unauthenticated registration API.

## Rooms
- `GET /rooms` and `GET /rooms/:id` — protected.
- `POST /rooms` — `{ "roomNumber":"101", "roomType":"Double", "pricePerNight":15000, "capacity":2, "status":"Available" }`.
- `PUT /rooms/:id` — allowed fields only, e.g. `{ "pricePerNight":16000 }`.
- `DELETE /rooms/:id` — Admin only; blocked for rooms with reservation history.

## Customers
- `GET /customers?search=name` and `GET /customers/:id`.
- `POST /customers` — `{ "firstName":"Amal", "lastName":"Perera", "phone":"0770000000", "email":"amal@example.com" }`.
- `PUT /customers/:id` — update fields.
- `DELETE /customers/:id` — Admin only; blocked with reservation history.

## Reservations
- `GET /reservations`, `GET /reservations/:id`.
- `POST /reservations` — `{ "customerId":"OBJECT_ID", "roomId":"OBJECT_ID", "checkInDate":"2026-12-10", "checkOutDate":"2026-12-12" }`.
- `PUT /reservations/:id` — edit a Pending/Confirmed reservation without a bill.
- `PATCH /reservations/:id/status` — `{ "status":"CheckedIn" }` or `Confirmed`, `CheckedOut`, `Cancelled` where transition allowed.
- `DELETE /reservations/:id` — a **soft cancel**, not physical deletion. Only Pending/Confirmed can be cancelled.
- Dates are **YYYY-MM-DD**; checkout-exclusive. Booking with overlapping active dates for the same room returns HTTP 409.

## Bills
- `GET /bills`, `GET /bills/:id`.
- `POST /bills` — `{ "reservationId":"OBJECT_ID" }`; amount from saved reservation snapshot (nightlyRate × nights).
- `PATCH /bills/:id/payment` — `{ "paymentAmount": 3000, "paymentMethod":"Cash" }`; payment can be partial but cannot exceed balance.
- `DELETE /bills/:id` — Admin only and unpaid bills only.
- `/billing` is a compatibility alias for `/bills`.

## Dashboard
- `GET /dashboard` — counts of rooms, available/occupied rooms, customers, reservations and cumulative **paidAmount**.

## Response conventions
Success: `{ "success": true, "data": { ... } }`; failure: `{ "success": false, "message": "..." }`.
Possible HTTP statuses: 400 validation, 401 unauthorized, 403 forbidden, 404 not found, 409 conflict, 500 unexpected error.

**Postman testing order**: Seed admin → Login → Add room → Add customer → Make reservation → Re-test overlapping booking (expect 409) → Create bill → Record partial/full payment → Check dashboard.
