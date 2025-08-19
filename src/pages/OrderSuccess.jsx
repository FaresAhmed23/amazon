import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheck, FiPackage, FiTruck, FiMail, FiHome } from "react-icons/fi";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // You could fetch order details here if needed
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus === "succeeded") {
      // Order was successful
      setOrderDetails({
        paymentIntent,
        status: "succeeded",
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and is
            being processed.
          </p>

          {/* Order Timeline */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What happens next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <FiCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Order Confirmed</p>
                  <p className="text-sm text-gray-600">
                    Your payment has been processed
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FiPackage className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Processing</p>
                  <p className="text-sm text-gray-600">
                    We're preparing your items for shipment
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <FiTruck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Shipped</p>
                  <p className="text-sm text-gray-600">
                    You'll receive tracking information
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <FiMail className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">Enjoy your purchase!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-medium transition-colors"
            >
              View Order Details
            </Link>
            <Link
              to="/products"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Order Updates
                </h3>
                <p className="text-sm text-gray-600">
                  We'll send you email updates about your order status and
                  tracking information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600">
                  Contact our customer service team if you have any questions
                  about your order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline"
          >
            <FiHome className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
