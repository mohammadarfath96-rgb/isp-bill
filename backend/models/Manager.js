const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  nid: { type: String, trim: true },
  salary: { type: Number, default: 0 },
  permissions: {
    customer: { type: Boolean, default: true },
    billing: { type: Boolean, default: true },
    report: { type: Boolean, default: true },
    settings: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Manager', managerSchema);
