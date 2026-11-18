const mongoose = require('mongoose');

const collectorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  reseller: { type: mongoose.Schema.Types.ObjectId, ref: 'Reseller', default: null },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  salary: { type: Number, default: 0 },
  permissions: {
    canCollect: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Collector', collectorSchema);
