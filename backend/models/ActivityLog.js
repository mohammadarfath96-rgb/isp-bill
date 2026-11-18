const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, trim: true },
  description: { type: String, trim: true },
  ip: { type: String, trim: true },
  entityType: { type: String, trim: true },
  entityId: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
