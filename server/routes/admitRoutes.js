const express = require('express');
const router = express.Router();

// Import the controller functions created in the previous step
const { 
  admitStudent, 
  getStudentsList, 
  updateStudentProfile, 
  expelStudent 
} = require('../controllers/AdmissionController');

// --- STUDENT ADMISSION & MANAGEMENT ---

/**
 * @route   POST /api/students/admit
 * @desc    Admit a new student (Creates User account + StudentProfile)
 * @access  Private/Admin
 */
router.post('/admit', admitStudent);

/**
 * @route   GET /api/students
 * @desc    Get all students with populated user/login data
 * @access  Private/Admin/Teacher
 */
router.get('/', getStudentsList);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student academic or personal details
 * @access  Private/Admin
 */
router.put('/:id', updateStudentProfile);

/**
 * @route   DELETE /api/students/:id
 * @desc    Remove student profile and their associated User login
 * @access  Private/Admin
 */
router.delete('/:id', expelStudent);

module.exports = router;