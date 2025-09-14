# FactorioStatusTool

Simple Express API that queries a Factorio server via RCON to report version, uptime, and online players.

## Setup

1. Copy `.env.example` to `.env` and adjust RCON connection settings.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start in development mode:
   ```bash
   npm run dev
   ```

## API

- `GET /api/status` – returns JSON with `version`, `uptime`, and list of `players`.

This is a minimal foundation; it can be expanded into a full dashboard as described in the project plan.
