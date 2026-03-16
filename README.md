# Eastbrook Youth AI Well‑Being Dashboard

A professional dashboard for your case study: **Everyday AI Dependence and Youth Well‑Being (Eastbrook)**.

## Tech
- Next.js (TypeScript)
- Tailwind CSS
- Recharts (charts)
- PapaParse (CSV parsing)

## Data
This project loads the dataset client‑side from:

`public/data/synthetic_eastbrook_user_day_UPDATED.csv`

(Already included in this zip.)

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy on Vercel (no login)
1. Push this folder to GitHub
2. Vercel → New Project → Import repo → Deploy
3. You’ll get a public URL like: `https://<project>.vercel.app`

## Notes
- The dashboard is public and requires **no authentication**.
- Filters: Phase, Age Group, Reliance Type.
