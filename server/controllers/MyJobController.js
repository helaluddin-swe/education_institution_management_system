

// @desc    Get all jobs for logged-in user
// @route   GET /api/jobs
// controllers/MyJobController.js
const { Job } = require("../models/MyJobMoel"); // Use braces!

exports.getJobs = async (req, res) => {
  try {
    // req.user.id comes from the 'decoded' token in protect middleware
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    // IMPORTANT: You must add this line before Job.create
    req.body.user = req.user.id; 

    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    // If it fails here, check your terminal for "ValidationError"
    console.error(err); 
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // CHANGE: Security Check - Ensure user owns the job before updating
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument:true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // CHANGE: Security Check - Ensure user owns the job before deleting
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};