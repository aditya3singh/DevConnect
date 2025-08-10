const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadHandler');
const { validate, schemas } = require('../middleware/validationMiddleware');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');

// Project routes
router
  .route('/')
  .post(
    protect,
    upload.single('thumbnail'),
    validate(schemas.createProject),
    createProject
  )
  .get(getProjects);

router
  .route('/:id')
  .get(getProject)
  .put(protect, upload.single('thumbnail'), updateProject)
  .delete(protect, deleteProject);

// Member management routes
router
  .route('/:id/members')
  .post(protect, addMember);

router
  .route('/:id/members/:userId')
  .delete(protect, removeMember);

module.exports = router;
