const { Op } = require('sequelize');
const slugify = require('slugify');
const { Product, Category } = require('../models');

const parseBoolean = (value) => {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();

		if (normalized === 'true' || normalized === '1') {
			return true;
		}

		if (normalized === 'false' || normalized === '0') {
			return false;
		}
	}

	return undefined;
};

const handleControllerError = (res, error, context) => {
	console.error(`${context}:`, error.message);

	if (error.name === 'SequelizeUniqueConstraintError') {
		return res.status(409).json({ success: false, message: 'Duplicate value for slug or itemCode' });
	}

	return res.status(500).json({ success: false, message: 'Internal server error' });
};

const buildUniqueSlug = async (name, excludeId) => {
	const baseSlug = slugify(name, { lower: true, strict: true });
	let candidate = baseSlug;
	let counter = 1;

	while (true) {
		const where = { slug: candidate };

		if (excludeId) {
			where.id = { [Op.ne]: excludeId };
		}

		const existing = await Product.findOne({ where, attributes: ['id'] });

		if (!existing) {
			return candidate;
		}

		candidate = `${baseSlug}-${counter}`;
		counter += 1;
	}
};

const parseBooleanFields = (source, fields) => {
	const result = {};

	for (const field of fields) {
		if (source[field] !== undefined) {
			const parsed = parseBoolean(source[field]);

			if (parsed === undefined) {
				return {
					error: `${field} must be true or false`,
				};
			}

			result[field] = parsed;
		}
	}

	return { values: result };
};

const getAll = async (req, res) => {
	try {
		const { categoryId, category, isBestSeller, inStock, search, page, limit } = req.query;
		const where = {};

		const parsedPage = Number(page ?? 1);
		const parsedLimit = Number(limit ?? 10);

		if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
			return res.status(400).json({ success: false, message: 'page must be a positive integer' });
		}

		if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
			return res.status(400).json({ success: false, message: 'limit must be a positive integer' });
		}

		const offset = (parsedPage - 1) * parsedLimit;

		// Product model uses categoryId; support both categoryId and category query names.
		const rawCategory = categoryId ?? category;

		if (rawCategory !== undefined) {
			const parsedCategoryId = Number(rawCategory);

			if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
				return res.status(400).json({ success: false, message: 'categoryId must be a positive integer' });
			}

			where.categoryId = parsedCategoryId;
		}

		if (isBestSeller !== undefined) {
			const parsedBestSeller = parseBoolean(isBestSeller);

			if (parsedBestSeller === undefined) {
				return res.status(400).json({ success: false, message: 'isBestSeller must be true or false' });
			}

			where.isBestSeller = parsedBestSeller;
		}

		if (inStock !== undefined) {
			const parsedInStock = parseBoolean(inStock);

			if (parsedInStock === undefined) {
				return res.status(400).json({ success: false, message: 'inStock must be true or false' });
			}

			where.inStock = parsedInStock;
		}

		if (search !== undefined && String(search).trim() !== '') {
			where.name = {
				[Op.iLike]: `%${String(search).trim()}%`,
			};
		}

		const { count, rows } = await Product.findAndCountAll({
			where,
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
				},
			],
			limit: parsedLimit,
			offset,
			order: [['createdAt', 'DESC']],
		});

		return res.status(200).json({
			success: true,
			data: {
				totalItems: count,
				page: parsedPage,
				limit: parsedLimit,
				totalPages: Math.ceil(count / parsedLimit),
				count: rows.length,
				products: rows,
			},
		});
	} catch (error) {
		console.error('Get products error:', error.message);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getOne = async (req, res) => {
	try {
		const { id } = req.params;
		const productId = Number(id);

		if (!Number.isInteger(productId) || productId <= 0) {
			return res.status(400).json({ success: false, message: 'Product id must be a positive integer' });
		}

		const product = await Product.findByPk(productId, {
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
				},
			],
		});

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		return res.status(200).json({ success: true, data: product });
	} catch (error) {
		console.error('Get product error:', error.message);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getBySlug = async (req, res) => {
	try {
		const { slug } = req.params;

		if (!slug || !String(slug).trim()) {
			return res.status(400).json({ success: false, message: 'Slug is required' });
		}

		const product = await Product.findOne({
			where: { slug: String(slug).trim() },
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
				},
			],
		});

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		return res.status(200).json({ success: true, data: product });
	} catch (error) {
		return handleControllerError(res, error, 'Get product by slug error');
	}
};

