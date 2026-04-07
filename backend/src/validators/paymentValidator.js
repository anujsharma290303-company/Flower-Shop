const { body, validationResult } = require('express-validator');

const PAYMENT_METHODS = ['mock-card', 'mock-upi'];

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
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }

  return next();
};

const validateMockPayment = [
  body('orderId')
    .notEmpty()
    .withMessage('orderId is required')
    .customSanitizer((value) => {
      const numberValue = Number(value);
      return Number.isNaN(numberValue) ? value : numberValue;
    })
    .isInt({ min: 1 })
    .withMessage('orderId must be a positive integer'),
  body('method')
    .notEmpty()
    .withMessage('method is required')
    .isIn(PAYMENT_METHODS)
    .withMessage(`method must be one of: ${PAYMENT_METHODS.join(', ')}`),
  body('simulateSuccess')
    .optional({ nullable: true })
    .custom((value) => parseBooleanLike(value) !== undefined)
    .withMessage('simulateSuccess must be a boolean')
    .customSanitizer((value) => parseBooleanLike(value)),
  body('processingDelayMs')
    .optional({ nullable: true })
    .customSanitizer((value) => {
      const numberValue = Number(value);
      return Number.isNaN(numberValue) ? value : numberValue;
    })
    .isInt({ min: 0, max: 10000 })
    .withMessage('processingDelayMs must be an integer between 0 and 10000'),
  handleValidation,
];

module.exports = {
  validateMockPayment,
  handleValidation,
};
