const express = require('express');
const verifyToken = require('../middleware/auth');
const {
	getAllAdmin,
	getOneAdmin,
	capture,
	voidPayment,
	refund,
} = require('../controllers/paymentController');

const router = express.Router();

router.get('/', verifyToken, getAllAdmin);
router.get('/:id', verifyToken, getOneAdmin);
router.post('/:id/capture', verifyToken, capture);
router.post('/:id/void', verifyToken, voidPayment);
router.post('/:id/refund', verifyToken, refund);

module.exports = router;
