// app.js
const express = require('express');
const scrapeRoutes = require('./routes/scrapeRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/scrape', scrapeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});