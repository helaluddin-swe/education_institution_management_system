const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/TasksController.js');
const { protect } = require('../middleware/middleware.js'); 

router.route('/')
  .get(protect, taskCtrl.getTasks) 
  .post(protect, taskCtrl.createTask);

// New route for fetching by member
router.route('/member/:memberId')
  .get(protect, taskCtrl.getTasksByMember);

router.route('/projects/:projectId')
  .get(protect, taskCtrl.getTasksByProject);

router.route('/:id')
  .put(protect, taskCtrl.updateTask)
  .delete(protect, taskCtrl.deleteTask);

module.exports = router;