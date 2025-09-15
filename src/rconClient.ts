import { Rcon } from 'rcon-client';

export async function fetchFactorioStatus() {
  const host = process.env.RCON_HOST;
  const port = Number(process.env.RCON_PORT || 27015);
  const password = process.env.RCON_PASSWORD;
  if (!host || !password) {
    throw new Error('Missing RCON configuration');
  }
  const rcon = await Rcon.connect({ host, port, password });
  try {
    const version = (await rcon.send('/version')).trim();
    const uptime = (await rcon.send('/time')).trim();
    const playersRaw = await rcon.send('/players online');
    const players: string[] = [];
    const split = playersRaw.split(':')[1];
    if (split) {
      split.split(',').forEach(name => {
        const n = name.trim();
        if (n) players.push(n);
      });
    }
    return { version, uptime, players };
  } finally {
    rcon.end();
  }
}
