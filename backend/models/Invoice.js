const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const invoiceSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, refPath: 'customerModel', required: true },
  customerModel: { type: String, enum: ['Customer', 'StaticCustomer', 'HotspotCustomer'], default: 'Customer' },
  collector: { type: mongoose.Schema.Types.ObjectId, ref: 'Collector', default: null },
  reseller: { type: mongoose.Schema.Types.ObjectId, ref: 'Reseller', default: null },
  customerType: { type: String, enum: ['pppoe', 'static', 'hotspot'], default: 'pppoe' },
  amount: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  netAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash', 'online', 'mobile_banking'], default: 'cash' },
  status: { type: String, enum: ['paid', 'unpaid', 'partial'], default: 'paid' },
  month: { type: Number },
  year: { type: Number },
  note: { type: String, trim: true },
  paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

invoiceSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Invoice', invoiceSchema);
