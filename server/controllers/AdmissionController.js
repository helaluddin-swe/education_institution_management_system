const bcrypt = require("bcryptjs");
const { StudentProfile } = require("../models/ProfileModel");
const { User } = require("../models/AuthModel");

exports.admitStudent = async (req, res) => {
  try {
    // Destructure based on the corrected Frontend studentEntry object
    const { fullName, currentClass, section, rollNo, personal, guardian } = req.body;

    // 1. Validation
    const existingUser = await User.findOne({ email: personal.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // 2. Create the User (Login Credentials)
    // FIX: Use rollNo (the variable you destructured above)
    const hashedPassword = await bcrypt.hash(`Student@${rollNo}`, 10);

    const newUser = new User({
      name: fullName,
      email: personal.email,
      password: hashedPassword,
      role: "student",
      roleProfileModel: "StudentProfile",
    });

    const savedUser = await newUser.save();

    // 3. Create the Student Profile
    // Logic: We need a unique studentId. Usually generated like 'STD-2024-001'
    const studentIdGen = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = new StudentProfile({
      userId: savedUser._id, // LINK TO THE USER WE JUST CREATED
      studentId: studentIdGen,
      fullName,
      currentClass,
      section,
      rollNo,
      personal,
      guardian,
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

exports.updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    const profile = await StudentProfile.findById(studentId);
    if (!profile) return res.status(404).json({ message: "Student not found" });

    // 1. Update User Credentials if Name or Email changed
    if (updateData.fullName || updateData.personal?.email) {
      await User.findByIdAndUpdate(profile.userId, {
        name: updateData.fullName,
        email: updateData.personal?.email,
      });
    }

    // 2. Update Student Profile
    // Logic Fix: Since we mapped the keys in the frontend already, 
    // we don't need to manually remap 'grade' to 'currentClass' here again.
    const updatedProfile = await StudentProfile.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.expelStudent = async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Student not found" });

    // Remove both the login user and the profile
    await User.findByIdAndDelete(profile.userId);
    await StudentProfile.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Student and account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};