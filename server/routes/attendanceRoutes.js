const express = require('express');
const router = express.Router();
const { 
  markAttendance, 
  getStudentAttendance, 
  getAllAttendance, 
  deleteAttendanceRecord 
} = require('../controllers/AttendanceController');

router.route('/').get(getAllAttendance);
router.route('/mark').post(markAttendance);
router.route('/:studentId').get(getStudentAttendance);
router.route('/:studentId/:recordId').delete(deleteAttendanceRecord);

module.exports = router;