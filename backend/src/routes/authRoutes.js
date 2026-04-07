const express = require('express');
const { register, login, me } = require('../controllers/customerAuthController');
const verifyCustomerToken = require('../middleware/customerAuth');
const { registerValidationRules, loginValidationRules } = require('../validators/authValidator');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.post('/register', registerValidationRules(), validate, register);
router.post('/login', loginValidationRules(), validate, login);
router.get('/me', verifyCustomerToken, me);

module.exports = router;
