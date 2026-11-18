const express = require('express');
const router = express.Router();
const {
  getPoleBoxes,
  getPoleBox,
  createPoleBox,
  updatePoleBox,
  deletePoleBox
} = require('../controllers/areaController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPoleBoxes)
  .post(createPoleBox);

router.route('/:id')
  .get(getPoleBox)
  .put(updatePoleBox)
  .delete(deletePoleBox);

module.exports = router;
