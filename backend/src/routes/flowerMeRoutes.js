const express = require('express');
const verifyCustomerToken = require('../middleware/customerAuth');
const { upsertMine, getMine, getBySlug } = require('../controllers/flowerMeController');

const router = express.Router();

router.get('/profile/:slug', getBySlug);
router.get('/profile', verifyCustomerToken, getMine);
router.put('/profile', verifyCustomerToken, upsertMine);

module.exports = router;
