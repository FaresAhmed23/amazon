import React from "react";
import { FiShoppingCart } from "react-icons/fi";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <FiShoppingCart className="w-16 h-16 mx-auto text-yellow-400 mb-4 animate-bounce" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
        <p className="text-gray-600">
          Please wait while we prepare your shopping experience
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
