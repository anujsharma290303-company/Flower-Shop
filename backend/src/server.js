require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const { publicRouter, adminRouter } = require('./routes/productRoutes');
const { publicRouter: categoryPublicRouter, adminRouter: categoryAdminRouter } = require('./routes/categoryRoutes');

// IMPORTANT: load all models + associations BEFORE sync
require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_SYNC_ALTER = process.env.DB_SYNC_ALTER === 'true';
const DB_SYNC_FORCE = process.env.DB_SYNC_FORCE === 'true';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', publicRouter);
app.use('/api/admin/products', adminRouter);
app.use('/api/categories', categoryPublicRouter);
app.use('/api/admin/categories', categoryAdminRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({
      alter: DB_SYNC_ALTER,
      force: DB_SYNC_FORCE,
    });
    console.log('✅ Database synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
};

startServer();