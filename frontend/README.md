# SkillSwap Frontend

React 18 + Vite + Tailwind CSS frontend for the SkillSwap platform. This is a **separate** frontend application located in `frontend/`, built to integrate with the existing Spring Boot backend in `backend/`.

## Tech Stack

- **React 18** with **Vite**
- **Tailwind CSS** for styling
- **React Router v6** for client-side routing
- **Axios** for API communication
- **Lucide React** for icons
- **Recharts** for data visualization (admin dashboard)

## Requirements

- Node.js **>= 18.0.0**
- The backend must be running (see below)

## Setup

1. Install dependencies (requires Node.js >= 18):

   ```bash
   npm install
   ```

2. Create a `.env` file in the `frontend/` directory:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_APP_NAME=SkillSwap
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Base URL for the backend API |
| `VITE_APP_NAME` | `SkillSwap` | Application name displayed in the header |

## Backend Integration

This frontend consumes the following backend API groups (all under `/api/v1`):

- **Auth**: `/auth/register`, `/auth/verify-email`, `/auth/login`, `/auth/refresh-token`, `/auth/me`
- **Profile**: `/profile/*`
- **Skills**: `/skills/*`
- **Swaps**: `/swaps/*`
- **Sessions**: `/sessions/*`
- **Wallet**: `/wallet/*`
- **Reviews**: `/reviews/*`
- **Notifications**: `/notifications/*`
- **Messages**: `/messages/*`

See `backend/src/main/java/com/skillswap/controller/` for the full controller inventory.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Image/icon assets
│   ├── components/  # Reusable UI components
│   ├── pages/       # React Router pages
│   ├── services/    # Axios API client and API service modules
│   ├── hooks/       # Custom React hooks
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Route definitions
│   └── main.jsx     # Application entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```
