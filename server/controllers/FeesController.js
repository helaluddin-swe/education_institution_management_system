const { Tennant } = require("../models/TennantModel");

// --- CREATE NEW TENANT ---
const addTennant = async (req, res) => {
    try {
        const { name, phone, email, nid, unit, type, status, joiningDate, lease, emergencyContact } = req.body;

        // Extract ID from req.user (attached by protect middleware)
        const userId = req.user._id; 

        const newTenant = new Tennant({
            user: userId, // CRITICAL: Link tenant to the logged-in user
            name,
            phone,
            email,
            nid,
            unit,
            type,
            status,
            joiningDate,
            lease,
            emergencyContact,
            payments: []
        });

        await newTenant.save();
        res.status(201).json({ success: true, data: newTenant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- GET ALL TENANTS ---
const getAllTennant = async (req, res) => {
    try {
        // Use ID from req.user
        const userId = req.user._id; 
        
        // Find only tenants that belong to this user
        const tenants = await Tennant.find({ user: userId }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: tenants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- UPDATE TENANT ---
// --- UPDATED UPDATE TENANT CONTROLLER ---
const updateTennant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // 1. Security Check: Find tenant by ID AND check if it belongs to this user
        // We use .findOne instead of .findByIdAndUpdate directly to allow for potential 
        // logic processing if needed in the future.
        const tenant = await Tennant.findOne({ _id: id, user: userId });

        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found or unauthorized" });
        }

        // 2. Perform the update
        // We include reservedBalance, totalDebt, and totalBilled in the allowed body
        const updatedTenant = await Tennant.findByIdAndUpdate(
            id,
            { $set: req.body }, 
            { returnDocument: true, runValidators: true } // 'new: true' returns the updated doc
        );

        res.status(200).json({ success: true, data: updatedTenant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- DELETE TENANT ---
const deleteTennant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Security Check: Ensure user owns this tenant record before deleting
        const deletedTenant = await Tennant.findOneAndDelete({ _id: id, user: userId });

        if (!deletedTenant) {
            return res.status(404).json({ success: false, message: "Tenant not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Tenant deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addTennant,
    getAllTennant,
    updateTennant,
    deleteTennant
};