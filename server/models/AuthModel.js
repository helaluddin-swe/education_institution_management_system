const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin'], 
    default: 'student' 
  },
  // CHANGED: Removed required: true because the user is created 
  // BEFORE the profileId exists in the registration transaction.
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'roleProfileModel' 
  },
  roleProfileModel: {
    type: String,
    required: true,
    enum: ['StudentProfile', 'TeacherProfile', 'AdminProfile']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to link the specific profile
// This allows you to call .populate('profile') instead of 'profileId'
UserSchema.virtual('profile', {
  ref: (doc) => doc.roleProfileModel,
  localField: 'profileId',
  foreignField: '_id',
  justOne: true
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };