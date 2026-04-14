const express = require('express');
const router = express.Router();
const { 
  getSchedules, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} = require('../controllers/ClassScheduleController');

// Import your updated middleware
const { protect, adminOnly } = require('../middleware/middleware');

// --- ROUTES ---

// Everyone (Admin, Teacher, Student) can VIEW schedules
// (Controller logic handles filtering what they see)
router.get('/', protect, getSchedules);

// Only Admins can CREATE, UPDATE, or DELETE classes
router.post('/', protect, adminOnly, createSchedule);
router.put('/:id', protect, adminOnly, updateSchedule);
router.delete('/:id', protect, adminOnly, deleteSchedule);

module.exports = router;