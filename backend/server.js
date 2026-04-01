require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected...');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});