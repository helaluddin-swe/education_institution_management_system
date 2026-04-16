const express = require('express');
const router = express.Router();

const {
  admitStudent,
  getStudentsList,
  updateStudentProfile,
  recordPayment,
  expelStudent
} = require('../controllers/AdmissionController');

const { protect } = require('../middleware/middleware');

// ✅ ALL ROUTES PROTECTED
router.post('/admit', protect, admitStudent);
router.get('/', protect, getStudentsList);
router.put('/:id', protect, updateStudentProfile);
router.delete('/:id', protect, expelStudent);
router.patch('/:id/payment', protect, recordPayment);

module.exports = router;