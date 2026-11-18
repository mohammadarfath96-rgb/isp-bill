const express = require('express');
const router = express.Router();
const {
  getCollectors,
  getCollector,
  createCollector,
  updateCollector,
  deleteCollector
} = require('../controllers/collectorController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getCollectors)
  .post(createCollector);

router.route('/:id')
  .get(getCollector)
  .put(updateCollector)
  .delete(deleteCollector);

module.exports = router;
