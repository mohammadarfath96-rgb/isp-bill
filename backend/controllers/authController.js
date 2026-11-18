const User = require('../models/User');
const IspOwner = require('../models/IspOwner');
const Manager = require('../models/Manager');
const Collector = require('../models/Collector');
const Reseller = require('../models/Reseller');
const generateToken = require('../utils/generateToken');

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    const userPayload = { id: user._id, username: user.username, role: user.role, email: user.email };

    let roleData = null;

    if (user.role === 'ispOwner') {
      roleData = await IspOwner.findOne({ user: user._id });
    } else if (user.role === 'manager') {
      roleData = await Manager.findOne({ user: user._id }).populate('ispOwner');
    } else if (user.role === 'collector') {
      roleData = await Collector.findOne({ user: user._id }).populate('ispOwner');
    } else if (user.role === 'reseller') {
      roleData = await Reseller.findOne({ user: user._id }).populate('ispOwner');
    }

    res.status(200).json({
      success: true,
      access: { token },
      user: userPayload,
      ispOwner: user.role === 'ispOwner' ? roleData : (roleData ? roleData.ispOwner : null),
      roleData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register ISP Owner
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, username, password, email, phone } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Name, username, and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    const user = await User.create({ username, password, email, phone, role: 'ispOwner' });

    const ispOwner = await IspOwner.create({
      user: user._id,
      name,
      email,
      phone,
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: user._id, username: user.username, role: user.role },
      ispOwner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let roleData = null;

    if (user.role === 'ispOwner') {
      roleData = await IspOwner.findOne({ user: user._id });
    } else if (user.role === 'manager') {
      roleData = await Manager.findOne({ user: user._id }).populate('ispOwner');
    } else if (user.role === 'collector') {
      roleData = await Collector.findOne({ user: user._id }).populate('ispOwner');
    } else if (user.role === 'reseller') {
      roleData = await Reseller.findOne({ user: user._id }).populate('ispOwner');
    }

    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, role: user.role, email: user.email },
      roleData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();

    let roleData = null;
    if (user.role === 'ispOwner') {
      roleData = await IspOwner.findOneAndUpdate(
        { user: user._id },
        { name, email, phone, address },
        { new: true }
      );
    } else if (user.role === 'manager') {
      roleData = await Manager.findOneAndUpdate(
        { user: user._id },
        { name, email, phone, address },
        { new: true }
      );
    } else if (user.role === 'collector') {
      roleData = await Collector.findOneAndUpdate(
        { user: user._id },
        { name, phone, address },
        { new: true }
      );
    } else if (user.role === 'reseller') {
      roleData = await Reseller.findOneAndUpdate(
        { user: user._id },
        { name, email, phone, address },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: roleData,
      user: { id: user._id, username: user.username, role: user.role, email: user.email, phone: user.phone }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getMe, changePassword, updateProfile };
