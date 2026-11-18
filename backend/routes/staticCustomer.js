const express = require('express');
const router = express.Router();
const {
  getStaticCustomers,
  getStaticCustomer,
  createStaticCustomer,
  updateStaticCustomer,
  deleteStaticCustomer,
  collectStaticBill
} = require('../controllers/staticCustomerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getStaticCustomers)
  .post(createStaticCustomer);

router.route('/:id')
  .get(getStaticCustomer)
  .put(updateStaticCustomer)
  .delete(deleteStaticCustomer);

router.post('/:id/collect', collectStaticBill);

module.exports = router;
