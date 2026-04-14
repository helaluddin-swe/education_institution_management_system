const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  records: [{
    date: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['present', 'absent', 'late', 'excused'], 
      default: 'present' 
    },
    remarks: String
  }],
  // Virtual or pre-calculated field for quick UI display
  monthlyStats: {
    presentCount: { type: Number, default: 0 },
    totalDays: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexing for faster lookups during reporting
AttendanceSchema.index({ studentId: 1, 'records.date': 1 });


const Attendance= mongoose.model('Attendance', AttendanceSchema);
module.exports =Attendance