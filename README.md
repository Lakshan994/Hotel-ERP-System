# Hotel ERP System 
**Important:** This is a **new reconstruction based on conversation requirements**, not a byte-for-byte recovery of the old GitHub/Antigravity project. It uses **React + Vite**, **Node.js + Express**, and **MongoDB Atlas + Mongoose**. There is **no Spring Boot, MySQL, or SQLite** in this reconstruction.

## Modules

1. **Authentication** — role-based staff login and admin-only registration
2. **Dashboard** — room, customer, reservation and payment KPIs
3. **Room Management** — add, view, update, delete rooms (with history safeguards)
4. **Customer Management** — maintain guest profiles
5. **Reservations** — create, update, cancel, check in/out; reject overlapping room dates
6. **Billing** — bill from reservation total; record partial/full payment

**Stack:** React 18, Vite, Axios, Express 5, MongoDB Atlas, Mongoose, JWT, bcryptjs, GitHub.

## Project structure

```text
Hotel-ERP-System-Reconstructed/
├── backend/
│   ├── config/db.js
│   ├── controllers/ (auth, dashboard, room, customer, reservation, billing)
│   ├── middleware/ (authentication, validation, errors)
│   ├── models/ (User, Room, Customer, Reservation, Bill)
│   ├── routes/ (module REST routes)
│   ├── scripts/seedAdmin.js
│   ├── tests/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/components/
│   ├── src/context/
│   ├── src/pages/ (Login, Dashboard, Rooms, Customers, Reservations, Billing)
│   ├── src/services/
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── database/ (MongoDB collection design + sample JSON)
├── docs/ (setup, API, process analysis, deployment, group workflow)
├── presentation/ (ten-slide outline)
├── screenshots/
├── .github/workflows/ci.yml
└── .gitignore
```

## Quick start — Windows / VS Code

**Before starting:** Install Node.js 20+; create a MongoDB Atlas cluster, database user, and a narrow IP Access List rule for your current IP. Verify Atlas status is Available.

### Terminal 1 — backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Open `backend/.env` and set your **own** `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. URL-encode special characters in the MongoDB database-user password (for example `@` becomes `%40`). Do not paste credentials into GitHub or chat.

```powershell
npm run seed:admin
npm run dev
```

Expected backend URL: <http://localhost:5000/api/health>

### Terminal 2 — frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Visit <http://localhost:5173> and log in using the credentials you configured for the seed admin. Add rooms and customers, then create a reservation and bill.

If a port is occupied, stop the previous process or change `PORT`; update `CLIENT_URL` / `VITE_API_URL` as required.

## Backend tests

```powershell
cd backend
npm test
```

Tests currently cover date parsing, night counting and booking-date overlap *utilities only*. They do not replace end-to-end API tests.

## API entry points

- `POST /api/auth/login` — public
- `POST /api/auth/register` — admin only
- `GET /api/auth/profile` — bearer token
- `GET, POST, PUT, DELETE /api/rooms`
- `GET, POST, PUT, DELETE /api/customers`
- `GET, POST, PUT, DELETE /api/reservations`, `PATCH /api/reservations/:id/status`
- `GET, POST, DELETE /api/bills`, `PATCH /api/bills/:id/payment`
- `GET /api/dashboard`

See [docs/API.md](docs/API.md) for actual request/response examples, [docs/INSTALLATION.md](docs/INSTALLATION.md) for troubleshooting 

## Business workflow

Guest profile → room selection → reservation (availability check) → optional check-in → bill → payment → check-out. Bills reference reservations; reservations reference room and guest. `CheckedIn` and `CheckedOut` affect the room's operational status.

## Security and limitations

- `.env` is excluded from Git. All example credentials are placeholders.
- **Rotate the MongoDB password and JWT secret previously posted in chat before using this project.**
- JWT is stored in localStorage for ease of classroom demo. For production, consider secure HTTP-only cookies, CSRF strategy, stronger audit logging, and token revocation.
- Booking conflict detection does not guarantee race-free reservations under concurrent requests. A production system needs a transaction/locking design and stronger state constraints.
- Basic tests and documentation are included; there is no claim of production readiness or that Azure deployment is already configured.
- Currency is intentionally not hardcoded. Set your chosen currency consistently in the UI/report; values are unit amounts.

 