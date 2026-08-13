const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8501;

const distPath = path.join(__dirname, 'dist');

// Serve static assets from dist
app.use(express.static(distPath));

// Single Page Application (SPA) catch-all route -> Always serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Kiosk Screen UI running on http://localhost:${PORT}`);
});
