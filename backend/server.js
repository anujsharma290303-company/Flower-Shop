require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');

// IMPORTANT: load all models + associations BEFORE sync
require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
  });
});

// Sync database models and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected and synchronized');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database synchronization error:', err.message);
    process.exit(1);
  });