# APEX Elite Analytics

A mobile-first running & endurance training analytics app.

## Features
- Import FIT, GPX, and CSV workout files
- Readiness score, CTL/ATL/TSB fitness modelling
- Race time predictions (Riegel + VDOT)
- Recovery status and strain tracking
- Training calendar and trend charts
- Gear / shoe tracking with mileage alerts
- All data saved locally in your browser (no backend needed)

## Deploy in 3 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 3. Deploy to Vercel (free)

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import your repo
3. Leave all settings as default → Deploy
4. Done — you get a live HTTPS URL instantly

### Deploy to Netlify (free alternative)
```bash
npm run build
```
Then drag the `dist/` folder to netlify.com/drop

## Project structure
```
apex/
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── vite.config.js          # Build config
├── .gitignore
└── src/
    ├── main.jsx            # React root mount
    └── endurance-analytics.jsx   # Full app
```

## Data persistence
All data (workouts, athlete profile, settings, shoes) is saved to browser localStorage automatically. Data stays on your device — no server, no account needed.

To clear all data: open browser DevTools → Application → Local Storage → clear keys starting with `apex_`
