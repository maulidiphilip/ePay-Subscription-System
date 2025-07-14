const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    plan: { type: String, required: true, enum: ['Basic', 'Premium'] },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'cancelled'],
      default: 'pending',
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);