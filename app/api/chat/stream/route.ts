import { NextRequest } from 'next/server';
import { watch, statSync, openSync, readSync, closeSync, existsSync, writeFileSync, mkdirSync } from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const logPath = process.env.CHAT_LOG_PATH || './chat.log';
  let offset = 0;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const dir = logPath.substring(0, logPath.lastIndexOf('/'));
      if (!existsSync(dir)) {
        try { mkdirSync(dir, { recursive: true }); } catch { /* ignore */ }
      }
      if (!existsSync(logPath)) {
        try { writeFileSync(logPath, ''); } catch { /* ignore */ }
      }

      const sendLines = () => {
        try {
          const stat = statSync(logPath);
          if (stat.size > offset) {
            const fd = openSync(logPath, 'r');
            const buf = Buffer.alloc(stat.size - offset);
            readSync(fd, buf, 0, stat.size - offset, offset);
            closeSync(fd);
            offset = stat.size;
            const lines = buf.toString().split(/\r?\n/).filter(Boolean);
            for (const line of lines) {
              controller.enqueue(encoder.encode(`data: ${line}\n\n`));
            }
          }
        } catch (err) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${(err as Error).message}\n\n`));
        }
      };
      sendLines();
      const watcher = watch(logPath, sendLines);
      return () => watcher.close();
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
