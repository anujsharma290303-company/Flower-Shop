const express = require('express');
const {
	pay,
	authorize,
	capture,
} = require('../controllers/paymentController');
const { validateMockPayment, validateAuthorizePayment } = require('../validators/paymentValidator');

const router = express.Router();

router.post('/pay', validateMockPayment, pay);
router.post('/authorize', validateAuthorizePayment, authorize);
router.post('/:id/capture', capture);

module.exports = router;
