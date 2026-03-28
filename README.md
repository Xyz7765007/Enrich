# Voxelised Lead Engine

Apollo-powered lead search, enrichment, scoring, and CSV export tool.

## How It Works

1. **Search** — Queries Apollo's People Search API with your filters (titles, seniorities, locations, domains, etc.)
2. **Enrich** — Runs bulk enrichment in batches of 10 to get verified emails, org data, and growth signals
3. **Score** — Grades each lead A/B/C/D based on email quality (30pts), seniority (25pts), company size (15pts), revenue (15pts), growth (10pts), LinkedIn (5pts)
4. **Export** — Downloads CSV with market section headers and outreach channel instructions baked in

## Deploy to Vercel

### Option A: CLI (fastest)

```bash
npm i -g vercel
cd voxelised-lead-engine
vercel
```

### Option B: GitHub

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import the repo
3. Deploy (zero config needed)

## Project Structure

```
├── api/
│   ├── search.js      # Serverless proxy → Apollo People Search
│   └── enrich.js      # Serverless proxy → Apollo Bulk Enrich
├── public/
│   └── index.html     # Full React frontend (CDN, no build step)
├── vercel.json        # Routing config
├── package.json
└── README.md
```

## No Build Step Required

The frontend uses React via CDN with Babel for JSX transformation. The API routes are Vercel serverless functions. Just deploy and go.

## API Key Security

- Your Apollo API key is entered in the browser and sent ONLY to your own Vercel serverless functions
- The serverless functions proxy the request to Apollo's API
- No key is stored on the server — it's passed per-request from the browser

## Scoring Algorithm

| Signal | Max Points | Details |
|--------|-----------|---------|
| Email quality | 30 | Verified=30, Likely=20, Has email=10 |
| Seniority | 25 | Founder=25, C-Suite=22, VP=18, Director=14 |
| Company size | 15 | 50-500 emp=15 (sweet spot), 500-2K=12 |
| Revenue | 15 | $1M-$100M=15, >$100M=10 |
| 12mo growth | 10 | >20%=10, >5%=6 |
| LinkedIn | 5 | Has profile=5 |

## CSV Export Format

Exports with market-grouped section headers:
```
--- INDIA (42 leads) --- | Email + LinkedIn simultaneous
--- GULF (18 leads) ---  | LinkedIn FIRST then email 2-3 days later
--- ANZ/SEA (26 leads) --- | Email + LinkedIn + Loom mandatory
```

Each row includes: Name, Title, Company, Email, Status, LinkedIn, Market, Channel, Score, Grade
