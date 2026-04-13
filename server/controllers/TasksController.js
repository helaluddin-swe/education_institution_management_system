const { Task } = require("../models/TaskModel");

/**
 * @desc    Get all tasks for the logged-in user
 * @route   GET /api/tasks
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .populate('assignedTeams') // Fills IDs with full member objects
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
};

/**
 * @desc    Get tasks assigned to a specific team member
 * @route   GET /api/tasks/member/:memberId
 */
exports.getTasksByMember = async (req, res) => {
  try {
    // Queries the array to see if the memberId exists within assignedTeams
    const tasks = await Task.find({ 
      user: req.user.id, 
      assignedTeams: { $in: [req.params.memberId] } 
    })
    .populate('assignedTeams')
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch member tasks" });
  }
};

/**
 * @desc    Get tasks filtered by a specific project
 * @route   GET /api/projects/:projectId/tasks
 */
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      projectId: req.params.projectId, 
      user: req.user.id 
    })
    .populate('assignedTeams')
    .sort({ date: 1 });
    
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch project tasks" });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
exports.createTask = async (req, res) => {
  try {
    // req.body should contain the 'assignedTeams' array from the frontend
    const task = await Task.create({
      ...req.body,
      user: req.user.id 
    });
    
    // Populate the newly created task so frontend can show avatars immediately
    const populatedTask = await task.populate('assignedTeams');
    
    res.status(201).json({ success: true, data: populatedTask });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Update a task (Completion, Time Tracking, or Metadata)
 * @route   PUT /api/tasks/:id
 */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { returnDocument: true, runValidators: true }
    ).populate('assignedTeams');

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Task successfully deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};