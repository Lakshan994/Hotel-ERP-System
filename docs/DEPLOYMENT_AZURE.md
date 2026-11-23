# Azure Deployment Guide — Plan (not yet performed)

This reconstructed ZIP has **not** been deployed. You must configure and verify cloud services.

## Recommended architecture

```text
Browser → Azure Static Web Apps (React + Vite)
                   │ HTTPS Axios REST requests
                   ▼
          Azure App Service (Node.js Express API)
                   │ TLS / Atlas SRV URI
                   ▼
               MongoDB Atlas
```

## Backend (Azure App Service)
1. Create an Azure App Service compatible with your subscription and Node.js version; verify allowed regions/costs and select a supported Node runtime.
2. Deploy the `backend/` application (GitHub Actions or supported App Service deployment flow).
3. Set App Service **Environment Variables**: `NODE_ENV=production`, `PORT` if needed, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` to the exact Azure frontend origin.
4. Do not deploy `backend/.env` or hardcode secrets in source control.
5. In MongoDB Atlas, securely configure **network access** for your Azure app's outbound IPs or the appropriate supported connectivity option; avoid global open access if possible.
6. Test `https://YOUR_BACKEND.azurewebsites.net/api/health` and a protected route via Postman.
7. Configure the startup command as required by the App Service runtime (`npm start`).

## Frontend (Azure Static Web Apps)
1. Create Azure Static Web App connected to your GitHub repository.
2. App location `frontend`; output location `dist`; build command uses `npm run build`.
3. Set `VITE_API_URL=https://YOUR_BACKEND.azurewebsites.net/api` at **build time** (Vite statically embeds this value).
4. Add the Azure frontend URL as an allowed origin in backend `CLIENT_URL`, then redeploy backend.
5. Add `frontend/public/staticwebapp.config.json` (already provided) for SPA navigation fallbacks.
6. Redeploy frontend; test login, rooms, customers, reservations and billing from the public URL.

## Requirements and caveats
- Azure service region restrictions/student account policies may block specific services. Check entitlement before promising deployment.
- Atlas is a cloud database **outside Azure**. Explain the choice and confirm lecturer acceptance.
- Avoid exposing admin seeding credentials or database passwords in static build variables.
- Frontend URL alone does not prove backend/database functionality. Test end-to-end and save screenshots.
