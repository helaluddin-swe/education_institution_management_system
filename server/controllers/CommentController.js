const { Comment } = require("../models/ProjectsModel");


exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      task: req.params.taskId,
      author: req.user.id
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTaskComments = async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId }).populate('author', 'name avatar');
  res.json(comments);
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findOneAndDelete({ _id: req.params.id, author: req.user.id });
  if (!comment) return res.status(404).json({ message: "Comment not found or unauthorized" });
  res.json({ message: 'Comment removed' });
};