# AIMarg Web

Next.js web client for the AIMarg API.

## Local Setup

Requires Node.js 20.9 or newer. From this directory, in PowerShell:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` in `.env.local` if the backend is hosted somewhere else. This value is public and must not contain credentials or secrets.

## Scripts

- `npm run dev`: start the development server
- `npm run lint`: run ESLint
- `npm run typecheck`: run TypeScript without emitting files
- `npm run build`: create a production build
- `npm start`: serve a production build

Web refresh tokens are stored in an HttpOnly cookie by the backend; access tokens remain in memory and are not written to browser storage.
