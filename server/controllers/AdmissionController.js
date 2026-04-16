const bcrypt = require("bcryptjs");
const { StudentProfile } = require("../models/ProfileModel");
const { User } = require("../models/AuthModel");

// @desc    Admit new student, create User account & Finance profile
// @route   POST /api/students/admit
exports.admitStudent = async (req, res) => {
  try {
    const { fullName, currentClass, section, rollNo, personal, guardian } = req.body;

    // 1. Validation
    const existingUser = await User.findOne({ email: personal.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // 2. Create the User (Login Credentials)
    const hashedPassword = await bcrypt.hash(`Student@${rollNo}`, 10);

    const newUser = new User({
      name: fullName,
      email: personal.email,
      password: hashedPassword,
      role: "student",
      roleProfileModel: "StudentProfile",
    });

    const savedUser = await newUser.save();

    // 3. Create Student Profile with Finance structure initialized
    const studentIdGen = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = new StudentProfile({
      userId: savedUser._id,
      studentId: studentIdGen,
      fullName,
      currentClass,
      section,
      rollNo,
      personal,
      guardian,
      finance: {
        paymentHistory: [],
        reservedBalance: 0,
        totalOutstandingDebt: 0
      }
    });

    const savedProfile = await newStudent.save();

    // 4. Link Profile back to User
    savedUser.profileId = savedProfile._id;
    await savedUser.save();

    res.status(201).json({
      success: true,
      message: "Admission Complete",
      studentId: savedProfile.studentId,
    });
  } catch (error) {
    console.error("Admission Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students with populated user data
exports.getStudentsList = async (req, res) => {
  try {
    const students = await StudentProfile.find()
      .populate("userId", "email name")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update profile and sync changes to User account
exports.updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    const profile = await StudentProfile.findById(studentId);
    if (!profile) return res.status(404).json({ message: "Student not found" });

    // 1. Sync User Credentials if critical info changed
    if (updateData.fullName || updateData.personal?.email) {
      await User.findByIdAndUpdate(profile.userId, {
        name: updateData.fullName || profile.fullName,
        email: updateData.personal?.email || profile.personal.email,
      });
    }

    // 2. Update Student Profile
    const updatedProfile = await StudentProfile.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { returnDocument: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record a payment and update debt/vault
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentData = req.body;

    const student = await StudentProfile.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // ❌ Prevent duplicate month entry
    const exists = student.finance.paymentHistory.find(
      p => p.month === paymentData.month && p.year === paymentData.year
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Payment for this month already exists"
      });
    }

    let paidAmount = Number(paymentData.paidAmount || 0);
    let totalBilled = Number(paymentData.totalBilled || 0);

    let status = "Pending";
    let extra = 0;

    if (paidAmount >= totalBilled) {
      status = "Paid";

      if (paidAmount > totalBilled) {
        extra = paidAmount - totalBilled;
        student.finance.reservedBalance += extra;
        paidAmount = totalBilled;
      }

    } else if (paidAmount > 0) {
      status = "Partial";
    }

    const newPayment = {
      ...paymentData,
      paidAmount,
      totalBilled,
      status
    };

    student.finance.paymentHistory.push(newPayment);

    // 🔥 RECALCULATE
    student.finance.totalBilledToDate += totalBilled;

    const totalPaid = student.finance.paymentHistory.reduce(
      (sum, p) => sum + p.paidAmount,
      0
    );

    student.finance.totalOutstandingDebt =
      student.finance.totalBilledToDate - totalPaid;

    await student.save();

    // 🔥 SOCKET.IO EMIT
    const io = req.app.get("io");
    io.emit("paymentUpdated", student);

    res.status(200).json({
      success: true,
      data: student, // 🔥 IMPORTANT (send full student)
      extraReserved: extra
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove Student and associated User account
exports.expelStudent = async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Student not found" });

    await User.findByIdAndDelete(profile.userId);
    await StudentProfile.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Student and account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};