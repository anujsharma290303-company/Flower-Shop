const express = require('express');
const verifyCustomerToken = require('../middleware/customerAuth');
const { earn, getHistory } = require('../controllers/creditsController');

const router = express.Router();

router.post('/earn', verifyCustomerToken, earn);
router.get('/history', verifyCustomerToken, getHistory);

module.exports = router;
