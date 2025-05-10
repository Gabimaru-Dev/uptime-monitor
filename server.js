const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

let monitoredSites = [];

app.post('/add', async (req, res) => {
  const { url } = req.body;
  if (!url || monitoredSites.includes(url)) return res.status(400).send('Invalid or duplicate URL');
  monitoredSites.push(url);
  res.status(200).send('Added');
});

app.get('/status', async (req, res) => {
  const statuses = await Promise.all(monitoredSites.map(async (url) => {
    try {
      const ping = await fetch(url, { method: 'GET', timeout: 5000 });
      return { url, status: ping.ok ? 'up' : 'down' };
    } catch {
      return { url, status: 'down' };
    }
  }));
  res.json(statuses);
});

app.listen(PORT, () => console.log(`Uptimer running on http://localhost:${PORT}`));