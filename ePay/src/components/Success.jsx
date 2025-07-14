import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl text-center max-w-md w-full transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full animate-bounce">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-green-600 mb-4">
          Payment Successful!
        </h2>
        
        <p className="text-gray-600 mb-6 text-lg">
          Thank you for subscribing to ePay. Your account has been upgraded successfully.
        </p>
        
        <div className="bg-green-50 p-4 rounded-lg mb-8 border border-green-100">
          <p className="text-sm text-green-700">
            A confirmation email has been sent to your registered address.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Go to Dashboard
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          Need help? <a href="#" className="text-green-600 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default Success;