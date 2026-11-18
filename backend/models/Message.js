const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  to: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' },
  type: { type: String, enum: ['sms', 'notification'], default: 'sms' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
