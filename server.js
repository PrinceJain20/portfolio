import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Serve static frontend files (HTML, CSS, JS, Assets)
app.use(express.static(__dirname));

// Catch-all route to serve index.html for SPA feel
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server when run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Prince Jain Portfolio Server is running at http://localhost:${PORT}`);
  });
}

export default app;
