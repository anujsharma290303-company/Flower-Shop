const express = require('express');
const { validateCategory, validateUpdateCategory } = require('../validators/categoryValidator');
const {
  getAll,
  getOne,
  getBySlug,
  create,
  update,
  remove,
  toggleActive,
} = require('../controllers/categoryController');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.get('/', getAll);
publicRouter.get('/slug/:slug', getBySlug);
publicRouter.get('/:id', getOne);

// Admin routes (protected with JWT token)
adminRouter.post('/', verifyToken, upload.single('image'), validateCategory, create);
adminRouter.put('/:id', verifyToken, upload.single('image'), validateUpdateCategory, update);
adminRouter.delete('/:id', verifyToken, remove);
adminRouter.patch('/:id/toggle', verifyToken, toggleActive);

module.exports = { publicRouter, adminRouter };
