const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

let urls = require('./urls.json');

app.use(express.json());

// Ping all URLs every 5 minutes
setInterval(() => {
  urls.forEach(url => {
    fetch(url).then(() => {
      console.log(`Pinged ${url}`);
    }).catch(err => {
      console.error(`Error pinging ${url}:`, err.message);
    });
  });
}, 5 * 60 * 1000);

// Add a new URL
app.post('/add', (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  if (urls.includes(url)) {
    return res.status(409).json({ error: 'URL already exists' });
  }
  urls.push(url);
  fs.writeFileSync('./urls.json', JSON.stringify(urls, null, 2));
  res.json({ success: true, added: url });
});

// View all URLs
app.get('/list', (req, res) => {
  res.json(urls);
});

app.listen(PORT, () => {
  console.log(`Uptimer running on port ${PORT}`);
});