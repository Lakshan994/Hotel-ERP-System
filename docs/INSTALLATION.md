# Local Installation and Troubleshooting

## Prerequisites
- Node.js 20+; npm; Git and VS Code
- MongoDB Atlas project with a running free/shared cluster and database user
- Network Access rule for **your public IP**; don't permit the whole internet unless there is no alternative and you understand the risk

## Backend
1. `cd backend`
2. `npm install`
3. On Windows PowerShell: `Copy-Item .env.example .env` (Mac/Linux `cp .env.example .env`)
4. Set the secrets/config in `.env`. Use your actual Atlas driver connection string and `/hotel_erp` database path.
5. `npm run seed:admin` to create your first admin.
6. `npm run dev`; open `http://localhost:5000/api/health`.

## Frontend
1. New terminal: `cd frontend`
2. `npm install`
3. `Copy-Item .env.example .env` (or `cp ...`)
4. Check `VITE_API_URL=http://localhost:5000/api`
5. `npm run dev`; open `http://localhost:5173`.

## Common errors
- `'vite' is not recognized`: run `npm install` inside `frontend`, not the project root.
- `EADDRINUSE :5000`: another backend already uses port 5000. Stop that process or change `PORT` and your frontend API URL.
- `Could not connect to any servers`: ensure your Atlas cluster is running; verify current network IP is allowed; verify DNS and outbound 27017 firewall; check Atlas database username/URL-encoded password.
- `401` from API: login first and use the Bearer token.
- `CORS`: add frontend origin to `CLIENT_URL` (comma-separated values allowed).
- Blank frontend after deploy: check Azure Static Web Apps SPA fallback and `VITE_API_URL` build setting.

## Safety
Never upload `backend/.env`, database passwords, JWT secrets, or credential screenshots. Do not add real passwords to `.env.example`.
