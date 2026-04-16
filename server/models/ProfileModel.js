const mongoose = require('mongoose');
const Schema =mongoose.Schema



const PaymentSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },

  tuitionFee: { type: Number, default: 0, min: 0 },
  examFee: { type: Number, default: 0, min: 0 },
  transportFee: { type: Number, default: 0, min: 0 },
  libraryFee: { type: Number, default: 0, min: 0 },
  labFee: { type: Number, default: 0, min: 0 },
  others: { type: Number, default: 0, min: 0 },

  totalBilled: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial', 'Waived'],
    default: 'Pending'
  }
}, { timestamps: true });

// 🔥 AUTO CALCULATION
PaymentSchema.pre("save", function (next) {
  this.totalBilled =
    this.tuitionFee +
    this.examFee +
    this.transportFee +
    this.libraryFee +
    this.labFee +
    this.others;

  this.balance = this.totalBilled - this.paidAmount;
  next();
});

const StudentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    currentClass: { type: String, required: true },
    section: { type: String, default: "A" },
    rollNo: { type: Number },
    profilePicture: { type: String, default: "" },

    personal: {
      dob: Date,
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      bloodGroup: String,
      address: String,
      email: String,
      phone: String,
    },

    guardian: {
      name: String,
      phone: String,
      relation: { type: String, default: "Father" },
      occupation: String,
      email: String,
    },

    academics: {
      attendance: { type: String, default: "0%" },
      lastGPA: { type: String, default: "0.00" },
      subjectGrades: [
        {
          subject: String,
          score: Number,
          grade: String,
        },
      ],
      progressHistory: [
        {
          month: String,
          rate: Number,
        },
      ],
    },

    // --- INTEGRATED PAYMENT LOGIC ---
    finance: {
      paymentHistory: [PaymentSchema],
      
      // The 'Vault' for overpaid money (Advanced Logic)
      reservedBalance: { 
        type: Number, 
        default: 0 
      },
      
      // Summary fields for Dashboard performance
      totalOutstandingDebt: { 
        type: Number, 
        default: 0 
      },
      totalBilledToDate: { 
        type: Number, 
        default: 0 
      }
    },

    achievements: [
      {
        title: String,
        date: Date,
        description: String,
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
  },
  { timestamps: true },
);



/**
 * TEACHER PROFILE SCHEMA
 * Focus: Subject specialization, Class Teacher status, and Schedule.
 */
const TeacherProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
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
