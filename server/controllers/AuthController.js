const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
// Updated Imports to match the School Models
const { StudentProfile, TeacherProfile, AdminProfile } = require("../models/ProfileModel");
const { User } = require("../models/AuthModel");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Updated Role-to-Model Mapping
const getProfileModel = (role) => {
  const models = { 
    student: StudentProfile, 
    teacher: TeacherProfile, 
    admin: AdminProfile 
  };
  return models[role] || null;
};

// @desc Register User
exports.registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role, profileData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const ProfileModel = getProfileModel(role);
    if (!ProfileModel) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Invalid role selection' });
    }

    // 1. Hash Password FIRST
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Create the User FIRST to get an ID
    const [user] = await User.create([{
      name,
      email,
      password: hashedPassword,
      role,
      roleProfileModel: ProfileModel.modelName 
    }], { session });

    // 3. Inject the newly created user._id into the profile data
    const completeProfileData = {
      ...profileData,
      userId: user._id // This satisfies the 'required: true' constraint
    };

    // 4. Create the Profile with the userId included
    const [newProfile] = await ProfileModel.create([completeProfileData], { session });

    // 5. Link the Profile ID back to the User record
    user.profileId = newProfile._id;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: newProfile
      }
    });

  } catch (error) {
    if (session.inAtomicity()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user - do not populate yet
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // 3. Define the model to populate based on the user's role
      // This matches the string names of your Mongoose Models
      let modelName = "";
      if (user.role === 'admin') modelName = 'AdminProfile';
      if (user.role === 'teacher') modelName = 'TeacherProfile';
      if (user.role === 'student') modelName = 'StudentProfile';

      // 4. Populate dynamically
      if (modelName && user.profileId) {
        await user.populate({
          path: 'profileId',
          model: modelName
        });
      }

      res.json({ 
        success: true, 
        token: generateToken(user), 
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, 
          profile: user.profileId // Now contains full AdminProfile data
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// @desc Update Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, email, profileData } = req.body;

    if (name) user.name = name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already taken' });
      user.email = email;
    }
    await user.save();

    if (profileData) {
      const ProfileModel = getProfileModel(user.role);
      // Update specific school fields like currentClass or designation
      await ProfileModel.findByIdAndUpdate(user.profileId, { $set: profileData }, { returnDocument
        : true });
    }

    const updatedUser = await User.findById(user._id).populate('profileId');
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Current User (For Frontend Refresh)
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

