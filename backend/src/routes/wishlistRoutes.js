const express = require('express');
const verifyCustomerToken = require('../middleware/customerAuth');
const { create, getMine, getByToken } = require('../controllers/wishlistController');

const router = express.Router();

router.post('/', verifyCustomerToken, create);
router.get('/me', verifyCustomerToken, getMine);
router.get('/:token', getByToken);

module.exports = router;
