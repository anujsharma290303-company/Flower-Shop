const { body, validationResult } = require('express-validator');

const parseBooleanLike = (value) => {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeof value === 'number') {
		if (value === 1) return true;
		if (value === 0) return false;
	}

	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		if (normalized === 'true' || normalized === '1') return true;
		if (normalized === 'false' || normalized === '0') return false;
	}

	return undefined;
};

const handleValidation = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	return next();
};

const validateReview = [
	body('name')
		.notEmpty()
		.withMessage('Name is required')
		.isString()
		.withMessage('Name must be a string')
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage('Name must be between 2 and 100 characters long'),
	body('location')
		.optional({ nullable: true })
		.isString()
		.withMessage('Location must be a string')
		.trim()
		.isLength({ max: 255 })
		.withMessage('Location must be at most 255 characters long'),
	body('message')
		.notEmpty()
		.withMessage('Message is required')
		.isString()
		.withMessage('Message must be a string')
		.trim()
		.isLength({ min: 5, max: 2000 })
		.withMessage('Message must be between 5 and 2000 characters long'),
	body('rating')
		.notEmpty()
		.withMessage('Rating is required')
		.customSanitizer((value) => {
			const numberValue = Number(value);
			return Number.isNaN(numberValue) ? value : numberValue;
		})
		.isInt({ min: 1, max: 5 })
		.withMessage('Rating must be an integer between 1 and 5'),
	body('isApproved')
		.optional({ nullable: true })
		.customSanitizer((value) => parseBooleanLike(value))
		.isBoolean()
		.withMessage('isApproved must be a boolean'),
	body('orderId')
		.notEmpty()
		.withMessage('Order ID is required')
		.customSanitizer((value) => {
			const numberValue = Number(value);
			return Number.isNaN(numberValue) ? value : numberValue;
		})
		.isInt({ min: 1 })
		.withMessage('Order ID must be a positive integer'),
	handleValidation,
];

const validateUpdateReview = [
	(req, res, next) => {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ errors: [{ message: 'At least one field is required to update review' }] });
		}

		return next();
	},
	body('name')
		.optional({ nullable: true })
		.isString()
		.withMessage('Name must be a string')
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage('Name must be between 2 and 100 characters long'),
	body('location')
		.optional({ nullable: true })
		.isString()
		.withMessage('Location must be a string')
		.trim()
		.isLength({ max: 255 })
		.withMessage('Location must be at most 255 characters long'),
	body('message')
		.optional({ nullable: true })
		.isString()
		.withMessage('Message must be a string')
		.trim()
		.isLength({ min: 5, max: 2000 })
		.withMessage('Message must be between 5 and 2000 characters long'),
	body('rating')
		.optional({ nullable: true })
		.customSanitizer((value) => {
			const numberValue = Number(value);
			return Number.isNaN(numberValue) ? value : numberValue;
		})
		.isInt({ min: 1, max: 5 })
		.withMessage('Rating must be an integer between 1 and 5'),
	body('isApproved')
		.optional({ nullable: true })
		.customSanitizer((value) => parseBooleanLike(value))
		.isBoolean()
		.withMessage('isApproved must be a boolean'),
	body('orderId')
		.optional({ nullable: true })
		.customSanitizer((value) => {
			const numberValue = Number(value);
			return Number.isNaN(numberValue) ? value : numberValue;
		})
		.isInt({ min: 1 })
		.withMessage('Order ID must be a positive integer'),
	handleValidation,
];

module.exports = {
	validateReview,
	validateUpdateReview,
	handleValidation,
};
