const express = require('express');
const router = express.Router();
const {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea
} = require('../controllers/areaController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAreas)
  .post(createArea);

router.route('/:id')
  .get(getArea)
  .put(updateArea)
  .delete(deleteArea);

module.exports = router;
