const express = require('express');
const verifyToken = require('../middleware/auth');
const verifyCustomerToken = require('../middleware/customerAuth');
const {
  create,
  getMine,
  getOneMine,
  updateMine,
  getAllAdmin,
  getOneAdmin,
  updateAdmin,
  removeAdmin,
} = require('../controllers/subscriptionController');
const {
  createSubscriptionValidation,
  updateSubscriptionValidation,
} = require('../validators/subscriptionValidator');

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.post('/', verifyCustomerToken, createSubscriptionValidation, create);
publicRouter.get('/', verifyCustomerToken, getMine);
publicRouter.get('/:id', verifyCustomerToken, getOneMine);
publicRouter.patch('/:id', verifyCustomerToken, updateSubscriptionValidation, updateMine);

adminRouter.get('/', verifyToken, getAllAdmin);
adminRouter.get('/:id', verifyToken, getOneAdmin);
adminRouter.patch('/:id', verifyToken, updateSubscriptionValidation, updateAdmin);
adminRouter.delete('/:id', verifyToken, removeAdmin);

module.exports = {
  publicRouter,
  adminRouter,
};
