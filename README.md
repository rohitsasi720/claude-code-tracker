# Claude Code Tracker

A local monorepo dashboard that automatically reads your `~/.claude/` session files and visualises all your Claude Code activity — prompts, sessions, projects, and history.

```
claude-code-tracker/
├── apps/
│   ├── api/          ← Express server — reads ~/.claude/ and serves JSON
│   └── dashboard/    ← React + Vite frontend
└── packages/
    └── shared/       ← Shared types / utilities
```

## Prerequisites

- Node.js 18+
- npm 8+ (workspaces support)
- Claude Code installed and used at least once (creates `~/.claude/`)

## Quick Start

```bash
# 1. Install all dependencies
npm install

# 2. Start both API and dashboard together
npm run dev
```

Then open **http://localhost:5173** in your browser.

| Service   | URL                    | Purpose                        |
|-----------|------------------------|--------------------------------|
| Dashboard | http://localhost:5173  | React UI                       |
| API       | http://localhost:3001  | Reads `~/.claude/` and serves data |

## What it reads

| File / Dir                          | What's in it                                      |
|-------------------------------------|---------------------------------------------------|
| `~/.claude/history.jsonl`           | Every prompt you've ever typed, with timestamps   |
| `~/.claude/projects/*/sessions-index.json` | Session summaries per project             |
| `~/.claude/projects/*/*.jsonl`      | Full conversation transcripts per session         |

All data is read-only. Nothing is written or sent anywhere.

## API Endpoints

| Endpoint                              | Description                          |
|---------------------------------------|--------------------------------------|
| `GET /health`                         | Health check                         |
| `GET /api/stats`                      | Aggregate stats + 90-day activity    |
| `GET /api/history?q=&project=&limit=&offset=` | Paginated prompt history   |
| `GET /api/sessions`                   | All sessions across all projects     |
| `GET /api/projects`                   | Project stats sorted by activity     |
| `GET /api/session/:projectDir/:sessionId` | Full transcript for one session  |

## Features

- **Metrics** — total prompts, sessions, projects, active days
- **30-day bar chart** — daily prompt volume
- **90-day heatmap** — GitHub-style contribution calendar
- **Project leaderboard** — click any project to filter the history list
- **Prompt history browser** — paginated, searchable, filterable by project
- **CSV export** — export any filtered view
- **Live status bar** — shows API connection and data path
- **Auto-refresh** — just refresh the page for the latest data

## Scripts

```bash
npm run dev        # Start API + dashboard concurrently
npm run start      # Start API only (production)
npm run build      # Build dashboard for production
```

## Troubleshooting

**"Cannot connect to API"** — make sure you ran `npm run dev` and port 3001 is free.

**"No history found"** — the dashboard reads `~/.claude/history.jsonl`. Use Claude Code at least once to generate it.

**Port conflicts** — set `PORT=3002` before running to use a different API port, and update `vite.config.js` accordingly.
