const express = require('express');
const { pay } = require('../controllers/paymentController');
const { validateMockPayment } = require('../validators/paymentValidator');

const router = express.Router();

router.post('/pay', validateMockPayment, pay);

module.exports = router;
