const express = require('express');
const router = express.Router();
const {
  getDailyReport,
  getMonthlyReport,
  getCollectorReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/daily', getDailyReport);
router.get('/monthly', getMonthlyReport);
router.get('/collector', getCollectorReport);

module.exports = router;
