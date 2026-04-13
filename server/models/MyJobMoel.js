// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // --- ADD THIS FIELD ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Matches the name of your User model
    required: true
  },
  // ----------------------
  category: {
    type: String,
    required: true,
    enum: ['Full Stack Developer', 'Frontend Engineer', 'Backend Developer', 'UI/UX Designer'],
    default: 'Full Stack Developer'
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  url: {
    type: String,
    trim: true
  },
  apply_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['Applied','Interviewing','Rejected','Offer Received'],

    default: 'Applied'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});

// Virtual field for remaining_days
jobSchema.virtual('remaining_days').get(function() {
  if (!this.end_date) return 0;
  const today = new Date();
  const diffTime = this.end_date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Ensure you export correctly (CommonJS)
const Job = mongoose.model('Job', jobSchema);
module.exports = { Job };