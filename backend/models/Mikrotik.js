const mongoose = require('mongoose');

const mikrotikSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  name: { type: String, required: true, trim: true },
  host: { type: String, required: true, trim: true },
  port: { type: Number, default: 8728 },
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['pppoe', 'hotspot', 'both'], default: 'pppoe' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Mikrotik', mikrotikSchema);
