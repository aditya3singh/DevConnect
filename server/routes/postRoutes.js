const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadHandler');
const { validate, schemas } = require('../middleware/validationMiddleware');
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike
} = require('../controllers/postController');

// Post routes
router
  .route('/')
  .post(protect, upload.array('media', 5), validate(schemas.createPost), createPost)
  .get(getPosts);

router
  .route('/:id')
  .get(getPost)
  .put(protect, upload.array('media', 5), updatePost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, toggleLike);

module.exports = router;
