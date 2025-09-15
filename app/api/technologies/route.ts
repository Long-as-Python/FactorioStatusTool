import { NextResponse } from 'next/server';
import { withRcon } from '@/lib/rcon';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const techs = await withRcon(async rcon => {
      const cmd = `/silent-command local t={} for name,tech in pairs(game.forces.player.technologies) do table.insert(t,{name=name,researched=tech.researched}) end rcon.print(game.table_to_json(t))`;
      const raw = await rcon.send(cmd);
      return JSON.parse(raw.trim());
    });
    return NextResponse.json(techs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
