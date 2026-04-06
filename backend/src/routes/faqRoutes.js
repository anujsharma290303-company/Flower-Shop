const express = require('express');
const verifyToken = require('../middleware/auth');
const {
	validateFaq,
	validateUpdateFaq,
} = require('../validators/faqValidator');
const {
	getAll,
	getOne,
	create,
	update,
	remove,
	toggleActive,
} = require('../controllers/faqControllers');

const publicRouter = express.Router();
const adminRouter = express.Router();

adminRouter.post('/', verifyToken, validateFaq, create);
adminRouter.put('/:id', verifyToken, validateUpdateFaq, update);
adminRouter.delete('/:id', verifyToken, remove);
adminRouter.patch('/:id/toggle', verifyToken, toggleActive);

publicRouter.get('/', getAll);
publicRouter.get('/:id', getOne);

module.exports = {
	publicRouter,
	adminRouter,
};
