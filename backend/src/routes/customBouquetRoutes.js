const express = require('express');
const verifyToken = require('../middleware/auth');
const {
  create,
  getAllAdmin,
  getOne,
  remove,
} = require('../controllers/customBouquetController');
const { validateCustomBouquet } = require('../validators/customBouquetValidator');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.post('/', validateCustomBouquet, create);

// Admin routes
adminRouter.get('/', verifyToken, getAllAdmin);
adminRouter.get('/:id', verifyToken, getOne);
adminRouter.delete('/:id', verifyToken, remove);

module.exports = {
  publicRouter,
  adminRouter,
};
