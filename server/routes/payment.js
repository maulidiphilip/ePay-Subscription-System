const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');

// Normalize phone number to 9 digits (remove +265)
const normalizePhoneNumber = (phone) => {
  let normalized = phone.replace(/\D/g, ''); // Remove non-digits
  if (normalized.startsWith('265')) {
    normalized = normalized.slice(3); // Remove +265
  }
  return normalized;
};

// Verify webhook signature
const verifyWebhookSignature = (payload, receivedSignature, secretKey) => {
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === receivedSignature;
};

// Initiate Payment
router.post('/initiate-payment', async (req, res) => {
  const { userId, plan, amount, email, phone, name, paymentMethod } = req.body;

  try {
    if (!userId || !plan || !amount || !email || !phone || !name || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    if (!/^[987][0-9]{8}$/.test(normalizedPhone)) {
      return res.status(400).json({
        error: 'Invalid phone number. Must be a 9-digit Malawian mobile number starting with 9, 8, or 7.',
      });
    }

    const subscription = new Subscription({
      userId,
      plan,
      amount,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await subscription.save();

    const transactionId = `EPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const transaction = new Transaction({
      transactionId,
      subscriptionId: subscription._id,
      amount,
      customerEmail: email,
      customerPhone: normalizedPhone,
      customerName: name,
      paymentMethod,
    });
    await transaction.save();

    const paymentData = {
      mobile: normalizedPhone,
      amount,
      currency: 'MWK',
      charge_id: transactionId,
      email,
      success_url: process.env.PAYCHANGU_SUCCESS_URL,
      cancel_url: process.env.PAYCHANGU_CANCEL_URL,
      mobile_money_operator_ref_id:
        paymentMethod === 'Airtel Money'
          ? '20be6c20-adeb-4b5b-a7ba-0769820df4fb' // Replace with actual Airtel Money ref ID
          : 'other-ref-id', // Replace with Mpamba ref ID
    };

    console.log('PayChangu Request:', {
      url: `${process.env.PAYCHANGU_API_URL}/mobile-money/payments/initialize`,
      headers: {
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      data: paymentData,
    });

    try {
      const response = await axios.post(
        `${process.env.PAYCHANGU_API_URL}/mobile-money/payments/initialize`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      transaction.paychanguResponse = response.data;
      await transaction.save();

      res.json({
        status: 'success',
        payment_url: response.data.data?.payment_url || response.data.data?.trans_id,
        transaction_id: transactionId,
      });
    } catch (apiError) {
      console.error('PayChangu API error:', apiError.response?.data || apiError.message);
      return res.status(500).json({
        error: 'PayChangu API request failed',
        details: apiError.response?.data || apiError.message,
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error.message);
    res.status(500).json({ error: 'Failed to initiate payment', details: error.message });
  }
});

// Webhook to handle payment status
router.post('/payment-webhook', async (req, res) => {
  try {
    const receivedSignature = req.headers['x-webhook-signature'];
    if (receivedSignature && !verifyWebhookSignature(req.body, receivedSignature, process.env.PAYCHANGU_SECRET_KEY)) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const { charge_id, status, amount, mobile, trans_id } = req.body;

    const transaction = await Transaction.findOne({ transactionId: charge_id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.status = status.toLowerCase();
    transaction.paychanguResponse = req.body;
    await transaction.save();

    const subscription = await Subscription.findById(transaction.subscriptionId);
    if (status.toLowerCase() === 'success') {
      subscription.status = 'active';
    } else {
      subscription.status = 'cancelled';
    }
    await subscription.save();

    console.log(`Webhook: Transaction ${charge_id} - ${status}`);
    res.status(200).json({ status: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ error: 'Webhook processing failed', details: error.message });
  }
});

// Transaction Status
router.get('/transaction-status/:transactionId', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.transactionId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ status: transaction.status });
  } catch (error) {
    console.error('Transaction status error:', error.message);
    res.status(500).json({ error: 'Failed to fetch transaction status', details: error.message });
  }
});

module.exports = router;