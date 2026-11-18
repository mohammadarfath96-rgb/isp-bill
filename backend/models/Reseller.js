const mongoose = require('mongoose');

const resellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  balance: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 0 },
  areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Reseller', resellerSchema);
