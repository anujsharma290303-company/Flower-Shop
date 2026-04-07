const express = require('express');
const verifyToken = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard/stats', verifyToken, getDashboardStats);

module.exports = router;
