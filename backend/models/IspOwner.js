const mongoose = require('mongoose');

const ispOwnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  logo: { type: String, default: '' },
  bpSettings: {
    smsGateway: {
      url: { type: String, default: '' },
      apiKey: { type: String, default: '' },
      senderId: { type: String, default: '' },
      isActive: { type: Boolean, default: false }
    },
    paymentGateway: {
      bkash: { number: String, isActive: { type: Boolean, default: false } },
      nagad: { number: String, isActive: { type: Boolean, default: false } },
      rocket: { number: String, isActive: { type: Boolean, default: false } }
    }
  },
  balance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  subscriptionExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('IspOwner', ispOwnerSchema);
