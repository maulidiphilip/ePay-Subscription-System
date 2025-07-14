import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      price: 5000,
      description: 'Access to core features, perfect for small businesses.',
      features: ['Online Payments', 'Basic Support', '1 User'],
      popular: false,
    },
    {
      name: 'Premium',
      price: 10000,
      description: 'Full access with premium support for growing businesses.',
      features: ['All Basic Features', 'Priority Support', 'Up to 5 Users', 'Advanced Analytics'],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Flexible pricing for businesses of all sizes. Pay via Mpamba, Airtel Money, or Card.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                plan.popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="bg-white p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <p className="text-4xl font-extrabold text-gray-900">
                    MWK {plan.price.toLocaleString()}
                  </p>
                  <p className="text-gray-500 mt-1">per month</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/checkout', { state: { plan } })}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          Need help choosing? <a href="#" className="text-blue-600 hover:underline">Contact us</a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;