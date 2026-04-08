const { body, validationResult } = require('express-validator');

const SUBSCRIPTION_STATUS = ['active', 'paused', 'cancelled'];
const SUBSCRIPTION_FREQUENCY = ['weekly', 'biweekly', 'monthly'];

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

const createSubscriptionValidation = [
  body('frequency')
    .notEmpty()
    .withMessage('frequency is required')
    .isIn(SUBSCRIPTION_FREQUENCY)
    .withMessage(`frequency must be one of: ${SUBSCRIPTION_FREQUENCY.join(', ')}`),
  body('nextDeliveryDate')
    .notEmpty()
    .withMessage('nextDeliveryDate is required')
    .isISO8601()
    .withMessage('nextDeliveryDate must be a valid ISO date')
    .customSanitizer((value) => String(value).slice(0, 10)),
  body('startDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('startDate must be a valid ISO date')
    .customSanitizer((value) => (value ? String(value).slice(0, 10) : value)),
  body('orderId')
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value === '') return null;
      const num = Number(value);
      return Number.isNaN(num) ? value : num;
    })
    .isInt({ min: 1 })
    .withMessage('orderId must be a positive integer'),
  body('deliveryAddress')
    .optional({ nullable: true })
    .isString()
    .withMessage('deliveryAddress must be a string')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('deliveryAddress must be between 5 and 1000 characters when provided'),
  body('note')
    .optional({ nullable: true })
    .isString()
    .withMessage('note must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('note must be at most 2000 characters long'),
  handleValidation,
];

const updateSubscriptionValidation = [
  body().custom((_, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error('At least one field is required to update subscription');
    }
    return true;
  }),
  body('status')
    .optional({ nullable: true })
    .isIn(SUBSCRIPTION_STATUS)
    .withMessage(`status must be one of: ${SUBSCRIPTION_STATUS.join(', ')}`),
  body('frequency')
    .optional({ nullable: true })
    .isIn(SUBSCRIPTION_FREQUENCY)
    .withMessage(`frequency must be one of: ${SUBSCRIPTION_FREQUENCY.join(', ')}`),
  body('nextDeliveryDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('nextDeliveryDate must be a valid ISO date')
    .customSanitizer((value) => (value ? String(value).slice(0, 10) : value)),
  body('lastDeliveryDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('lastDeliveryDate must be a valid ISO date')
    .customSanitizer((value) => (value ? String(value).slice(0, 10) : value)),
  body('deliveryAddress')
    .optional({ nullable: true })
    .isString()
    .withMessage('deliveryAddress must be a string')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('deliveryAddress must be between 5 and 1000 characters when provided'),
  body('note')
    .optional({ nullable: true })
    .isString()
    .withMessage('note must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('note must be at most 2000 characters long'),
  handleValidation,
];

module.exports = {
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_FREQUENCY,
  createSubscriptionValidation,
  updateSubscriptionValidation,
};
