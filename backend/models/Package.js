const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  name: { type: String, required: true, trim: true },
  uploadSpeed: { type: String, trim: true },
  downloadSpeed: { type: String, trim: true },
  price: { type: Number, required: true, default: 0 },
  type: { type: String, enum: ['pppoe', 'static', 'hotspot'], default: 'pppoe' },
  mikrotikProfile: { type: String, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
