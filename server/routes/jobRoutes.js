const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/middleware');
const { createJob, updateJob, deleteJob, getAllJobs, getJobById } = require('../controllers/JobController');

// Assume these middlewares verify the JWT and check user.role


// Public access
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Recruiter only access
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;