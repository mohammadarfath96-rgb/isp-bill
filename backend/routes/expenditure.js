const express = require('express');
const router = express.Router();
const {
  getExpenditures,
  getExpenditure,
  createExpenditure,
  updateExpenditure,
  deleteExpenditure
} = require('../controllers/expenditureController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getExpenditures)
  .post(createExpenditure);

router.route('/:id')
  .get(getExpenditure)
  .put(updateExpenditure)
  .delete(deleteExpenditure);

module.exports = router;
