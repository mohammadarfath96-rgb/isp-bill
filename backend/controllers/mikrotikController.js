const Mikrotik = require('../models/Mikrotik');
const axios = require('axios');

const getMikrotiks = async (req, res, next) => {
  try {
    const { ispOwner } = req.query;
    const query = ispOwner ? { ispOwner } : {};
    const mikrotiks = await Mikrotik.find(query).sort({ createdAt: -1 });
    // Don't expose passwords
    const sanitized = mikrotiks.map(m => ({
      ...m.toObject(),
      password: '***'
    }));
    res.status(200).json({ success: true, data: sanitized, count: mikrotiks.length });
  } catch (error) { next(error); }
};

const getMikrotik = async (req, res, next) => {
  try {
    const mikrotik = await Mikrotik.findById(req.params.id);
    if (!mikrotik) return res.status(404).json({ success: false, message: 'Mikrotik not found' });
    const data = { ...mikrotik.toObject(), password: '***' };
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

const createMikrotik = async (req, res, next) => {
  try {
    const mikrotik = await Mikrotik.create(req.body);
    res.status(201).json({ success: true, data: mikrotik, message: 'Mikrotik added successfully' });
  } catch (error) { next(error); }
};

const updateMikrotik = async (req, res, next) => {
  try {
    const mikrotik = await Mikrotik.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!mikrotik) return res.status(404).json({ success: false, message: 'Mikrotik not found' });
    res.status(200).json({ success: true, data: mikrotik, message: 'Mikrotik updated' });
  } catch (error) { next(error); }
};

const deleteMikrotik = async (req, res, next) => {
  try {
    const mikrotik = await Mikrotik.findByIdAndDelete(req.params.id);
    if (!mikrotik) return res.status(404).json({ success: false, message: 'Mikrotik not found' });
    res.status(200).json({ success: true, message: 'Mikrotik deleted' });
  } catch (error) { next(error); }
};

const testConnection = async (req, res, next) => {
  try {
    const mikrotik = await Mikrotik.findById(req.params.id);
    if (!mikrotik) return res.status(404).json({ success: false, message: 'Mikrotik not found' });

    // Attempt a basic REST API call to Mikrotik RouterOS
    const url = `http://${mikrotik.host}:${mikrotik.port}/rest/system/resource`;
    const response = await axios.get(url, {
      auth: { username: mikrotik.username, password: mikrotik.password },
      timeout: 5000
    });

    res.status(200).json({
      success: true,
      message: 'Connection successful',
      data: {
        uptime: response.data['uptime'],
        version: response.data['version'],
        boardName: response.data['board-name']
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Connection failed: ' + (error.message || 'Unknown error')
    });
  }
};

module.exports = { getMikrotiks, getMikrotik, createMikrotik, updateMikrotik, deleteMikrotik, testConnection };
