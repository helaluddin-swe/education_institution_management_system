const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * STUDENT PROFILE SCHEMA
 * Focus: Class/Section tracking, Parent/Guardian info, and Attendance.
 */
const StudentProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  studentId: { type: String, required: true, unique: true },
  currentClass: { type: String, required: true },
  section: { type: String, default: 'A' },
  rollNo: { type: Number },
  personal: {
    dob: Date,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodGroup: String,
    address: String
  },
  guardian: {
    name: String,
    phone: String,
    relationship: { type: String, default: 'Father' },
    occupation: String
  },
  status: { type: String, default: 'Active' }
}, { timestamps: true });



/**
 * TEACHER PROFILE SCHEMA
 * Focus: Subject specialization, Class Teacher status, and Schedule.
 */
const TeacherProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, unique: true, required: true },

    designation: { type: String, default: "Lecturer" }, // e.g., Senior Teacher
    qualification: String, // e.g., B.Ed, M.Sc

    primarySubject: { type: String, required: true },
    otherSubjects: [String],

    // School-specific Responsibilities
    isClassTeacher: { type: Boolean, default: false },
    assignedClassSection: { type: String }, // e.g., "10-A"

    joiningDate: Date,
    bio: { type: String, maxLength: 300 },

    // Performance & Availability
    timetableUrl: String,
    phoneNumber: String,
    emergencyContact: String,
  },
  { timestamps: true },
);

/**
 * ADMIN PROFILE SCHEMA
 * Focus: Daily operations, Fees, and User Management.
 */
const AdminProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    role: {
      type: String,
      enum: [
        "Principal",
        "Vice-Principal",
        "Accountant",
        "Office-Staff",
        "Librarian",
      ],
      required: false,
    },

    permissions: {
      manageFees: { type: Boolean, default: false },
      manageAttendance: { type: Boolean, default: true },
      manageExams: { type: Boolean, default: false },
      editStudentData: { type: Boolean, default: true },
    },

    officeExtension: String,
    assignedWing: String, // e.g., "Junior Wing", "Senior Wing"

    // Audit Trail
    lastLogin: Date,
    actionsPerformed: [{ action: String, timestamp: Date }],
  },
  { timestamps: true },
);

const AdminProfile = mongoose.model("AdminProfile", AdminProfileSchema);
const TeacherProfile = mongoose.model("TeacherProfile", TeacherProfileSchema);
const StudentProfile = mongoose.model("StudentProfile", StudentProfileSchema);

module.exports = { AdminProfile, TeacherProfile, StudentProfile };
