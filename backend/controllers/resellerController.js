const Reseller = require('../models/Reseller');
const User = require('../models/User');

const getResellers = async (req, res, next) => {
  try {
    const { ispOwner } = req.query;
    const query = ispOwner ? { ispOwner } : {};
    const resellers = await Reseller.find(query)
      .populate('user', 'username email')
      .populate('areas', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: resellers, count: resellers.length });
  } catch (error) { next(error); }
};

const getReseller = async (req, res, next) => {
  try {
    const reseller = await Reseller.findById(req.params.id)
      .populate('user', 'username email')
      .populate('areas', 'name')
      .populate('ispOwner', 'name');
    if (!reseller) return res.status(404).json({ success: false, message: 'Reseller not found' });
    res.status(200).json({ success: true, data: reseller });
  } catch (error) { next(error); }
};

const createReseller = async (req, res, next) => {
  try {
    const { username, password, email, phone, name, ispOwner, commissionRate, areas } = req.body;

    const user = await User.create({ username, password, email, phone, role: 'reseller' });
    const reseller = await Reseller.create({
      user: user._id, name, email, phone, ispOwner, commissionRate, areas: areas || []
    });

    res.status(201).json({ success: true, data: reseller, message: 'Reseller created successfully' });
  } catch (error) { next(error); }
};

const updateReseller = async (req, res, next) => {
  try {
    const reseller = await Reseller.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!reseller) return res.status(404).json({ success: false, message: 'Reseller not found' });
    res.status(200).json({ success: true, data: reseller, message: 'Reseller updated successfully' });
  } catch (error) { next(error); }
};

const deleteReseller = async (req, res, next) => {
  try {
    const reseller = await Reseller.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!reseller) return res.status(404).json({ success: false, message: 'Reseller not found' });
    res.status(200).json({ success: true, message: 'Reseller deactivated' });
  } catch (error) { next(error); }
};

const rechargeBalance = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const reseller = await Reseller.findByIdAndUpdate(
      req.params.id,
      { $inc: { balance: amount } },
      { new: true }
    );
    if (!reseller) return res.status(404).json({ success: false, message: 'Reseller not found' });
    res.status(200).json({ success: true, data: reseller, message: `Balance recharged by ${amount}` });
  } catch (error) { next(error); }
};

module.exports = { getResellers, getReseller, createReseller, updateReseller, deleteReseller, rechargeBalance };
