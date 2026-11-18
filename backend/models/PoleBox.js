const mongoose = require('mongoose');

const poleBoxSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  subArea: { type: mongoose.Schema.Types.ObjectId, ref: 'SubArea', default: null },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PoleBox', poleBoxSchema);
