# Factorio Server Dashboard

Production-ready dashboard for a Factorio server built with Next.js 14, TypeScript and TailwindCSS. It exposes API routes that communicate with the Factorio server via RCON and provides live updates over Server-Sent Events.

## Features

- Server status (version, uptime, online indicator)
- List of online players with playtime
- Real-time chat stream and ability to send messages
- Daily world map preview generated with Mapshot
- Table of researched technologies

## Development

1. Copy `.env.example` to `.env` and configure connection details.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The repository includes a `docker-compose.yml` with three services:

- **factorio** – game server (`factoriotools/factorio:stable`), RCON only on the internal network.
- **dashboard** – this Next.js application.
- **caddy** – reverse proxy providing HTTPS for `factorio.pyronixgames.space`.

Deploy with:
```bash
docker compose up -d --build
```

After the stack starts, the dashboard is available at `https://factorio.pyronixgames.space`.

Map images can be generated with `npm run generate-map` (scheduled via cron in production).
