const express = require('express');
const verifyToken = require('../middleware/auth');
const { getAllAdmin, getOneAdmin } = require('../controllers/paymentController');

const router = express.Router();

router.get('/', verifyToken, getAllAdmin);
router.get('/:id', verifyToken, getOneAdmin);

module.exports = router;
