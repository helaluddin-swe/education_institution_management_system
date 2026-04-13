const mongoose = require('mongoose');

// সরাসরি env থেকে URI নিন
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    return;
  }

  try {
    // strictQuery সেট করা ভালো (Mongoose 7+ এর জন্য)
    mongoose.set('strictQuery', false);

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas: devSpaceHero');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB');
    console.error('Error Details:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;