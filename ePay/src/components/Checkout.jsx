import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { state } = useLocation();
  const { plan } = state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', paymentMethod: 'Airtel Money' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setTransactionStatus('pending');

    try {
      const response = await axios.post('http://localhost:5000/api/initiate-payment', {
        userId: 'test-user-123', // Replace with actual user ID from auth
        plan: plan?.name || 'Basic',
        amount: plan?.price || 5000,
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        paymentMethod: formData.paymentMethod,
      });

      setTransactionId(response.data.transaction_id);
      setFormData({ name: '', email: '', phone: '', paymentMethod: 'Airtel Money' }); // Reset form
      setIsSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initiate payment');
      setTransactionStatus(null);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!transactionId || transactionStatus === 'success' || transactionStatus === 'failed') return;

    const pollStatus = async () => {
      try {
        console.log(`Polling status for transaction: ${transactionId}`);
        const response = await axios.get(`http://localhost:5000/api/transaction-status/${transactionId}`);
        console.log('Polling response:', response.data);
        setTransactionStatus(response.data.status);

        if (response.data.status === 'success') {
          navigate('/success', { state: { plan } });
        } else if (response.data.status === 'failed') {
          navigate('/failure', { state: { plan } });
        }
      } catch (err) {
        console.error('Status polling error:', err.message);
      }
    };

    const interval = setInterval(pollStatus, 5000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setError('Payment confirmation timed out. Please try again or contact support.');
      setTransactionStatus(null);
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [transactionId, transactionStatus, navigate, plan]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="bg-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">
              Complete Your Purchase
            </h2>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-medium">Plan:</span>
              <span className="font-bold">{plan?.name || 'Plan'}</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-medium">Amount:</span>
              <span className="text-2xl font-bold">MWK {plan?.price?.toLocaleString() || '0'}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Payment
              </h3>
              <p className="text-sm text-gray-600">
                {transactionStatus === 'pending'
                  ? `Please confirm the payment via ${formData.paymentMethod} USSD prompt on your phone.`
                  : `You'll receive a USSD prompt to confirm payment via ${formData.paymentMethod}.`}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {transactionStatus && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                Transaction Status: {transactionStatus.charAt(0).toUpperCase() + transactionStatus.slice(1)}
                {transactionStatus === 'pending' && ' - Awaiting USSD confirmation...'}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="John Banda"
                    required
                    disabled={transactionStatus === 'pending'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="john@example.com"
                    required
                    disabled={transactionStatus === 'pending'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">+265</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-16 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="991234567"
                      required
                      disabled={transactionStatus === 'pending'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                    disabled={transactionStatus === 'pending'}
                  >
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Mpamba">Mpamba</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || transactionStatus === 'pending'}
                className={`w-full mt-8 py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
                  isSubmitting || transactionStatus === 'pending'
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>You'll be prompted to confirm payment via {formData.paymentMethod}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;