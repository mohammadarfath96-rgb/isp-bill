const Manager = require('../models/Manager');
const User = require('../models/User');

const getManagers = async (req, res, next) => {
  try {
    const { ispOwner } = req.query;
    const query = ispOwner ? { ispOwner } : {};
    const managers = await Manager.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: managers, count: managers.length });
  } catch (error) { next(error); }
};

const getManager = async (req, res, next) => {
  try {
    const manager = await Manager.findById(req.params.id)
      .populate('user', 'username email')
      .populate('ispOwner', 'name');
    if (!manager) return res.status(404).json({ success: false, message: 'Manager not found' });
    res.status(200).json({ success: true, data: manager });
  } catch (error) { next(error); }
};

const createManager = async (req, res, next) => {
  try {
    const { username, password, name, email, phone, address, nid, salary, ispOwner, permissions } = req.body;
    const user = await User.create({ username, password, email, phone, role: 'manager' });
    const manager = await Manager.create({
      user: user._id, name, email, phone, address, nid,
      salary: salary || 0, ispOwner, permissions
    });
    res.status(201).json({ success: true, data: manager, message: 'Manager created successfully' });
  } catch (error) { next(error); }
};

const updateManager = async (req, res, next) => {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!manager) return res.status(404).json({ success: false, message: 'Manager not found' });
    res.status(200).json({ success: true, data: manager, message: 'Manager updated' });
  } catch (error) { next(error); }
};

const deleteManager = async (req, res, next) => {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!manager) return res.status(404).json({ success: false, message: 'Manager not found' });
    res.status(200).json({ success: true, message: 'Manager deactivated' });
  } catch (error) { next(error); }
};

module.exports = { getManagers, getManager, createManager, updateManager, deleteManager };
