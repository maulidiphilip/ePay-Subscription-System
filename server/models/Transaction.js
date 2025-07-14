const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription'    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'MWK' },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerName: { type: String, required: true },
    paychanguResponse: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);