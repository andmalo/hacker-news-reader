import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0';

app.use(cors());

app.get('/v0/newstories.json', async (req, res) => {
  try {
    const risposta = await axios.get(`${HN_BASE_URL}/newstories.json`);
    res.json(risposta.data);
  } catch {
    res.status(502).json({ error: 'Impossibile contattare Hacker News.' });
  }
});

app.get('/v0/item/:id.json', async (req, res) => {
  try {
    const { id } = req.params;
    const risposta = await axios.get(`${HN_BASE_URL}/item/${id}.json`);
    res.json(risposta.data);
  } catch {
    res.status(502).json({ error: 'Impossibile contattare Hacker News.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
