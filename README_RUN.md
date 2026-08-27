# CareerSync Run Guide

This project is a single TanStack Start app. The development server handles the frontend and the server functions in one process, so there is no separate backend to start.

## One-click startup

Run:

```bat
start-careersync.bat
```

That script will:

1. Check that Node.js is installed.
2. Check that npm is installed.
3. Install dependencies if `node_modules` is missing.
4. Start the dev server on `http://localhost:5173/`.
5. Open the browser automatically.

To stop the running dev server, run:

```bat
stop-careersync.bat
```

## Requirements

- Node.js is required.
- npm is required.
- Recommended Node.js version: current LTS.

If Node.js is missing:

1. Install Node.js from https://nodejs.org/
2. Reopen the terminal.
3. Verify with:

```bat
node -v
npm -v
```

If npm is missing:

1. Reinstall Node.js from https://nodejs.org/ so npm is included.
2. Reopen the terminal.
3. Verify with:

```bat
node -v
npm -v
```

## Environment variables

The app runs in local demo mode by default, so no environment variables are required just to start it.

If local demo mode is disabled by setting `VITE_USE_LOCAL_DEMO=false`, the Supabase variables below are required:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` for server-side admin operations

The existing `.env` file already contains the Supabase values used by this project.

## Notes

- The default URL is `http://localhost:5173/`.
- If port 5173 is already in use, stop the conflicting process first with `stop-careersync.bat`.
- `npm run dev` is the underlying development command used by the launcher.