const express = require('express');
const verifyToken = require('../middleware/auth');
const verifyCustomerToken = require('../middleware/customerAuth');
const optionalCustomerAuth = require('../middleware/optionalCustomerAuth');
const upload = require('../middleware/upload');
const {
  create,
  getTrack,
  getAllAdmin,
  getOne,
  updateOrder,
  getRecipientLink,
  getStatusTimeline,
  updateStatus,
  updatePayment,
} = require('../controllers/orderController');
const { create: createMedia } = require('../controllers/orderMediaController');
const { validateOrder } = require('../validators/orderValidator');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.get('/track', getTrack);
publicRouter.post('/', verifyCustomerToken, validateOrder, create);
publicRouter.post('/:id/media', optionalCustomerAuth, upload.mediaUpload.single('media'), createMedia);

// Admin routes
adminRouter.get('/', verifyToken, getAllAdmin);
adminRouter.get('/:id', verifyToken, getOne);
adminRouter.put('/:id', verifyToken, updateOrder);
adminRouter.get('/:id/recipient-link', verifyToken, getRecipientLink);
adminRouter.get('/:id/timeline', verifyToken, getStatusTimeline);
adminRouter.patch('/:id/status', verifyToken, updateStatus);
adminRouter.patch('/:id/payment', verifyToken, updatePayment);

module.exports = {
  publicRouter,
  adminRouter,
};
