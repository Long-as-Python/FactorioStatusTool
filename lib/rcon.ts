import { Rcon } from 'rcon-client';

export async function withRcon<T>(fn: (rcon: Rcon) => Promise<T>): Promise<T> {
  const host = process.env.RCON_HOST;
  const port = Number(process.env.RCON_PORT || 27015);
  const password = process.env.RCON_PASSWORD;
  if (!host || !password) {
    throw new Error('Missing RCON configuration');
  }
  const rcon = await Rcon.connect({ host, port, password });
  try {
    return await fn(rcon);
  } finally {
    rcon.end();
  }
}
