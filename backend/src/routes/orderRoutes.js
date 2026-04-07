const express = require('express');
const verifyToken = require('../middleware/auth');
const {
  create,
  getAllAdmin,
  getOne,
  getRecipientLink,
  updateStatus,
  updatePayment,
} = require('../controllers/orderController');
const { validateOrder } = require('../validators/orderValidator');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.post('/', validateOrder, create);

// Admin routes
adminRouter.get('/', verifyToken, getAllAdmin);
adminRouter.get('/:id', verifyToken, getOne);
adminRouter.get('/:id/recipient-link', verifyToken, getRecipientLink);
adminRouter.patch('/:id/status', verifyToken, updateStatus);
adminRouter.patch('/:id/payment', verifyToken, updatePayment);

module.exports = {
  publicRouter,
  adminRouter,
};
