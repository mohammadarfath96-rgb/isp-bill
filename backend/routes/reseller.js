const express = require('express');
const router = express.Router();
const {
  getResellers,
  getReseller,
  createReseller,
  updateReseller,
  deleteReseller,
  rechargeBalance
} = require('../controllers/resellerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getResellers)
  .post(createReseller);

router.route('/:id')
  .get(getReseller)
  .put(updateReseller)
  .delete(deleteReseller);

router.post('/:id/recharge', rechargeBalance);

module.exports = router;
