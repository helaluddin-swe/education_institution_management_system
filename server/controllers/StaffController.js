const bcrypt = require("bcryptjs");
const { TeacherProfile } = require("../models/ProfileModel"); // Ensure this matches your export
const { User } = require("../models/AuthModel");

exports.hireStaff = async (req, res) => {
  try {
    const { 
      fullName, 
      employeeId, 
      designation, 
      qualification, 
      primarySubject, 
      otherSubjects, 
      isClassTeacher, 
      assignedClassSection, 
      joiningDate, 
      bio, 
      phoneNumber, 
      emergencyContact,
      email // Assuming email comes through to create the User
    } = req.body;

    // 1. Validation
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered to another staff/user" });
    }

    // 2. Create User Credentials
    // Default password: Staff@EmployeeID (e.g., Staff@EMP-1234)
    const hashedPassword = await bcrypt.hash(`Staff@${employeeId}`, 10);

    const newUser = new User({
      name: fullName,
      email: email,
      password: hashedPassword,
      role: "teacher", // Hardcoded for this controller
      roleProfileModel: "TeacherProfile",
    });

    const savedUser = await newUser.save();

    // 3. Create Teacher Profile based on your schema
    const newStaff = new TeacherProfile({
      userId: savedUser._id,
      employeeId,
      fullName,
      designation,
      qualification,
      primarySubject,
      otherSubjects,
      isClassTeacher,
      assignedClassSection,
      joiningDate,
      bio,
      phoneNumber,
      emergencyContact
    });

    const savedProfile = await newStaff.save();

    // 4. Link Profile back to User
    savedUser.profileId = savedProfile._id;
    await savedUser.save();

    res.status(201).json({
      success: true,
      message: "Staff appointed successfully",
      employeeId: savedProfile.employeeId,
    });
  } catch (error) {
    console.error("Hiring Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStaffList = async (req, res) => {
  try {
    const staff = await TeacherProfile.find()
      .populate("userId", "email name")
      .sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStaffProfile = async (req, res) => {
  try {
    const staffId = req.params.id;
    const updateData = req.body;

    const profile = await TeacherProfile.findById(staffId);
    if (!profile) return res.status(404).json({ message: "Staff member not found" });

    // 1. Update User Credentials if Name or Email changed
    if (updateData.fullName || updateData.email) {
      await User.findByIdAndUpdate(profile.userId, {
        name: updateData.fullName,
        email: updateData.email,
      });
    }

    // 2. Update Profile
    const updatedProfile = await TeacherProfile.findByIdAndUpdate(
      staffId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.terminateStaff = async (req, res) => {
  try {
    const profile = await TeacherProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Staff not found" });

    await User.findByIdAndDelete(profile.userId);
    await TeacherProfile.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Staff records and account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};