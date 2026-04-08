const express = require('express');
const { getAvailableDates, checkAvailability } = require('../controllers/deliveryController');

const router = express.Router();

router.get('/available-dates', getAvailableDates);
router.get('/check', checkAvailability);

module.exports = router;
