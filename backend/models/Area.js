const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Area', areaSchema);
