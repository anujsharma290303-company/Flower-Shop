const express = require('express');
const { getAvailableDates } = require('../controllers/deliveryController');

const router = express.Router();

router.get('/available-dates', getAvailableDates);

module.exports = router;
