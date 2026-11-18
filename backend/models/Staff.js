const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  nid: { type: String, trim: true },
  address: { type: String, trim: true },
  role: { type: String, trim: true },
  salary: { type: Number, default: 0 },
  joiningDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
