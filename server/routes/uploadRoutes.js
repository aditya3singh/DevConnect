const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "devconnect",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' ||
        file.mimetype.includes('document')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
    }
  },
});

// @desc Upload single file
// @route POST /api/upload/single
// @access Private
router.post("/single", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        format: req.file.format,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
});

// @desc Upload multiple files
// @route POST /api/upload/multiple
// @access Private
router.post("/multiple", protect, upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
      format: file.format,
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
});

// @desc Delete file
// @route DELETE /api/upload/:publicId
// @access Private
router.delete("/:publicId", protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete file",
      });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "File deletion failed",
      error: error.message,
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.',
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message || 'Upload failed',
  });
});

module.exports = router;