const getProductByItemCode = async (req, res) => {
	try {
		const product = await Product.findOne({
			where: { itemCode: req.params.itemCode },
			include: [{ model: Category, as: 'category' }],
		});

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		return res.json({ success: true, data: product });
	} catch (error) {
		return handleControllerError(res, error, 'Get product by itemCode error');
	}
};

const create = async (req, res) => {
	try {
		const { name, price, categoryId, itemCode, description, size } = req.body;
		const booleanFields = ['isBestSeller', 'inStock', 'subscriptionAvailable'];
		const { error, values: boolValues } = parseBooleanFields(req.body, booleanFields);

		if (error) {
			return res.status(400).json({ success: false, message: error });
		}

		const categoryExists = await Category.findByPk(categoryId);

		if (!categoryExists) {
			return res.status(404).json({ success: false, message: 'Category not found' });
		}

		const imagePaths = Array.isArray(req.files) ? req.files.map((file) => file.path) : [];
		const slug = await buildUniqueSlug(name);

		const created = await Product.create({
			name,
			slug,
			itemCode,
			price,
			description,
			size,
			categoryId,
			image: imagePaths,
			...boolValues,
		});

		const product = await Product.findByPk(created.id, {
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
				},
			],
		});

		return res.status(201).json({ success: true, message: 'Product created', data: product });
	} catch (error) {
		return handleControllerError(res, error, 'Create product error');
	}
};

const update = async (req, res) => {
	try {
		const { id } = req.params;
		const productId = Number(id);

		if (!Number.isInteger(productId) || productId <= 0) {
			return res.status(400).json({ success: false, message: 'Product id must be a positive integer' });
		}

		const product = await Product.findByPk(productId);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		const updateData = {};
		const editableFields = ['name', 'itemCode', 'price', 'description', 'size', 'categoryId'];

		for (const field of editableFields) {
			if (req.body[field] !== undefined) {
				updateData[field] = req.body[field];
			}
		}

		if (updateData.categoryId !== undefined) {
			const categoryExists = await Category.findByPk(updateData.categoryId);

			if (!categoryExists) {
				return res.status(404).json({ success: false, message: 'Category not found' });
			}
		}

		const booleanFields = ['isBestSeller', 'inStock', 'subscriptionAvailable'];
		const { error, values: boolValues } = parseBooleanFields(req.body, booleanFields);

		if (error) {
			return res.status(400).json({ success: false, message: error });
		}

		Object.assign(updateData, boolValues);

		if (updateData.name !== undefined && String(updateData.name).trim() !== '') {
			updateData.slug = await buildUniqueSlug(updateData.name, product.id);
		}

		if (Array.isArray(req.files) && req.files.length > 0) {
			updateData.image = req.files.map((file) => file.path);
		}

		await product.update(updateData);

		const updatedProduct = await Product.findByPk(product.id, {
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
				},
			],
		});

		return res.status(200).json({ success: true, message: 'Product updated', data: updatedProduct });
	} catch (error) {
		return handleControllerError(res, error, 'Update product error');
	}
};

const remove = async (req, res) => {
	try {
		const { id } = req.params;
		const productId = Number(id);

		if (!Number.isInteger(productId) || productId <= 0) {
			return res.status(400).json({ success: false, message: 'Product id must be a positive integer' });
		}

		const product = await Product.findByPk(productId);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		await product.destroy();
		return res.status(200).json({ success: true, message: 'Product deleted', data: { id: productId } });
	} catch (error) {
		return handleControllerError(res, error, 'Delete product error');
	}
};

const toggle = async (req, res) => {
	try {
		const { id } = req.params;
		const { field } = req.body;
		const productId = Number(id);
		const allowedFields = ['isBestSeller', 'inStock', 'subscriptionAvailable'];

		if (!Number.isInteger(productId) || productId <= 0) {
			return res.status(400).json({ success: false, message: 'Product id must be a positive integer' });
		}

		if (!allowedFields.includes(field)) {
			return res.status(400).json({
				success: false,
				message: 'field must be one of: isBestSeller, inStock, subscriptionAvailable',
			});
		}

		const product = await Product.findByPk(productId);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		product[field] = !product[field];
		await product.save();

		return res.status(200).json({
			success: true,
			message: `${field} updated`,
			data: {
				field,
				value: product[field],
			},
		});
	} catch (error) {
		return handleControllerError(res, error, 'Toggle product field error');
	}
};

module.exports = {
	getAll,
	getOne,
	getBySlug,
	getProductByItemCode,
	create,
	update,
	remove,
	toggle,
};
