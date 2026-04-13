const { Project } = require("../models/ProjectsModel");

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by Slug
// @route   GET /api/projects/slug/:slug
const getProjectBySlug = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const project = await Project.findOne({ 
      slug: req.params.slug,
      user: req.user._id 
    });

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    // 1. Strict Auth Check
    if (!req.user || !req.user._id) {
      console.error("AUTH DEBUG: req.user missing in createProject. check authMiddleware.");
      return res.status(401).json({ message: "Not authorized, user data missing" });
    }

    // 2. Prepare Data (Override 'user' with authenticated ID)
    const projectData = {
      ...req.body,
      user: req.user._id 
    };

    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Ownership check
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to edit this project" });
    }

    // Protection: Don't allow changing the 'user' field via update
    const { user, _id, ...updateData } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, 
      { new: true, runValidators: true } 
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Ownership check
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();
    res.status(200).json({ id: req.params.id, message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
};