
const bcrypt = require('bcryptjs');
const { StudentProfile } = require('../models/ProfileModel');
const { User } = require('../models/AuthModel');

exports.admitStudent = async (req, res) => {
  try {
    const { 
      fullName, email, grade, section, rollNumber, 
      dob, gender, bloodGroup, address,
      guardianName, guardianPhone, guardianRelation, guardianOccupation 
    } = req.body;

    // 1. Validation
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // 2. Create the User (Login Credentials)
    // password defaults to "Student" + rollNumber if not provided
    const hashedPassword = await bcrypt.hash(`Student@${rollNumber}`, 10);
    
    const newUser = new User({
      name: fullName,
      email: email,
      password: hashedPassword,
      role: 'student',
      roleProfileModel: 'StudentProfile'
    });

    const savedUser = await newUser.save();

    // 3. Create the Student Profile
    const newProfile = new StudentProfile({
      userId: savedUser._id,
      studentId: `${new Date().getFullYear()}-${grade}${section}-${rollNumber}`,
      currentClass: grade,
      section: section,
      rollNo: rollNumber,
      personal: { dob, gender, bloodGroup, address },
      guardian: { 
        name: guardianName, 
        phone: guardianPhone, 
        relationship: guardianRelation, 
        occupation: guardianOccupation 
      }
    });

    const savedProfile = await newProfile.save();

    // 4. Link Profile back to User (The missing link)
    savedUser.profileId = savedProfile._id;
    await savedUser.save();

    res.status(201).json({ 
      success: true, 
      message: "Admission Complete", 
      studentId: savedProfile.studentId 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all students with their login emails
exports.getStudentsList = async (req, res) => {
  try {
    const students = await StudentProfile.find()
      .populate('userId', 'email name') // Pulls data from User collection
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Student Profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const updatedProfile = await StudentProfile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Student and Login Access
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