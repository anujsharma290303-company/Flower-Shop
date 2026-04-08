const express = require('express');
const verifyToken = require('../middleware/auth');
const {
	getAvailableDates,
	checkAvailability,
	getBlackoutDatesAdmin,
	createBlackoutDateAdmin,
	updateBlackoutDateAdmin,
	deleteBlackoutDateAdmin,
} = require('../controllers/deliveryController');

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.get('/available-dates', getAvailableDates);
publicRouter.get('/check', checkAvailability);

adminRouter.get('/blackout-dates', verifyToken, getBlackoutDatesAdmin);
adminRouter.post('/blackout-dates', verifyToken, createBlackoutDateAdmin);
adminRouter.patch('/blackout-dates/:id', verifyToken, updateBlackoutDateAdmin);
adminRouter.delete('/blackout-dates/:id', verifyToken, deleteBlackoutDateAdmin);

module.exports = {
	publicRouter,
	adminRouter,
};
