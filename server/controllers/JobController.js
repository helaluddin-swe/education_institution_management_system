const Job = require("../models/JobModel");


/**
 * @desc    Create new Job Posting
 * @route   POST /api/jobs
 * @access  Private (Recruiter Only)
 */
exports.createJob = async (req, res) => {
    try {
        // Automatically set contact email from the recruiter's account if not provided
        const jobData = {
            ...req.body,
            contactEmail: req.body.contactEmail || req.user.email,
            // You could also link the recruiter's ID here if you add it to the schema
            // recruiter: req.user._id 
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            success: true,
            message: "Job campaign launched successfully",
            data: job
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get All Jobs (with optional filtering)
 * @route   GET /api/jobs
 * @access  Public
 */
exports.getAllJobs = async (req, res) => {
    try {
        // Basic filtering (e.g., only show 'Active' jobs to the public)
        const filter = req.user?.role === 'recruiter' ? {} : { status: 'Active' };
        
        const jobs = await Job.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * @desc    Get Single Job Details
 * @route   GET /api/jobs/:id
 * @access  Public
 */
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job posting not found" });
        }

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid Job ID" });
    }
};

/**
 * @desc    Update Job Posting
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiter Only)
 */
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Logic Check: Ensure the recruiter updating this is the one who owns it (if applicable)
        // if (job.contactEmail !== req.user.email && req.user.role !== 'admin') {
        //     return res.status(401).json({ success: false, message: "Not authorized to update" });
        // }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete Job Posting
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter Only)
 */
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: "Job posting removed from system"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};