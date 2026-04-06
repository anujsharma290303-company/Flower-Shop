const express = require('express');
const { send } = require('../controllers/contactController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validateContact = [
	body('name')
		.notEmpty()
		.withMessage('Name is required')
		.isString()
		.withMessage('Name must be a string')
		.trim(),
	body('email')
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Valid email required')
		.normalizeEmail(),
	body('message')
		.notEmpty()
		.withMessage('Message is required')
		.isString()
		.withMessage('Message must be a string')
		.trim(),
	body('phone')
		.optional({ nullable: true })
		.isString()
		.withMessage('Phone must be a string')
		.trim(),
	body('subject')
		.optional({ nullable: true })
		.isString()
		.withMessage('Subject must be a string')
		.trim(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({
				message: 'Validation failed',
				errors: errors.array().map((err) => ({
					field: err.path || err.param,
					message: err.msg,
				})),
			});
		}
		return next();
	},
];

router.post('/', validateContact, send);
router.post('/send', validateContact, send);

module.exports = router;
