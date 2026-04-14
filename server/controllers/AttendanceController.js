

// @desc    Mark or Update today's attendance for a student

const Attendance = require("../models/AttendanceModel");

// @route   POST /api/attendance/mark
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, date, remarks } = req.body;
    const targetDate = new Date(date || new Date());
    targetDate.setHours(0, 0, 0, 0); // Normalize time to midnight

    let attendance = await Attendance.findOne({ studentId });

    if (!attendance) {
      // Create new document if first time
      attendance = new Attendance({
        studentId,
        records: [{ date: targetDate, status, remarks }],
        monthlyStats: { presentCount: status === 'present' ? 1 : 0, totalDays: 1 }
      });
    } else {
      // Check if record for this date already exists
      const existingRecordIndex = attendance.records.findIndex(
        (r) => new Date(r.date).getTime() === targetDate.getTime()
      );

      if (existingRecordIndex > -1) {
        // Update existing record and adjust counts
        const oldStatus = attendance.records[existingRecordIndex].status;
        attendance.records[existingRecordIndex].status = status;
        attendance.records[existingRecordIndex].remarks = remarks;

        if (oldStatus !== 'present' && status === 'present') attendance.monthlyStats.presentCount++;
        if (oldStatus === 'present' && status !== 'present') attendance.monthlyStats.presentCount--;
      } else {
        // Push new record
        attendance.records.push({ date: targetDate, status, remarks });
        attendance.monthlyStats.totalDays++;
        if (status === 'present') attendance.monthlyStats.presentCount++;
      }
    }

    await attendance.save();
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance for a specific student
// @route   GET /api/attendance/:studentId
exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ studentId: req.params.studentId });
    res.status(200).json({ success: true, data: attendance || { records: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get all attendance records (with student details)
// @route   GET /api/attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate('studentId', 'fullName rollNumber grade section');
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a specific day's record from a student's history
// @route   DELETE /api/attendance/:studentId/:recordId
exports.deleteAttendanceRecord = async (req, res) => {
  try {
    const { studentId, recordId } = req.params;
    const attendance = await Attendance.findOne({ studentId });

    if (!attendance) return res.status(404).json({ message: "Record not found" });

    // Find the record to adjust stats before removing
    const record = attendance.records.id(recordId);
    if (record && record.status === 'present') {
      attendance.monthlyStats.presentCount--;
    }
    attendance.monthlyStats.totalDays--;

    // Remove sub-document
    attendance.records.pull(recordId);
    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};