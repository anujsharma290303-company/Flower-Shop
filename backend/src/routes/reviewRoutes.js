const express = require('express');
const verifyToken = require('../middleware/auth');
const { validateReview } = require('../validators/reviewValidator');
const {
  getAll,
  create,
  getAllAdmin,
  approve,
  reject,
  remove,
} = require('../controllers/reviewController');

const router = express.Router();

// Public routes
router.get('/', getAll);
router.post('/', validateReview, create);

// Admin routes
router.get('/admin', verifyToken, getAllAdmin);
router.patch('/admin/:id/approve', verifyToken, approve);
router.patch('/admin/:id/reject', verifyToken, reject);
router.delete('/admin/:id', verifyToken, remove);

module.exports = router;
