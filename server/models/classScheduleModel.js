const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  // Reference to the Teacher/User model
   employeeId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'TeacherProfile',
     required: true
   },
  
  // Track who created this (optional but good for security)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  
  },

  subject: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  category: { 
    type: String, 
    enum: ['Lecture', 'Lab', 'Meeting', 'Duty', 'Other'], 
    default: 'Lecture' 
  },
  className: { type: String, required: true },
  section: { type: String, required: true },
  topics: { type: String },
  description: { type: String },
  backgroundColor: { type: String },
  borderColor: { type: String }
}, { timestamps: true });


const ClassSchedule= mongoose.model('ClassSchedule', scheduleSchema);
module.exports =ClassSchedule