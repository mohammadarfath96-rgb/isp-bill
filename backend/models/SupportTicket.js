const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: ['open', 'inProgress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, trim: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
