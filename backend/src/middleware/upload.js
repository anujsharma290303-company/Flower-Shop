const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME
  && process.env.CLOUDINARY_API_KEY
  && process.env.CLOUDINARY_API_SECRET,
);

const buildStorage = ({ folder, allowedFormats, resourceType = 'image' }) => {
  if (hasCloudinaryConfig) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const params = {
      folder,
      allowed_formats: allowedFormats,
      resource_type: resourceType,
    };

    if (resourceType === 'image') {
      params.transformation = [{ width: 800, height: 800, crop: 'limit' }];
    }

    return new CloudinaryStorage({
      cloudinary,
      params,
    });
  }

  const uploadsDir = path.join(process.cwd(), 'uploads', folder);
  fs.mkdirSync(uploadsDir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });
};

const createUploader = ({ folder, allowedFormats, resourceType = 'image', fileFilter, maxFileSize }) => multer({
  storage: buildStorage({ folder, allowedFormats, resourceType }),
  limits: { fileSize: maxFileSize },
  fileFilter,
});

const upload = createUploader({
  folder: 'flower-shop',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  resourceType: 'image',
  maxFileSize: 5 * 1024 * 1024,
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }

    return cb(new Error('Only image files are allowed'));
  },
});

const mediaUpload = createUploader({
  folder: 'flower-shop/media',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'm4v', 'webm', 'avi'],
  resourceType: 'auto',
  maxFileSize: 50 * 1024 * 1024,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype) {
      return cb(new Error('Media file is required'));
    }

    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      return cb(null, true);
    }

    return cb(new Error('Only image and video files are allowed'));
  },
});

module.exports = upload;
module.exports.mediaUpload = mediaUpload;
