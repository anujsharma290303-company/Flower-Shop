const express = require('express');
const {
	getAll,
	getOne,
	getBySlug,
	getProductByItemCode,
	create,
	update,
	remove,
	toggle,
} = require('../controllers/productController');
const { validateProduct, validateUpdateProduct } = require('../validators/productValidator');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes (no authentication required)
publicRouter.get('/', getAll);
publicRouter.get('/slug/:slug', getBySlug);
publicRouter.get('/item/:itemCode', getProductByItemCode);
publicRouter.get('/:id', getOne);

// Protected admin routes (authentication required)
adminRouter.post('/', verifyToken, upload.array('images', 5), validateProduct, create);
adminRouter.put('/:id', verifyToken, upload.array('images', 5), validateUpdateProduct, update);
adminRouter.delete('/:id', verifyToken, remove);
adminRouter.patch('/:id/toggle', verifyToken, toggle);

module.exports = {
	publicRouter,
	adminRouter,
};
