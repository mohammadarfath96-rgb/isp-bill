const Collector = require('../models/Collector');
const User = require('../models/User');

const getCollectors = async (req, res, next) => {
  try {
    const { ispOwner } = req.query;
    const query = ispOwner ? { ispOwner } : {};
    const collectors = await Collector.find(query)
      .populate('user', 'username')
      .populate('reseller', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: collectors, count: collectors.length });
  } catch (error) { next(error); }
};

const getCollector = async (req, res, next) => {
  try {
    const collector = await Collector.findById(req.params.id)
      .populate('user', 'username email')
      .populate('ispOwner', 'name')
      .populate('reseller', 'name');
    if (!collector) return res.status(404).json({ success: false, message: 'Collector not found' });
    res.status(200).json({ success: true, data: collector });
  } catch (error) { next(error); }
};

const createCollector = async (req, res, next) => {
  try {
    const { username, password, name, phone, email, ispOwner, reseller, salary, permissions } = req.body;
    const user = await User.create({ username, password, email, phone, role: 'collector' });
    const collector = await Collector.create({
      user: user._id, name, phone, ispOwner, reseller: reseller || null,
      salary: salary || 0, permissions
    });
    res.status(201).json({ success: true, data: collector, message: 'Collector created successfully' });
  } catch (error) { next(error); }
};

const updateCollector = async (req, res, next) => {
  try {
    const collector = await Collector.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!collector) return res.status(404).json({ success: false, message: 'Collector not found' });
    res.status(200).json({ success: true, data: collector, message: 'Collector updated' });
  } catch (error) { next(error); }
};

const deleteCollector = async (req, res, next) => {
  try {
    const collector = await Collector.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!collector) return res.status(404).json({ success: false, message: 'Collector not found' });
    res.status(200).json({ success: true, message: 'Collector deactivated' });
  } catch (error) { next(error); }
};

module.exports = { getCollectors, getCollector, createCollector, updateCollector, deleteCollector };
