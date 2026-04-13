const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  /* UPDATE THIS SECTION */
 assignedTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  /* ------------------- */

  title: { 
    type: String, 
    required: [true, "Task title is required"],
    trim: true 
  },
  category: { 
  type: String, 
  enum: ['Design', 'Development', 'Marketing', 'Planning', 'Research', 'Uncategorized'], // Add 'Work' here
  default: 'Design' 
},
  date: { 
    type: Date,
    default: Date.now
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  spentTime: { 
    type: Number, 
    default: 0 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    default: null
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});

TaskSchema.virtual('spentMinutes').get(function() {
  return Math.floor(this.spentTime / 60);
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = { Task };