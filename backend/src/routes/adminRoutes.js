const express = require('express');
const verifyToken = require('../middleware/auth');
const {
	getDashboardStats,
	getUsers,
	getUserById,
	toggleUserActive,
	getCreditTransactionsAdmin,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard/stats', verifyToken, getDashboardStats);
router.get('/users', verifyToken, getUsers);
router.get('/users/:id', verifyToken, getUserById);
router.patch('/users/:id/toggle', verifyToken, toggleUserActive);
router.get('/credits', verifyToken, getCreditTransactionsAdmin);

module.exports = router;
