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

const router = express.Router();

router.post('/admin', verifyToken, validateFaq, create);
router.put('/admin/:id', verifyToken, validateUpdateFaq, update);
router.delete('/admin/:id', verifyToken, remove);
router.patch('/admin/:id/toggle', verifyToken, toggleActive);

router.get('/', getAll);
router.get('/:id', getOne);

module.exports = router;
