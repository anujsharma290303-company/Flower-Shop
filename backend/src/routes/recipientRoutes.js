const express = require('express');
const {
  getByToken,
  accept,
  reject,
} = require('../controllers/recipientController');

const router = express.Router();

router.get('/:token', getByToken);
router.post('/accept', accept);
router.post('/reject', reject);

module.exports = router;
