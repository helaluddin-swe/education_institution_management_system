const express = require('express');
const router = express.Router();

const { addMember, getTeam, updateMember, deleteMember } = require('../controllers/TeamController');
const { protect } = require('../middleware/middleware');

// Cleanest way to apply protect to ALL team routes:
router.use(protect); 

router.route('/').get(getTeam).post(addMember);
router.route('/:id').put(updateMember).delete(deleteMember);

module.exports = router;