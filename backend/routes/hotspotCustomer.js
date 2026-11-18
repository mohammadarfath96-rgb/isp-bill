const express = require('express');
const router = express.Router();
const {
  getHotspotCustomers,
  getHotspotCustomer,
  createHotspotCustomer,
  updateHotspotCustomer,
  deleteHotspotCustomer,
  collectHotspotBill
} = require('../controllers/hotspotCustomerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getHotspotCustomers)
  .post(createHotspotCustomer);

router.route('/:id')
  .get(getHotspotCustomer)
  .put(updateHotspotCustomer)
  .delete(deleteHotspotCustomer);

router.post('/:id/collect', collectHotspotBill);

module.exports = router;
