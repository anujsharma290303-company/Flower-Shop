const express = require('express');
const verifyCustomerToken = require('../middleware/customerAuth');
const { earn, getBalance, getHistory } = require('../controllers/creditsController');

const router = express.Router();

router.post('/earn', verifyCustomerToken, earn);
router.get('/balance', verifyCustomerToken, getBalance);
router.get('/history', verifyCustomerToken, getHistory);

module.exports = router;
