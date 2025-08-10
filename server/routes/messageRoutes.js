const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadHandler');
const { validate, schemas } = require('../middleware/validationMiddleware');
const {
  sendMessage,
  getConversation,
  getConversations,
  deleteMessage
} = require('../controllers/messageController');

// Message routes
router
  .route('/')
  .post(
    protect,
    upload.array('attachments', 5),
    validate(schemas.sendMessage),
    sendMessage
  )
  .get(protect, getConversations);

router
  .route('/:userId')
  .get(protect, getConversation);

router
  .route('/:messageId')
  .delete(protect, deleteMessage);

module.exports = router;
