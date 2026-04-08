const express = require('express');
const {
	pay,
	authorize,
	capture,
	voidPayment,
} = require('../controllers/paymentController');
const { validateMockPayment, validateAuthorizePayment } = require('../validators/paymentValidator');

const router = express.Router();

router.post('/pay', validateMockPayment, pay);
router.post('/authorize', validateAuthorizePayment, authorize);
router.post('/:id/capture', capture);
router.post('/:id/void', voidPayment);

module.exports = router;
