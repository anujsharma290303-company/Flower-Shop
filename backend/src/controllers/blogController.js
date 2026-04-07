const slugify = require('slugify');
const { Blog } = require('../models');

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[BlogController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

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

const parsePositiveInt = (value) => {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null;
  }
  return numberValue;
};

const buildUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title || '', { lower: true, strict: true, trim: true });
  const seedSlug = baseSlug || `blog-${Date.now()}`;
  let candidate = seedSlug;
  let suffix = 1;

  while (true) {
    const where = { slug: candidate };
    const existing = await Blog.findOne({ where });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }

    candidate = `${seedSlug}-${suffix}`;
    suffix += 1;
  }
};

const getAllPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { isPublished: true },
      order: [
        ['publishedAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    return res.json({ success: true, data: blogs });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const slug = (req.params.slug || '').trim();
    if (!slug) {
      return res.status(400).json({ success: false, message: 'slug is required' });
    }

    const blog = await Blog.findOne({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    return res.json({ success: true, data: blog });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getAllBlogsAdmin = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.isPublished !== undefined) {
      const raw = String(req.query.isPublished).toLowerCase();
      if (!['true', 'false', '1', '0'].includes(raw)) {
        return res.status(400).json({ success: false, message: 'isPublished must be true or false' });
      }
      where.isPublished = raw === 'true' || raw === '1';
    }

    const { count, rows } = await Blog.findAndCountAll({
      where,
      order: [
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: {
        totalItems: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        blogs: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      isPublished,
      publishedAt,
    } = req.body || {};

    if (!title || !excerpt || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'title, excerpt, content, and author are required',
      });
    }

    const normalizedPublished = parseBooleanLike(isPublished) === true;
    const resolvedSlug = slug && String(slug).trim()
      ? await buildUniqueSlug(String(slug).trim())
      : await buildUniqueSlug(title);

    const payload = {
      title,
      slug: resolvedSlug,
      excerpt,
      content,
      coverImage: coverImage || null,
      author,
      isPublished: normalizedPublished,
      publishedAt: normalizedPublished ? (publishedAt || new Date()) : null,
    };

    const created = await Blog.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: created,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = parsePositiveInt(req.params.id);
    if (!blogId) {
      return res.status(400).json({ success: false, message: 'Blog id must be a positive integer' });
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const updates = {};

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.excerpt !== undefined) updates.excerpt = req.body.excerpt;
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.coverImage !== undefined) updates.coverImage = req.body.coverImage;
    if (req.body.author !== undefined) updates.author = req.body.author;

    if (req.body.slug !== undefined) {
      updates.slug = await buildUniqueSlug(String(req.body.slug || '').trim(), blog.id);
    } else if (req.body.title !== undefined) {
      updates.slug = await buildUniqueSlug(String(req.body.title || '').trim(), blog.id);
    }

    if (req.body.isPublished !== undefined) {
      updates.isPublished = parseBooleanLike(req.body.isPublished) === true;
      updates.publishedAt = updates.isPublished
        ? (req.body.publishedAt || blog.publishedAt || new Date())
        : null;
    } else if (req.body.publishedAt !== undefined) {
      updates.publishedAt = req.body.publishedAt;
    }

    await blog.update(updates);

    return res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const togglePublish = async (req, res) => {
  try {
    const blogId = parsePositiveInt(req.params.id);
    if (!blogId) {
      return res.status(400).json({ success: false, message: 'Blog id must be a positive integer' });
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const nextState = !blog.isPublished;
    await blog.update({
      isPublished: nextState,
      publishedAt: nextState ? (blog.publishedAt || new Date()) : null,
    });

    return res.json({
      success: true,
      message: `Blog ${nextState ? 'published' : 'unpublished'} successfully`,
      data: blog,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = parsePositiveInt(req.params.id);
    if (!blogId) {
      return res.status(400).json({ success: false, message: 'Blog id must be a positive integer' });
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await blog.destroy();

    return res.json({
      success: true,
      message: 'Blog deleted successfully',
      data: { id: blogId },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  getAllPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  togglePublish,
  deleteBlog,
};
