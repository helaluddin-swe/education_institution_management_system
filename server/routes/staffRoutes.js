const express = require("express");
const router = express.Router();
const staffController = require("../controllers/StaffController");


// Applied protection if you have auth middleware
router.post("/appoint", staffController.hireStaff);
router.get("/all", staffController.getStaffList);
router.put("/update/:id", staffController.updateStaffProfile);
router.delete("/terminate/:id", staffController.terminateStaff);

module.exports = router;