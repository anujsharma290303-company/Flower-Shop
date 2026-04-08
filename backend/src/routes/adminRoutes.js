const express = require('express');
const verifyToken = require('../middleware/auth');
const {
	getDashboardStats,
	getUsers,
	getUserById,
	toggleUserActive,
	getCreditTransactionsAdmin,
} = require('../controllers/adminController');
const { expireRecipientTokensAdmin } = require('../controllers/recipientController');

const router = express.Router();

router.get('/dashboard/stats', verifyToken, getDashboardStats);
router.get('/users', verifyToken, getUsers);
router.get('/users/:id', verifyToken, getUserById);
router.patch('/users/:id/toggle', verifyToken, toggleUserActive);
router.get('/credits', verifyToken, getCreditTransactionsAdmin);
router.post('/orders/expire-recipient-tokens', verifyToken, expireRecipientTokensAdmin);

module.exports = router;
