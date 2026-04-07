const { NotificationLog, sequelize } = require('../models');

const handleError = (res, error, context) => {
	console.error(`[NotificationController] ${context}:`, error);
	const status = error.statusCode || 500;
	return res.status(status).json({ success: false, message: error.message || 'Internal server error' });
};

const getAll = async (req, res) => {
	try {
		const { type, source, limit = 50, offset = 0 } = req.query;
		const where = {};

		if (type) where.type = type;
		if (source) where.source = source;

		const { count, rows } = await NotificationLog.findAndCountAll({
			where,
			order: [['createdAt', 'DESC']],
			limit: Number(limit),
			offset: Number(offset),
		});

		return res.json({
			success: true,
			data: {
				total: count,
				notifications: rows,
				pagination: {
					limit: Number(limit),
					offset: Number(offset),
					hasMore: offset + rows.length < count,
				},
			},
		});
	} catch (error) {
		return handleError(res, error, 'Get notifications');
	}
};

const getById = async (req, res) => {
	try {
		const { id } = req.params;
		const notification = await NotificationLog.findByPk(id);

		if (!notification) {
			return res.status(404).json({ success: false, message: 'Notification not found' });
		}

		return res.json({
			success: true,
			data: notification,
		});
	} catch (error) {
		return handleError(res, error, 'Get notification');
	}
};

const getStats = async (req, res) => {
	try {
		const stats = await NotificationLog.findAll({
			attributes: [
				['type', 'notificationType'],
				[sequelize.fn('COUNT', sequelize.col('id')), 'count'],
			],
			group: ['type'],
			raw: true,
		});

		const bySource = await NotificationLog.findAll({
			attributes: [
				['source', 'source'],
				[sequelize.fn('COUNT', sequelize.col('id')), 'count'],
			],
			group: ['source'],
			raw: true,
		});

		return res.json({
			success: true,
			data: {
				byType: stats,
				bySource,
				total: stats.reduce((sum, s) => sum + Number(s.count), 0),
			},
		});
	} catch (error) {
		return handleError(res, error, 'Get stats');
	}
};

module.exports = {
	getAll,
	getById,
	getStats,
};
