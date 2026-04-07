const express = require('express');
const { getAll, getById, getStats } = require('../controllers/notificationController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Admin only - notification stats
router.get('/stats', verifyToken, getStats);

// Admin only - all notifications
router.get('/', verifyToken, getAll);

// Admin only - get by id
router.get('/:id', verifyToken, getById);

module.exports = router;
