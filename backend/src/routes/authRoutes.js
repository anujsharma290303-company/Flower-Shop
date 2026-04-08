const express = require('express');
const { register, login, me, updateMe, changePassword } = require('../controllers/customerAuthController');
const verifyCustomerToken = require('../middleware/customerAuth');
const {
	registerValidationRules,
	loginValidationRules,
	updateProfileValidationRules,
	changePasswordValidationRules,
} = require('../validators/authValidator');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.post('/register', registerValidationRules(), validate, register);
router.post('/login', loginValidationRules(), validate, login);
router.get('/me', verifyCustomerToken, me);
router.put('/me', verifyCustomerToken, updateProfileValidationRules(), validate, updateMe);
router.put('/me/password', verifyCustomerToken, changePasswordValidationRules(), validate, changePassword);

module.exports = router;
