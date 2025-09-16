import { NextResponse } from 'next/server';
import { withRcon } from '@/lib/rcon';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function formatTime(ticks: number): string {
  const seconds = ticks / 60;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export async function GET() {
  try {
    const result = await withRcon(async (rcon) => {
      const version = (await rcon.send('/version')).trim();
      const uptime = (await rcon.send('/time')).trim();
      const playersRaw = await rcon.send('/players online');
      const players: { name: string; onlineTime: string }[] = [];
      const list = playersRaw.split(':')[1];
      if (list) {
        for (const name of list.split(',').map(s => s.trim()).filter(Boolean)) {
          const ticksStr = await rcon.send(`/silent-command rcon.print(game.players["${name}"].online_time)`);
          const ticks = parseInt(ticksStr.trim(), 10);
          players.push({ name, onlineTime: formatTime(ticks) });
        }
      }
      return { version, uptime, online: true, players };
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ version: '', uptime: '', online: false, players: [] }, { status: 200 });
  }
}
