import express from 'express';
import { fetchFactorioStatus } from './rconClient';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get('/api/status', async (_req, res) => {
  try {
    const status = await fetchFactorioStatus();
    res.json(status);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
