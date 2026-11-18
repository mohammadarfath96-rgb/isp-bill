const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const Package = require('../models/Package');
const Reseller = require('../models/Reseller');
const Collector = require('../models/Collector');
const moment = require('moment');

// @desc    Get dashboard stats
// @route   GET /api/v1/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const { ispOwner } = req.query;
    const filter = ispOwner ? { ispOwner } : {};

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Customer stats
    const [totalCustomers, activeCustomers, inactiveCustomers] = await Promise.all([
      Customer.countDocuments({ ...filter, status: { $ne: 'deleted' } }),
      Customer.countDocuments({ ...filter, status: 'active' }),
      Customer.countDocuments({ ...filter, status: 'inactive' })
    ]);

    // Revenue stats
    const [totalRevenueResult, monthlyRevenueResult] = await Promise.all([
      Invoice.aggregate([
        { $match: { ...filter, status: 'paid', ...(ispOwner ? { ispOwner: require('mongoose').Types.ObjectId.createFromHexString(ispOwner) } : {}) } },
        { $group: { _id: null, total: { $sum: '$netAmount' } } }
      ]),
      Invoice.aggregate([
        {
          $match: {
            ...(ispOwner ? { ispOwner: require('mongoose').Types.ObjectId.createFromHexString(ispOwner) } : {}),
            status: 'paid',
            month: currentMonth,
            year: currentYear
          }
        },
        { $group: { _id: null, total: { $sum: '$netAmount' } } }
      ])
    ]);

    // Due amount
    const dueResult = await Customer.aggregate([
      { $match: ispOwner ? { ispOwner: require('mongoose').Types.ObjectId.createFromHexString(ispOwner) } : {} },
      { $group: { _id: null, total: { $sum: '$dueAmount' } } }
    ]);

    // Counts
    const [totalPackages, totalResellers, totalCollectors] = await Promise.all([
      Package.countDocuments(filter),
      Reseller.countDocuments(filter),
      Collector.countDocuments(filter)
    ]);

    // Recent invoices
    const recentInvoices = await Invoice.find(ispOwner ? { ispOwner } : {})
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 })
      .limit(10);

    // Chart data: monthly revenue for last 12 months
    const chartData = [];
    for (let i = 11; i >= 0; i--) {
      const date = moment().subtract(i, 'months');
      const m = date.month() + 1;
      const y = date.year();

      const matchStage = {
        status: 'paid',
        month: m,
        year: y,
        ...(ispOwner ? { ispOwner: require('mongoose').Types.ObjectId.createFromHexString(ispOwner) } : {})
      };

      const result = await Invoice.aggregate([
        { $match: matchStage },
        { $group: { _id: null, total: { $sum: '$netAmount' } } }
      ]);

      chartData.push({
        month: date.format('MMM YY'),
        revenue: result[0]?.total || 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        totalRevenue: totalRevenueResult[0]?.total || 0,
        monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
        totalDue: dueResult[0]?.total || 0,
        totalPackages,
        totalResellers,
        totalCollectors,
        recentInvoices,
        chartData
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
