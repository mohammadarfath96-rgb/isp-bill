const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, default: 0 },
  category: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  note: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Expenditure', expenditureSchema);
