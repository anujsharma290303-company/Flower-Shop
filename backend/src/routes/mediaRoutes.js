const express = require('express');
const verifyToken = require('../middleware/auth');
const { getAllAdmin, approve } = require('../controllers/orderMediaController');

const router = express.Router();

router.get('/', verifyToken, getAllAdmin);
router.patch('/:id/approve', verifyToken, approve);

module.exports = router;
