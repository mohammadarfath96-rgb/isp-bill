const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/v1/package
// @access  Private
const getPackages = async (req, res, next) => {
  try {
    const { ispOwner, type, isActive } = req.query;
    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const packages = await Package.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: packages, count: packages.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package
// @route   GET /api/v1/package/:id
// @access  Private
const getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc    Create package
// @route   POST /api/v1/package
// @access  Private
const createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg, message: 'Package created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update package
// @route   PUT /api/v1/package/:id
// @access  Private
const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.status(200).json({ success: true, data: pkg, message: 'Package updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete package
// @route   DELETE /api/v1/package/:id
// @access  Private
const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.status(200).json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPackages, getPackage, createPackage, updatePackage, deletePackage };
