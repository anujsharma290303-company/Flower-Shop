const express = require('express');
const verifyToken = require('../middleware/auth');
const { get, update } = require('../controllers/siteConfigController');
const { validateUpdateSiteConfig } = require('../validators/siteConfigValidator');
const upload = require('../middleware/upload');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.get('/', get);

// Admin protected routes
adminRouter.get('/', verifyToken, get);
adminRouter.put('/', verifyToken, upload.single('heroImage'), validateUpdateSiteConfig, update);

module.exports = {
	publicRouter,
	adminRouter,
};
