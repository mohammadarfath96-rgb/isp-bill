const Expenditure = require('../models/Expenditure');

const getExpenditures = async (req, res, next) => {
  try {
    const { ispOwner, category } = req.query;
    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (category) query.category = category;
    const expenditures = await Expenditure.find(query)
      .populate('createdBy', 'username')
      .sort({ date: -1 });

    const total = expenditures.reduce((acc, e) => acc + e.amount, 0);
    res.status(200).json({ success: true, data: expenditures, count: expenditures.length, total });
  } catch (error) { next(error); }
};

const getExpenditure = async (req, res, next) => {
  try {
    const exp = await Expenditure.findById(req.params.id).populate('createdBy', 'username');
    if (!exp) return res.status(404).json({ success: false, message: 'Expenditure not found' });
    res.status(200).json({ success: true, data: exp });
  } catch (error) { next(error); }
};

const createExpenditure = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const exp = await Expenditure.create(req.body);
    res.status(201).json({ success: true, data: exp, message: 'Expenditure recorded' });
  } catch (error) { next(error); }
};

const updateExpenditure = async (req, res, next) => {
  try {
    const exp = await Expenditure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exp) return res.status(404).json({ success: false, message: 'Expenditure not found' });
    res.status(200).json({ success: true, data: exp, message: 'Expenditure updated' });
  } catch (error) { next(error); }
};

const deleteExpenditure = async (req, res, next) => {
  try {
    const exp = await Expenditure.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: 'Expenditure not found' });
    res.status(200).json({ success: true, message: 'Expenditure deleted' });
  } catch (error) { next(error); }
};

module.exports = { getExpenditures, getExpenditure, createExpenditure, updateExpenditure, deleteExpenditure };
