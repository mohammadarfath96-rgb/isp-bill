const StaticCustomer = require('../models/StaticCustomer');
const Invoice = require('../models/Invoice');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all static customers
// @route   GET /api/v1/static-customer
// @access  Private
const getStaticCustomers = async (req, res, next) => {
  try {
    const { ispOwner, status, area, reseller, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (status) query.status = status;
    if (area) query.area = area;
    if (reseller) query.reseller = reseller;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { staticIp: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'area', select: 'name' },
        { path: 'package', select: 'name price type' },
        { path: 'reseller', select: 'name phone' },
        { path: 'subArea', select: 'name' }
      ],
      sort: { createdAt: -1 }
    };

    const result = await StaticCustomer.paginate(query, options);

    res.status(200).json({
      success: true,
      data: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single static customer
// @route   GET /api/v1/static-customer/:id
// @access  Private
const getStaticCustomer = async (req, res, next) => {
  try {
    const customer = await StaticCustomer.findById(req.params.id)
      .populate('area', 'name')
      .populate('subArea', 'name')
      .populate('poleBox', 'name')
      .populate('package', 'name price type')
      .populate('reseller', 'name phone')
      .populate('mikrotik', 'name host')
      .populate('createdBy', 'username');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Static customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Create static customer
// @route   POST /api/v1/static-customer
// @access  Private
const createStaticCustomer = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const customer = await StaticCustomer.create(req.body);

    await ActivityLog.create({
      ispOwner: req.body.ispOwner,
      user: req.user._id,
      action: 'CREATE_STATIC_CUSTOMER',
      description: `Created static customer ${customer.name}`,
      ip: req.ip,
      entityType: 'StaticCustomer',
      entityId: customer._id
    });

    res.status(201).json({ success: true, data: customer, message: 'Static customer created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update static customer
// @route   PUT /api/v1/static-customer/:id
// @access  Private
const updateStaticCustomer = async (req, res, next) => {
  try {
    const customer = await StaticCustomer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Static customer not found' });
    }

    await ActivityLog.create({
      ispOwner: customer.ispOwner,
      user: req.user._id,
      action: 'UPDATE_STATIC_CUSTOMER',
      description: `Updated static customer ${customer.name}`,
      ip: req.ip,
      entityType: 'StaticCustomer',
      entityId: customer._id
    });

    res.status(200).json({ success: true, data: customer, message: 'Static customer updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete static customer (soft delete)
// @route   DELETE /api/v1/static-customer/:id
// @access  Private
const deleteStaticCustomer = async (req, res, next) => {
  try {
    const customer = await StaticCustomer.findByIdAndUpdate(
      req.params.id,
      { status: 'deleted' },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Static customer not found' });
    }

    await ActivityLog.create({
      ispOwner: customer.ispOwner,
      user: req.user._id,
      action: 'DELETE_STATIC_CUSTOMER',
      description: `Deleted static customer ${customer.name}`,
      ip: req.ip,
      entityType: 'StaticCustomer',
      entityId: customer._id
    });

    res.status(200).json({ success: true, message: 'Static customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Collect bill for static customer
// @route   POST /api/v1/static-customer/:id/collect
// @access  Private
const collectStaticBill = async (req, res, next) => {
  try {
    const customer = await StaticCustomer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Static customer not found' });
    }

    const { amount, discount = 0, paymentMethod = 'cash', month, year, note, collectorId } = req.body;
    const netAmount = amount - discount;
    const now = new Date();

    const invoice = await Invoice.create({
      ispOwner: customer.ispOwner,
      customer: customer._id,
      customerModel: 'StaticCustomer',
      customerType: 'static',
      collector: collectorId || null,
      reseller: customer.reseller || null,
      amount,
      discount,
      netAmount,
      paymentMethod,
      status: 'paid',
      month: month || now.getMonth() + 1,
      year: year || now.getFullYear(),
      note,
      paidAt: now
    });

    const prevDue = customer.dueAmount;
    let newDue = prevDue - netAmount;
    let advance = 0;
    if (newDue < 0) {
      advance = Math.abs(newDue);
      newDue = 0;
    }

    customer.dueAmount = newDue;
    customer.advanceAmount = customer.advanceAmount + advance;
    customer.paymentDate = now;
    customer.lastBillingDate = now;
    await customer.save();

    res.status(201).json({ success: true, data: invoice, message: 'Bill collected successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStaticCustomers,
  getStaticCustomer,
  createStaticCustomer,
  updateStaticCustomer,
  deleteStaticCustomer,
  collectStaticBill
};
