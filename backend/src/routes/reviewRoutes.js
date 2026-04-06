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

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.get('/', getAll);
publicRouter.post('/', validateReview, create);

// Admin routes
adminRouter.get('/', verifyToken, getAllAdmin);
adminRouter.patch('/:id/approve', verifyToken, approve);
adminRouter.patch('/:id/reject', verifyToken, reject);
adminRouter.delete('/:id', verifyToken, remove);

module.exports = {
  publicRouter,
  adminRouter,
};
