const express = require('express');
const verifyToken = require('../middleware/auth');
const { validateCreateBlog, validateUpdateBlog } = require('../validators/blogValidator');
const {
  getAllPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  togglePublish,
  deleteBlog,
} = require('../controllers/blogController');

const publicRouter = express.Router();
const adminRouter = express.Router();

// Public routes
publicRouter.get('/', getAllPublishedBlogs);
publicRouter.get('/slug/:slug', getBlogBySlug);

// Admin routes
adminRouter.get('/', verifyToken, getAllBlogsAdmin);
adminRouter.post('/', verifyToken, validateCreateBlog, createBlog);
adminRouter.put('/:id', verifyToken, validateUpdateBlog, updateBlog);
adminRouter.patch('/:id/publish', verifyToken, togglePublish);
adminRouter.delete('/:id', verifyToken, deleteBlog);

module.exports = {
  publicRouter,
  adminRouter,
};
