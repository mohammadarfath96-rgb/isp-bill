const express = require('express');
const router = express.Router();
const {
  getMikrotiks,
  getMikrotik,
  createMikrotik,
  updateMikrotik,
  deleteMikrotik,
  testConnection
} = require('../controllers/mikrotikController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMikrotiks)
  .post(createMikrotik);

router.route('/:id')
  .get(getMikrotik)
  .put(updateMikrotik)
  .delete(deleteMikrotik);

router.post('/:id/test', testConnection);

module.exports = router;
