import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiCreditCard, FiMapPin, FiTruck } from "react-icons/fi";
import { CartContext } from "../context/cartContext/cart.context";
import { UserContext } from "../context/userContext/user.context";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Calculate totals
  const subtotal = getCartTotal();
  const shippingCost =
    deliveryOption === "express"
      ? 9.99
      : deliveryOption === "same-day"
      ? 19.99
      : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(
        "https://nodejs2323.vercel.app/api/orders/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            shippingAddress,
            paymentMethod: `${paymentMethod} (Fake)`,
            deliveryOption,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await clearCart();
        toast.success("Order placed successfully! 🎉");
        navigate("/order-success");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit}>
              {/* Delivery Options */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FiTruck className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold">Delivery Options</h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      value: "standard",
                      label: "Standard Delivery",
                      price: 0,
                      time: "5-7 business days",
                    },
                    {
                      value: "express",
                      label: "Express Delivery",
                      price: 9.99,
                      time: "2-3 business days",
                    },
                    {
                      value: "same-day",
                      label: "Same Day Delivery",
                      price: 19.99,
                      time: "Today by 9 PM",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.value}
                          checked={deliveryOption === option.value}
                          onChange={(e) => setDeliveryOption(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-gray-600">{option.time}</p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        {option.price === 0
                          ? "FREE"
                          : `$${option.price.toFixed(2)}`}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FiMapPin className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    required
                    className="md:col-span-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP/Postal Code"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Egypt">Egypt</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FiCreditCard className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold">
                    Payment Method (Demo)
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { value: "credit-card", label: "Credit/Debit Card" },
                    { value: "paypal", label: "PayPal" },
                    { value: "apple-pay", label: "Apple Pay" },
                    { value: "google-pay", label: "Google Pay" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <FiLock className="inline w-4 h-4 mr-1" />
                    This is a demo checkout. No actual payment will be
                    processed.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-black"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                    Processing Order...
                  </div>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {cart.slice(0, 3).map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain bg-gray-50 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                {cart.length > 3 && (
                  <p className="text-sm text-gray-600 text-center">
                    +{cart.length - 3} more items
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>
                    Subtotal (
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items):
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>
                    {shippingCost === 0
                      ? "FREE"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
