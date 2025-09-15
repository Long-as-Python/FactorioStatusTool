import { NextRequest, NextResponse } from 'next/server';
import { withRcon } from '@/lib/rcon';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const message = data.get('message')?.toString();
  if (!message) {
    return NextResponse.json({ error: 'message required' }, { status: 400 });
  }
  await withRcon(async rcon => {
    await rcon.send(`/silent-command game.print(\"${message.replace(/"/g, '\\"')}\")`);
  });
  return NextResponse.json({ ok: true });
}
