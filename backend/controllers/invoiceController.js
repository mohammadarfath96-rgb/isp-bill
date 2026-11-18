const Invoice = require('../models/Invoice');

// @desc    Get all invoices
// @route   GET /api/v1/invoice
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const { ispOwner, customer, month, year, status, customerType, page = 1, limit = 10 } = req.query;
    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (customer) query.customer = customer;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (status) query.status = status;
    if (customerType) query.customerType = customerType;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'customer', select: 'name phone username' },
        { path: 'collector', select: 'name phone' },
        { path: 'reseller', select: 'name phone' }
      ],
      sort: { createdAt: -1 }
    };

    const result = await Invoice.paginate(query, options);

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

// @desc    Get single invoice
// @route   GET /api/v1/invoice/:id
// @access  Private
const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('collector', 'name phone')
      .populate('reseller', 'name phone')
      .populate('ispOwner', 'name email phone');

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

// @desc    Create invoice
// @route   POST /api/v1/invoice
// @access  Private
const createInvoice = async (req, res, next) => {
  try {
    const { amount, discount = 0 } = req.body;
    req.body.netAmount = amount - discount;
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice, message: 'Invoice created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice
// @route   PUT /api/v1/invoice/:id
// @access  Private
const updateInvoice = async (req, res, next) => {
  try {
    if (req.body.amount !== undefined) {
      req.body.netAmount = req.body.amount - (req.body.discount || 0);
    }
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, data: invoice, message: 'Invoice updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete invoice
// @route   DELETE /api/v1/invoice/:id
// @access  Private
const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice };
