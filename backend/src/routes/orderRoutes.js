const express = require('express');
const verifyToken = require('../middleware/auth');
const optionalCustomerAuth = require('../middleware/optionalCustomerAuth');
const {
  create,
  getAllAdmin,
  getOne,
  getRecipientLink,
  getStatusTimeline,
  updateStatus,
  updatePayment,
} = require('../controllers/orderController');
const { validateOrder } = require('../validators/orderValidator');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.post('/', optionalCustomerAuth, validateOrder, create);

// Admin routes
adminRouter.get('/', verifyToken, getAllAdmin);
adminRouter.get('/:id', verifyToken, getOne);
adminRouter.get('/:id/recipient-link', verifyToken, getRecipientLink);
adminRouter.get('/:id/timeline', verifyToken, getStatusTimeline);
adminRouter.patch('/:id/status', verifyToken, updateStatus);
adminRouter.patch('/:id/payment', verifyToken, updatePayment);

module.exports = {
  publicRouter,
  adminRouter,
};
