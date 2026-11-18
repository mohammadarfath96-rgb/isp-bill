const Invoice = require('../models/Invoice');
const mongoose = require('mongoose');

// @desc    Get daily report
// @route   GET /api/v1/report/daily
// @access  Private
const getDailyReport = async (req, res, next) => {
  try {
    const { ispOwner, date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999));

    const query = {
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    };
    if (ispOwner) query.ispOwner = ispOwner;

    const invoices = await Invoice.find(query)
      .populate('customer', 'name phone username')
      .populate('collector', 'name')
      .sort({ createdAt: -1 });

    const total = invoices.reduce((acc, inv) => acc + inv.netAmount, 0);

    res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
      total,
      date: startOfDay
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly report
// @route   GET /api/v1/report/monthly
// @access  Private
const getMonthlyReport = async (req, res, next) => {
  try {
    const { ispOwner, month, year } = req.query;
    const now = new Date();
    const m = parseInt(month) || now.getMonth() + 1;
    const y = parseInt(year) || now.getFullYear();

    const query = { month: m, year: y };
    if (ispOwner) query.ispOwner = ispOwner;

    const invoices = await Invoice.find(query)
      .populate('customer', 'name phone username')
      .populate('collector', 'name')
      .sort({ createdAt: -1 });

    const totalCollected = invoices.filter(i => i.status === 'paid').reduce((acc, inv) => acc + inv.netAmount, 0);
    const totalDiscount = invoices.reduce((acc, inv) => acc + inv.discount, 0);

    res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
      totalCollected,
      totalDiscount,
      month: m,
      year: y
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get collector report
// @route   GET /api/v1/report/collector
// @access  Private
const getCollectorReport = async (req, res, next) => {
  try {
    const { ispOwner, collectorId, month, year } = req.query;
    const now = new Date();
    const m = parseInt(month) || now.getMonth() + 1;
    const y = parseInt(year) || now.getFullYear();

    const matchStage = { month: m, year: y };
    if (ispOwner) matchStage.ispOwner = mongoose.Types.ObjectId.createFromHexString(ispOwner);
    if (collectorId) matchStage.collector = mongoose.Types.ObjectId.createFromHexString(collectorId);

    const report = await Invoice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$collector',
          totalCollected: { $sum: '$netAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'collectors',
          localField: '_id',
          foreignField: '_id',
          as: 'collectorInfo'
        }
      },
      { $unwind: { path: '$collectorInfo', preserveNullAndEmpty: true } }
    ]);

    res.status(200).json({ success: true, data: report, month: m, year: y });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDailyReport, getMonthlyReport, getCollectorReport };
