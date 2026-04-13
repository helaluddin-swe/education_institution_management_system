const express = require('express');
const router = express.Router();
const { 
  getJobs, 
  createJob, 
  updateJob, 
  deleteJob 
} = require('../controllers/MyJobController.js');
const { protect } = require('../middleware/middleware.js');

// IMPORT your auth middleware (ensure the path is correct for your project)


// Route: /api/jobs
// We add 'protect' to every route because only logged-in users 
// should manage their own job board.
router.route('/')
  .get(protect, getJobs)
  .post(protect, createJob);

// Route: /api/jobs/:id
router.route('/:id')
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;