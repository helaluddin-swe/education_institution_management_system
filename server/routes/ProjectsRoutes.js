const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProjectBySlug, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/ProjectController.js');

// Import your auth middleware
const { protect } = require('../middleware/middleware.js');

// --- Global Protection ---
// This ensures ALL routes below this line require a valid token
router.use(protect);

// --- Base Routes ---
router.route('/')
  .get(getProjects)   // Protected via router.use(protect)
  .post(createProject);

// --- Slug Route ---
// Placed above /:id to prevent the slug from being treated as an ID
router.get('/slug/:slug', getProjectBySlug);

// --- ID Specific Routes ---
router.route('/:id')
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;