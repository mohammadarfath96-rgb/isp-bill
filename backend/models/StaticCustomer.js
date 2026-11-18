const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const staticCustomerSchema = new mongoose.Schema({
  ispOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'IspOwner', required: true },
  reseller: { type: mongoose.Schema.Types.ObjectId, ref: 'Reseller', default: null },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  subArea: { type: mongoose.Schema.Types.ObjectId, ref: 'SubArea', default: null },
  poleBox: { type: mongoose.Schema.Types.ObjectId, ref: 'PoleBox', default: null },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  nid: { type: String, trim: true },
  photo: { type: String, default: '' },
  username: { type: String, trim: true },
  password: { type: String },
  staticIp: { type: String, trim: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  monthlyFee: { type: Number, default: 0 },
  connectionFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'expired', 'deleted'], default: 'active' },
  mikrotik: { type: mongoose.Schema.Types.ObjectId, ref: 'Mikrotik', default: null },
  mac: { type: String, trim: true },
  billingDate: { type: Number, min: 1, max: 31, default: 1 },
  lastBillingDate: { type: Date },
  paymentDate: { type: Date },
  balance: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  advanceAmount: { type: Number, default: 0 },
  note: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

staticCustomerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('StaticCustomer', staticCustomerSchema);
