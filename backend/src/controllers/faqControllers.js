const { Op } = require('sequelize');
const { FAQ } = require('../models');

const handleControllerError = (res, error, defaultCode = 500) => {
	console.error('[FAQController Error]', error);
	const status = error.statusCode || defaultCode;
	const message = error.message || 'Internal server error';

	return res.status(status).json({ success: false, message });
};

const getAll = async (req, res) => {
	try {
		const { isActive } = req.query;
		const where = {};

		if (isActive !== undefined) {
			where.isActive = isActive === 'true' || isActive === '1';
		}

		const faqs = await FAQ.findAll({
			where,
			order: [
				['displayOrder', 'ASC'],
				['createdAt', 'ASC'],
			],
		});

		return res.json({ success: true, data: faqs });
	} catch (error) {
		return handleControllerError(res, error);
	}
};

const getOne = async (req, res) => {
	try {
		const { id } = req.params;
		const faqId = Number(id);

		if (!Number.isInteger(faqId) || faqId <= 0) {
			return res.status(400).json({ success: false, message: 'FAQ id must be a positive integer' });
		}

		const faq = await FAQ.findByPk(faqId);

		if (!faq) {
			return res.status(404).json({ success: false, message: 'FAQ not found' });
		}

		return res.json({ success: true, data: faq });
	} catch (error) {
		return handleControllerError(res, error);
	}
};

const create = async (req, res) => {
	try {
		const { question, answer, displayOrder, isActive } = req.body;

		const faq = await FAQ.create({
			question,
			answer,
			displayOrder: displayOrder !== undefined ? displayOrder : 0,
			isActive: isActive !== undefined ? isActive : true,
		});

		return res.status(201).json({
			success: true,
			message: 'FAQ created successfully',
			data: faq,
		});
	} catch (error) {
		return handleControllerError(res, error);
	}
};

const update = async (req, res) => {
	try {
		const { id } = req.params;
		const faqId = Number(id);

		if (!Number.isInteger(faqId) || faqId <= 0) {
			return res.status(400).json({ success: false, message: 'FAQ id must be a positive integer' });
		}

		const faq = await FAQ.findByPk(faqId);

		if (!faq) {
			return res.status(404).json({ success: false, message: 'FAQ not found' });
		}

		const updates = {
			...(req.body.question !== undefined && { question: req.body.question }),
			...(req.body.answer !== undefined && { answer: req.body.answer }),
			...(req.body.displayOrder !== undefined && { displayOrder: req.body.displayOrder }),
			...(req.body.isActive !== undefined && { isActive: req.body.isActive }),
		};

		await faq.update(updates);

		return res.json({
			success: true,
			message: 'FAQ updated successfully',
			data: faq,
		});
	} catch (error) {
		return handleControllerError(res, error);
	}
};

const remove = async (req, res) => {
	try {
		const { id } = req.params;
		const faqId = Number(id);

		if (!Number.isInteger(faqId) || faqId <= 0) {
			return res.status(400).json({ success: false, message: 'FAQ id must be a positive integer' });
		}

		const faq = await FAQ.findByPk(faqId);

		if (!faq) {
			return res.status(404).json({ success: false, message: 'FAQ not found' });
		}

		await faq.destroy();

		return res.json({
			success: true,
			message: 'FAQ deleted successfully',
			data: { id: faqId },
		});
	} catch (error) {
		return handleControllerError(res, error);
	}
};

const toggleActive = async (req, res) => {
	try {
		const { id } = req.params;
		const faqId = Number(id);

		if (!Number.isInteger(faqId) || faqId <= 0) {
			return res.status(400).json({ success: false, message: 'FAQ id must be a positive integer' });
		}

		const faq = await FAQ.findByPk(faqId);

		if (!faq) {
			return res.status(404).json({ success: false, message: 'FAQ not found' });
		}

		const newActiveState = !faq.isActive;
		await faq.update({ isActive: newActiveState });

		return res.json({
			success: true,
			message: `FAQ ${newActiveState ? 'activated' : 'deactivated'} successfully`,
			data: { id: faqId, isActive: newActiveState },
		});
	} catch (error) {
		return handleControllerError(res, error);
	}
};

module.exports = {
	getAll,
	getOne,
	create,
	update,
	remove,
	toggleActive,
};
