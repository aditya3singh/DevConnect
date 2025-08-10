const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'devconnect',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    transformation: [{ width: 1000, crop: "limit" }] // Resize images to max width 1000px
  }
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only certain file types
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs and Word documents are allowed.'), false);
    }
  }
});

// Utility functions for Cloudinary operations
const cloudinaryUtils = {
  // Upload file to Cloudinary
  uploadFile: async (file, options = {}) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, options);
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  },

  // Delete file from Cloudinary
  deleteFile: async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  },

  // Create image transformations URL
  transform: (url, options) => {
    return cloudinary.url(url, options);
  }
};

module.exports = {
  upload,
  cloudinaryUtils
};
