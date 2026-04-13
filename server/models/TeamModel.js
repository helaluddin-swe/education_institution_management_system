const mongoose = require('mongoose');


const TeamSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  name: { 
    type: String, 
    required: [true, "Member name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"]
  },

  role: { 
    type: String, 
    required: [true, "Please specify a role"],
    default: 'Developer' 
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true, // Added to prevent duplicate emails with different casing
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  teamName: { 
  type: String, 
  required: [true, "Department is required"],
  enum: ['Development', 'Design', 'Marketing', 'Management', 'General'],
  default: 'General'
},
status: {
  type: String,
  enum: ['Available', 'Busy', 'On Leave'],
  default: 'Available'
},
   start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  
}, { 
  timestamps: true,
  // Ensures virtuals are included if you add them later
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
TeamSchema.set('toJSON', { virtuals: true });
TeamSchema.set('toObject', { virtuals: true });
TeamSchema.virtual('remaining_days').get(function() {
  if (!this.end_date) return 0;
  
  const today = new Date();
  const end = new Date(this.end_date); // Ensure it's a Date object
  
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
});


const Team = mongoose.model('Team', TeamSchema);
module.exports = { Team };