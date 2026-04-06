const { body, validationResult } = require('express-validator');

const ORDER_STATUS = ['pending', 'confirmed', 'out for delivery', 'delivered', 'cancelled'];
const PAYMENT_STATUS = ['unpaid', 'paid', 'refunded'];
const SUBSCRIPTION_FREQUENCY = ['weekly', 'biweekly', 'monthly'];

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

const isValidPrice = (value) => {
  const str = String(value).trim();
  return /^\d+(\.\d{1,2})?$/.test(str) && Number(str) > 0;
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

const validateOrder = [
  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required')
    .isString()
    .withMessage('Customer name must be a string')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Customer name must be between 2 and 120 characters'),
  body('customerEmail')
    .notEmpty()
    .withMessage('Customer email is required')
    .isEmail()
    .withMessage('Customer email must be valid')
    .normalizeEmail(),
  body('customerPhone')
    .notEmpty()
    .withMessage('Customer phone is required')
    .isString()
    .withMessage('Customer phone must be a string')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Customer phone must be between 7 and 30 characters'),
  body('recipientName')
    .notEmpty()
    .withMessage('Recipient name is required')
    .isString()
    .withMessage('Recipient name must be a string')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Recipient name must be between 2 and 120 characters'),
  body('recipientPhone')
    .notEmpty()
    .withMessage('Recipient phone is required')
    .isString()
    .withMessage('Recipient phone must be a string')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Recipient phone must be between 7 and 30 characters'),
  body('deliveryAddress')
    .notEmpty()
    .withMessage('Delivery address is required')
    .isString()
    .withMessage('Delivery address must be a string')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Delivery address must be between 5 and 1000 characters'),
  body('message')
    .optional({ nullable: true })
    .isString()
    .withMessage('Message must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Message must be at most 2000 characters long'),
  body('status')
    .optional({ nullable: true })
    .isIn(ORDER_STATUS)
    .withMessage(`Status must be one of: ${ORDER_STATUS.join(', ')}`),
  body('paymentStatus')
    .optional({ nullable: true })
    .isIn(PAYMENT_STATUS)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUS.join(', ')}`),
  body('isSubscription')
    .optional({ nullable: true })
    .custom((value) => parseBooleanLike(value) !== undefined)
    .withMessage('isSubscription must be a boolean')
    .customSanitizer((value) => parseBooleanLike(value)),
  body('subscriptionFrequency')
    .optional({ nullable: true })
    .isIn(SUBSCRIPTION_FREQUENCY)
    .withMessage(`Subscription frequency must be one of: ${SUBSCRIPTION_FREQUENCY.join(', ')}`),
  body('isRecipientChoice')
    .optional({ nullable: true })
    .custom((value) => parseBooleanLike(value) !== undefined)
    .withMessage('isRecipientChoice must be a boolean')
    .customSanitizer((value) => parseBooleanLike(value)),
  body('subscriptionFrequency').custom((value, { req }) => {
    const subscriptionFlag = req.body.isSubscription;
    const isSubscription = subscriptionFlag === true;

    if (isSubscription && !value) {
      throw new Error('Subscription frequency is required when isSubscription is true');
    }

    if (!isSubscription && value) {
      throw new Error('Subscription frequency should only be provided when isSubscription is true');
    }

    return true;
  }),
  handleValidation,
];

const validateUpdateOrder = [
  body().custom((_, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error('At least one field is required to update order');
    }

    return true;
  }),
  body('customerName')
    .optional({ nullable: true })
    .isString()
    .withMessage('Customer name must be a string')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Customer name must be between 2 and 120 characters'),
  body('customerEmail')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Customer email must be valid')
    .normalizeEmail(),
  body('customerPhone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Customer phone must be a string')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Customer phone must be between 7 and 30 characters'),
  body('recipientName')
    .optional({ nullable: true })
    .isString()
    .withMessage('Recipient name must be a string')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Recipient name must be between 2 and 120 characters'),
  body('recipientPhone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Recipient phone must be a string')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Recipient phone must be between 7 and 30 characters'),
  body('deliveryAddress')
    .optional({ nullable: true })
    .isString()
    .withMessage('Delivery address must be a string')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Delivery address must be between 5 and 1000 characters'),
  body('message')
    .optional({ nullable: true })
    .isString()
    .withMessage('Message must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Message must be at most 2000 characters long'),
  body('totalPrice')
    .optional({ nullable: true })
    .customSanitizer((value) => (typeof value === 'string' ? value.trim() : value))
    .custom((value) => isValidPrice(value))
    .withMessage('Total price must be a valid positive decimal with up to 2 places')
    .toFloat(),
  body('status')
    .optional({ nullable: true })
    .isIn(ORDER_STATUS)
    .withMessage(`Status must be one of: ${ORDER_STATUS.join(', ')}`),
  body('paymentStatus')
    .optional({ nullable: true })
    .isIn(PAYMENT_STATUS)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUS.join(', ')}`),
  body('isSubscription')
    .optional({ nullable: true })
    .custom((value) => parseBooleanLike(value) !== undefined)
    .withMessage('isSubscription must be a boolean')
    .customSanitizer((value) => parseBooleanLike(value)),
  body('subscriptionFrequency')
    .optional({ nullable: true })
    .isIn(SUBSCRIPTION_FREQUENCY)
    .withMessage(`Subscription frequency must be one of: ${SUBSCRIPTION_FREQUENCY.join(', ')}`),
  body('isRecipientChoice')
    .optional({ nullable: true })
    .custom((value) => parseBooleanLike(value) !== undefined)
    .withMessage('isRecipientChoice must be a boolean')
    .customSanitizer((value) => parseBooleanLike(value)),
  body('subscriptionFrequency').custom((value, { req }) => {
    const subscriptionFlag = req.body.isSubscription;

    if (subscriptionFlag === true && !value) {
      throw new Error('Subscription frequency is required when isSubscription is true');
    }

    if (subscriptionFlag === false && value) {
      throw new Error('Subscription frequency should only be provided when isSubscription is true');
    }

    return true;
  }),
  handleValidation,
];

module.exports = {
  validateOrder,
  validateUpdateOrder,
  handleValidation,
};
