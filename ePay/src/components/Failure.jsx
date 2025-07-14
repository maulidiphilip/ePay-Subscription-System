import React from 'react';
import { useNavigate } from 'react-router-dom';

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl text-center max-w-md w-full transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-red-600 mb-4">
          Payment Failed
        </h2>
        
        <p className="text-gray-600 mb-6 text-lg">
          We couldn't process your payment. Please try again or contact support.
        </p>
        
        <div className="bg-red-50 p-4 rounded-lg mb-8 border border-red-100">
          <p className="text-sm text-red-700">
            No funds were deducted from your account.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)} // Go back to checkout
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
        
        <p className="mt-4 text-sm text-gray-500">
          Still having trouble? <a href="#" className="text-red-600 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default Failure;