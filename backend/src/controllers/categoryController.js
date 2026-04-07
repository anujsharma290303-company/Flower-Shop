const { Category, Product, sequelize } = require('../models');
const slugify = require('slugify');
const { Op } = require('sequelize');

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[CategoryController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  res.status(status).json({ success: false, message });
};

const buildUniqueSlug = async (name, excludeId = null) => {
  let slug = slugify(name, { lower: true, strict: true });
  let slugExists = await Category.findOne({
    where: {
      slug,
      ...(excludeId && { id: { [Op.ne]: excludeId } }),
    },
  });

  let counter = 1;
  while (slugExists) {
    slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
    slugExists = await Category.findOne({
      where: {
        slug,
        ...(excludeId && { id: { [Op.ne]: excludeId } }),
      },
    });
    counter++;
  }

  return slug;
};

const getAll = async (req, res) => {
  try {
    const { isActive } = req.query;
    const where = { parentId: null }; // Only parent categories

    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === '1';
    }

    const categories = await Category.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'name', 'slug', 'description', 'icon', 'displayOrder', 'isActive', 'parentId'],
        },
      ],
      attributes: ['id', 'name', 'slug', 'description', 'icon', 'displayOrder', 'isActive', 'parentId', 'createdAt', 'updatedAt'],
      order: [['displayOrder', 'ASC']],
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    handleControllerError(res, error);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'name', 'slug', 'description', 'icon', 'displayOrder', 'isActive', 'parentId'],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    handleControllerError(res, error);
  }
};

const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'name', 'slug', 'description', 'icon', 'displayOrder', 'isActive', 'parentId'],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    handleControllerError(res, error);
  }
};

const getCategoriesWithSubs = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parentId: null, isActive: true },
      include: [
        {
          model: Category,
          as: 'subcategories',
          where: { isActive: true },
          required: false,
        },
      ],
      order: [['displayOrder', 'ASC']],
    });

    return res.json({ success: true, data: categories });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const create = async (req, res) => {
  try {
    const { name, description, icon, displayOrder, isActive, parentId } = req.body;
    const image = req.file ? req.file.filename || req.file.path : null;

    // Verify parent exists if parentId provided
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(400).json({ success: false, message: 'Parent category not found' });
      }
    }

    // Generate unique slug
    const slug = await buildUniqueSlug(name);

    const category = await Category.create({
      name,
      slug,
      description: description || null,
      icon: icon || null,
      image,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      parentId: parentId || null,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, displayOrder, isActive, parentId } = req.body;
    const image = req.file ? req.file.filename || req.file.path : undefined;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Verify parent exists if parentId is being changed and it's not null
    if (parentId !== undefined && parentId !== null && parentId !== category.parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(400).json({ success: false, message: 'Parent category not found' });
      }
    }

    // Regenerate slug if name changes
    let newSlug = category.slug;
    if (name && name !== category.name) {
      newSlug = await buildUniqueSlug(name, id);
    }

    const updates = {
      ...(name && { name, slug: newSlug }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isActive !== undefined && { isActive }),
      ...(parentId !== undefined && { parentId }),
      ...(image && { image }),
    };

    await category.update(updates);

    const updatedCategory = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'name', 'slug', 'description', 'icon', 'displayOrder', 'isActive', 'parentId'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if any products use this category
    const productCount = await Product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} product(s) are using this category.`,
      });
    }

    // Check if any subcategories exist
    const subcategoryCount = await Category.count({ where: { parentId: id } });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${subcategoryCount} subcategory/ies exist under this category.`,
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: { id },
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const newActiveState = !category.isActive;
    await category.update({ isActive: newActiveState });

    res.json({
      success: true,
      message: `Category ${newActiveState ? 'activated' : 'deactivated'} successfully`,
      data: { id, isActive: newActiveState },
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

module.exports = {
  getAll,
  getOne,
  getBySlug,
  getCategoriesWithSubs,
  create,
  update,
  remove,
  toggleActive,
};
