// controllers/scheduleController.js
const ClassSchedule = require("../models/classScheduleModel");

// GET all schedules (Admins see all, Teachers see their own)
exports.getSchedules = async (req, res) => {
  try {
    let query = {};

    /**
     * If the user is a teacher, we filter by their employeeId.
     * Note: This assumes req.user.profileId holds the ID of the TeacherProfile
     */
    if (req.user.role === 'teacher') {
      query = { employeeId: req.user.profileId }; 
    } else if (req.user.role !== 'admin') {
      // Students or other roles might only see schedules for their specific class
      // query = { className: req.user.className }; 
    }

    const schedules = await ClassSchedule.find(query)
      .populate({
        path: 'employeeId',
        select: 'fullName email designation department' // Adjust fields based on TeacherProfile schema
      })
      .populate('createdBy', 'name email');

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching schedules", 
      error: error.message 
    });
  }
};

// CREATE a new schedule
exports.createSchedule = async (req, res) => {
  try {
    // We map the incoming data to match the new schema field 'employeeId'
    const scheduleData = {
      ...req.body,
      createdBy: req.user._id, 
    };

    const newClassSchedule = new ClassSchedule(scheduleData);
    const saved = await newClassSchedule.save();

    // Optionally populate before sending back to frontend
    const populatedSchedule = await saved.populate([
      { path: 'employeeId', select: 'fullName' },
      { path: 'createdBy', select: 'name' }
    ]);

    res.status(201).json(populatedSchedule);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: "Error creating schedule", 
      error: error.message 
    });
  }
};

// UPDATE schedule
exports.updateSchedule = async (req, res) => {
  try {
    const updated = await ClassSchedule.findByIdAndUpdate(
      req.params.id,
      req.body, // Ensure frontend sends 'employeeId' in the body
      { new: true, runValidators: true }
    ).populate('employeeId', 'fullName');

    if (!updated) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: "Update failed", 
      error: error.message 
    });
  }
};

// DELETE schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await ClassSchedule.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Delete failed", 
      error: error.message 
    });
  }
};