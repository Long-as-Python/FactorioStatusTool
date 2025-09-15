'use client';
import { useEffect, useState } from 'react';

type Status = {
  version: string;
  uptime: string;
  online: boolean;
  players: { name: string; onlineTime: string }[];
};

type Technology = { name: string; researched: boolean };

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [techs, setTechs] = useState<Technology[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('/api/status');
      if (res.ok) setStatus(await res.json());
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const evt = new EventSource('/api/chat/stream');
    evt.onmessage = (e) => setChat((c) => [...c, e.data]);
    return () => evt.close();
  }, []);

  useEffect(() => {
    const fetchTechs = async () => {
      const res = await fetch('/api/technologies');
      if (res.ok) setTechs(await res.json());
    };
    fetchTechs();
  }, []);

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Factorio Server Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        {status ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${status.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{status.online ? 'Online' : 'Offline'}</span>
            </div>
            <div>Version: {status.version}</div>
            <div>Uptime: {status.uptime}</div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Players</h2>
        <ul className="list-disc pl-5">
          {status?.players.map((p) => (
            <li key={p.name}>{p.name} – {p.onlineTime}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Chat</h2>
        <div className="border bg-white h-64 overflow-y-auto p-2">
          {chat.map((line, i) => <div key={i}>{line}</div>)}
        </div>
        <form action="/api/chat/send" method="post" className="mt-2 flex gap-2">
          <input name="message" className="flex-1 border p-2" placeholder="Message" />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Map</h2>
        <img src="/map/latest.png" alt="Map preview" className="border" />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Technologies</h2>
        <table className="min-w-full text-sm bg-white">
          <thead>
            <tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Status</th></tr>
          </thead>
          <tbody>
            {techs.map(t => (
              <tr key={t.name} className="border-b"><td className="p-2">{t.name}</td><td className="p-2">{t.researched ? 'researched' : 'in progress'}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
