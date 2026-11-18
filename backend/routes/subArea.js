const express = require('express');
const router = express.Router();
const {
  getSubAreas,
  getSubArea,
  createSubArea,
  updateSubArea,
  deleteSubArea
} = require('../controllers/areaController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getSubAreas)
  .post(createSubArea);

router.route('/:id')
  .get(getSubArea)
  .put(updateSubArea)
  .delete(deleteSubArea);

module.exports = router;
