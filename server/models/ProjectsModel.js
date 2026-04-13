const mongoose = require('mongoose');
const slugify = require('slugify'); // npm install slugify

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Project title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  slug: String, 
  description: { 
    type: String, 
    required: [true, "Please add a description"],
    trim: true 
  },
  category: { 
    type: String, 
    enum: ['Web Development', 'Mobile App', 'UI/UX Design', 'Research', 'AI/ML'],
    default: 'Web Development' 
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  technologies: [String], 
  liveUrl: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
  thumbnail: { type: String, default: 'default-project.jpg' },
  startDate: { type: Date },
  endDate: { type: Date },

 
user: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User', 
  required: true 
}
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate slug before saving
ProjectSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

// Virtual: Overdue check
ProjectSchema.virtual('isOverdue').get(function() {
  if (!this.endDate || this.status === 'Completed') return false;
  return new Date() > this.endDate;
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = { Project };