const { Reminder } = require("../models/ProjectsModel");


exports.setReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create({
      ...req.body,
      recipient: req.user.id // Or a specific user ID from req.body
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyReminders = async (req, res) => {
  const reminders = await Reminder.find({ recipient: req.user.id }).populate('task', 'description');
  res.json(reminders);
};

exports.acknowledgeReminder = async (req, res) => {
  const reminder = await Reminder.findByIdAndUpdate(
    req.params.id, 
    { isAcknowledged: true }, 
    { new: true }
  );
  res.json(reminder);
};