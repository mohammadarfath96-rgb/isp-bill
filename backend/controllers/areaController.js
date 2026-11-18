const Area = require('../models/Area');
const SubArea = require('../models/SubArea');
const PoleBox = require('../models/PoleBox');

// ===== AREA =====
const getAreas = async (req, res, next) => {
  try {
    const { ispOwner } = req.query;
    const query = ispOwner ? { ispOwner } : {};
    const areas = await Area.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, data: areas, count: areas.length });
  } catch (error) { next(error); }
};

const getArea = async (req, res, next) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });
    res.status(200).json({ success: true, data: area });
  } catch (error) { next(error); }
};

const createArea = async (req, res, next) => {
  try {
    const area = await Area.create(req.body);
    res.status(201).json({ success: true, data: area, message: 'Area created successfully' });
  } catch (error) { next(error); }
};

const updateArea = async (req, res, next) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });
    res.status(200).json({ success: true, data: area, message: 'Area updated successfully' });
  } catch (error) { next(error); }
};

const deleteArea = async (req, res, next) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });
    res.status(200).json({ success: true, message: 'Area deleted successfully' });
  } catch (error) { next(error); }
};

// ===== SUB AREA =====
const getSubAreas = async (req, res, next) => {
  try {
    const { ispOwner, area } = req.query;
    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (area) query.area = area;
    const subAreas = await SubArea.find(query).populate('area', 'name').sort({ name: 1 });
    res.status(200).json({ success: true, data: subAreas, count: subAreas.length });
  } catch (error) { next(error); }
};

const getSubArea = async (req, res, next) => {
  try {
    const subArea = await SubArea.findById(req.params.id).populate('area', 'name');
    if (!subArea) return res.status(404).json({ success: false, message: 'SubArea not found' });
    res.status(200).json({ success: true, data: subArea });
  } catch (error) { next(error); }
};

const createSubArea = async (req, res, next) => {
  try {
    const subArea = await SubArea.create(req.body);
    res.status(201).json({ success: true, data: subArea, message: 'SubArea created successfully' });
  } catch (error) { next(error); }
};

const updateSubArea = async (req, res, next) => {
  try {
    const subArea = await SubArea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subArea) return res.status(404).json({ success: false, message: 'SubArea not found' });
    res.status(200).json({ success: true, data: subArea });
  } catch (error) { next(error); }
};

const deleteSubArea = async (req, res, next) => {
  try {
    const subArea = await SubArea.findByIdAndDelete(req.params.id);
    if (!subArea) return res.status(404).json({ success: false, message: 'SubArea not found' });
    res.status(200).json({ success: true, message: 'SubArea deleted' });
  } catch (error) { next(error); }
};

// ===== POLE BOX =====
const getPoleBoxes = async (req, res, next) => {
  try {
    const { ispOwner, area, subArea } = req.query;
    const query = {};
    if (ispOwner) query.ispOwner = ispOwner;
    if (area) query.area = area;
    if (subArea) query.subArea = subArea;
    const poleBoxes = await PoleBox.find(query)
      .populate('area', 'name')
      .populate('subArea', 'name')
      .sort({ name: 1 });
    res.status(200).json({ success: true, data: poleBoxes, count: poleBoxes.length });
  } catch (error) { next(error); }
};

const getPoleBox = async (req, res, next) => {
  try {
    const poleBox = await PoleBox.findById(req.params.id).populate('area', 'name').populate('subArea', 'name');
    if (!poleBox) return res.status(404).json({ success: false, message: 'PoleBox not found' });
    res.status(200).json({ success: true, data: poleBox });
  } catch (error) { next(error); }
};

const createPoleBox = async (req, res, next) => {
  try {
    const poleBox = await PoleBox.create(req.body);
    res.status(201).json({ success: true, data: poleBox, message: 'PoleBox created successfully' });
  } catch (error) { next(error); }
};

const updatePoleBox = async (req, res, next) => {
  try {
    const poleBox = await PoleBox.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!poleBox) return res.status(404).json({ success: false, message: 'PoleBox not found' });
    res.status(200).json({ success: true, data: poleBox });
  } catch (error) { next(error); }
};

const deletePoleBox = async (req, res, next) => {
  try {
    const poleBox = await PoleBox.findByIdAndDelete(req.params.id);
    if (!poleBox) return res.status(404).json({ success: false, message: 'PoleBox not found' });
    res.status(200).json({ success: true, message: 'PoleBox deleted' });
  } catch (error) { next(error); }
};

module.exports = {
  getAreas, getArea, createArea, updateArea, deleteArea,
  getSubAreas, getSubArea, createSubArea, updateSubArea, deleteSubArea,
  getPoleBoxes, getPoleBox, createPoleBox, updatePoleBox, deletePoleBox
};
