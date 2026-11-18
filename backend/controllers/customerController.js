const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const ActivityLog = require('../models/ActivityLog');
const IspOwner = require('../models/IspOwner');

// @desc    Get all customers
// @route   GET /api/v1/customer
// @access  Private
const getCustomers = async (req, res, next) => {
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
        { username: { $regex: search, $options: 'i' } }
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

    const result = await Customer.paginate(query, options);

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

// @desc    Get single customer
// @route   GET /api/v1/customer/:id
// @access  Private
const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('area', 'name')
      .populate('subArea', 'name')
      .populate('poleBox', 'name')
      .populate('package', 'name price type uploadSpeed downloadSpeed')
      .populate('reseller', 'name phone')
      .populate('mikrotik', 'name host')
      .populate('createdBy', 'username');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/v1/customer
// @access  Private
const createCustomer = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const customer = await Customer.create(req.body);

    // Log activity
    await ActivityLog.create({
      ispOwner: req.body.ispOwner,
      user: req.user._id,
      action: 'CREATE_CUSTOMER',
      description: `Created customer ${customer.name}`,
      ip: req.ip,
      entityType: 'Customer',
      entityId: customer._id
    });

    res.status(201).json({ success: true, data: customer, message: 'Customer created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/v1/customer/:id
// @access  Private
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await ActivityLog.create({
      ispOwner: customer.ispOwner,
      user: req.user._id,
      action: 'UPDATE_CUSTOMER',
      description: `Updated customer ${customer.name}`,
      ip: req.ip,
      entityType: 'Customer',
      entityId: customer._id
    });

    res.status(200).json({ success: true, data: customer, message: 'Customer updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer (soft delete)
// @route   DELETE /api/v1/customer/:id
// @access  Private
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { status: 'deleted' },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await ActivityLog.create({
      ispOwner: customer.ispOwner,
      user: req.user._id,
      action: 'DELETE_CUSTOMER',
      description: `Deleted customer ${customer.name}`,
      ip: req.ip,
      entityType: 'Customer',
      entityId: customer._id
    });

    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Collect bill for customer
// @route   POST /api/v1/customer/:id/collect
// @access  Private
const collectBill = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const { amount, discount = 0, paymentMethod = 'cash', month, year, note, collectorId } = req.body;

    const netAmount = amount - discount;
    const now = new Date();

    // Create invoice
    const invoice = await Invoice.create({
      ispOwner: customer.ispOwner,
      customer: customer._id,
      customerModel: 'Customer',
      customerType: 'pppoe',
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

    // Update customer financials
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

    await ActivityLog.create({
      ispOwner: customer.ispOwner,
      user: req.user._id,
      action: 'COLLECT_BILL',
      description: `Collected ${netAmount} from ${customer.name}`,
      ip: req.ip,
      entityType: 'Invoice',
      entityId: invoice._id
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(customer.ispOwner.toString()).emit('billCollected', { invoice, customer });
    }

    res.status(201).json({ success: true, data: invoice, message: 'Bill collected successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, collectBill };
