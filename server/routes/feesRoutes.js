const express = require('express');
const { protect } = require('../middleware/middleware');
const { addTennant, updateTennant, deleteTennant, getAllTennant } = require('../controllers/FeesController');
const router = express.Router();




// Cleanest way to apply protect to ALL team routes:
router.use(protect); 

router.route('/').get(getAllTennant).post(addTennant);
router.route('/:id').put(updateTennant).delete(deleteTennant)

module.exports = router;