const express = require('express');
const router = express.Router();
const {
  getManagers,
  getManager,
  createManager,
  updateManager,
  deleteManager
} = require('../controllers/managerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getManagers)
  .post(createManager);

router.route('/:id')
  .get(getManager)
  .put(updateManager)
  .delete(deleteManager);

module.exports = router;
