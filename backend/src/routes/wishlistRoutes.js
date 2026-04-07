const express = require('express');
const { create, getByToken } = require('../controllers/wishlistController');
const verifyCustomerToken = require('../middleware/customerAuth');

const router = express.Router();

router.get('/:token', getByToken);
router.post('/', verifyCustomerToken, create);

module.exports = router;
