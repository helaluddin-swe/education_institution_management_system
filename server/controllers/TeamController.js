const { Team } = require("../models/TeamModel");

// @desc    Get all team members
// @route   GET /api/team
exports.getTeam = async (req, res) => {
  try {
    const members = await Team.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new team member
// @route   POST /api/team


// @desc    Add new team member


exports.addMember = async (req, res) => {
  try {
      req.body.user=req.user.id;
    // Create the member
    const member = await Team.create(req.body);
    
    res.status(201).json({ success: true, data: member });
  } catch (error) {
   
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update member details
// @desc    Update member details
// @route   PUT /api/team/:id
exports.updateMember = async (req, res) => {
  try {
    // 1. Find the member first to check ownership
    let member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // 2. Security Check - Ensure user owns this team member record before updating
    // We check against the ID from the protect middleware
    if (member.user.toString() !== (req.user.id || req.user._id).toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to update this member" });
    }

    // 3. Update the member
    member = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // This is 'returnDocument: true' in Mongoose terms
      runValidators: true,
    });

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    // Handling specific validation or server errors
    console.error("Update Member Error:", error.message);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// @desc    Remove member
// @desc    Remove member
// @route   DELETE /api/team/:id
exports.deleteMember = async (req, res) => {
  try {
    // 1. Find the member first to verify existence and ownership
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // 2. Security Check - Ensure user owns the member record before deleting
    // Standardizing to (req.user.id || req.user._id) to match your Jobs logic
    if (member.user.toString() !== (req.user.id || req.user._id).toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this member" });
    }

    // 3. Perform the deletion
    await member.deleteOne();

    res.status(200).json({ success: true, message: "Member removed from team" });
  } catch (error) {
    console.error("Delete Member Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};