import { useState, useContext } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { FiX, FiLock, FiCreditCard, FiMapPin } from "react-icons/fi";
import { UserContext } from "../context/userContext/user.context";

const stripePromise = loadStripe(
  "pk_test_51RZ66CRuAn8xgsfs4yB7flJ7zQnX7V73ED5vws1qbui4wsSMg3vgOE02OCzVYZqi5ZW3CofzNsOKuAeWcZluqYFH00JH2i5iGR"
);

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totals,
  deliveryOption,
  isGift,
  appliedPromo,
}) {
  const { user } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "Egypt",
    phone: user?.phone || "",
  });

  if (!isOpen) return null;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const options = {
    mode: "payment",
    amount: Math.round(totals.total * 100),
    currency: "usd",
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#fbbf24",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#dc2626",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiLock className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Secure Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {[
              { step: 1, title: "Shipping", icon: FiMapPin },
              { step: 2, title: "Payment", icon: FiCreditCard },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= item.step
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <span
                  className={`ml-2 font-medium ${
                    currentStep >= item.step ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </span>
                {index < 1 && (
                  <div
                    className={`mx-4 flex-1 h-0.5 ${
                      currentStep > item.step ? "bg-yellow-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {currentStep === 1 ? (
              /* Shipping Address Form */
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Shipping Address
                </h3>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingAddress.name}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="Egypt">Egypt</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Payment Form */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Payment Information
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
                  >
                    Edit Shipping Address
                  </button>
                </div>

                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    shippingAddress={shippingAddress}
                    totals={totals}
                    deliveryOption={deliveryOption}
                    isGift={isGift}
                    appliedPromo={appliedPromo}
                    onSuccess={onClose}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-80 bg-gray-50 p-6 border-l border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

            {/* Items */}
            <div className="space-y-3 mb-6">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-contain bg-white rounded border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              {cartItems.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  +{cartItems.length - 3} more items
                </p>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 border-t border-gray-300 pt-4">
              <div className="flex justify-between text-sm">
                <span>Items ({totals.itemCount}):</span>
                <span>${totals.itemsTotal.toFixed(2)}</span>
              </div>

              {appliedPromo && totals.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedPromo.code}):</span>
                  <span>-${totals.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  {totals.shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    `$${totals.shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${totals.taxAmount.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-lg">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">
                Delivery Information
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Option:</strong>{" "}
                  {deliveryOption === "standard"
                    ? "FREE Standard Delivery"
                    : deliveryOption === "express"
                    ? "Express Delivery"
                    : "Same Day Delivery"}
                </p>
                <p>
                  <strong>Estimate:</strong>{" "}
                  {deliveryOption === "standard"
                    ? "March 15-20"
                    : deliveryOption === "express"
                    ? "March 12-13"
                    : "Today by 9 PM"}
                </p>
                {isGift && (
                  <p className="text-green-600">
                    <strong>Gift:</strong> Gift options will be available
                  </p>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
              <FiLock className="w-4 h-4 mr-1" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
