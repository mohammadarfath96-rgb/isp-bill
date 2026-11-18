const express = require('express');
const router = express.Router();
const {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  updateSalary
} = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getStaff)
  .post(createStaff);

router.route('/:id')
  .get(getStaffMember)
  .put(updateStaff)
  .delete(deleteStaff);

router.put('/:id/salary', updateSalary);

module.exports = router;
