const Staff = require('../models/Staff');

const getStaff = async (req, res, next) => {
  try {
    const { ispOwner } = req.query;
    const query = ispOwner ? { ispOwner } : {};
    const staff = await Staff.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: staff, count: staff.length });
  } catch (error) { next(error); }
};

const getStaffMember = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('ispOwner', 'name');
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.status(200).json({ success: true, data: staff });
  } catch (error) { next(error); }
};

const createStaff = async (req, res, next) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staff, message: 'Staff member created successfully' });
  } catch (error) { next(error); }
};

const updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.status(200).json({ success: true, data: staff, message: 'Staff updated' });
  } catch (error) { next(error); }
};

const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.status(200).json({ success: true, message: 'Staff deactivated' });
  } catch (error) { next(error); }
};

const updateSalary = async (req, res, next) => {
  try {
    const { salary } = req.body;
    const staff = await Staff.findByIdAndUpdate(req.params.id, { salary }, { new: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.status(200).json({ success: true, data: staff, message: 'Salary updated' });
  } catch (error) { next(error); }
};

module.exports = { getStaff, getStaffMember, createStaff, updateStaff, deleteStaff, updateSalary };
