const express = require('express');
const {
  getByToken,
  accept,
  reject,
  updatePrivacy,
} = require('../controllers/recipientController');

const router = express.Router();

router.get('/:token', getByToken);
router.post('/accept', accept);
router.post('/reject', reject);
router.patch('/:token/privacy', updatePrivacy);

module.exports = router;
