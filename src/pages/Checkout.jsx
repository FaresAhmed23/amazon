import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiCreditCard,
  FiMapPin,
  FiTruck,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { CartContext } from "../context/cartContext/cart.context";
import { UserContext } from "../context/userContext/user.context";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  // Validation patterns
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  const phoneRegex = /^(\+?20)?(01)[0125][0-9]{8}$/;
  const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/;

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Full name is required";
        } else if (!nameRegex.test(value.trim())) {
          newErrors.name = "Please enter a valid name";
        } else {
          delete newErrors.name;
        }
        break;

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
          newErrors.phone = "Please enter a valid phone number";
        } else {
          delete newErrors.phone;
        }
        break;

      case "street":
        if (!value.trim()) {
          newErrors.street = "Street address is required";
        } else if (value.trim().length < 5) {
          newErrors.street = "Please enter a complete address";
        } else {
          delete newErrors.street;
        }
        break;

      case "city":
        if (!value.trim()) {
          newErrors.city = "City is required";
        } else if (value.trim().length < 2) {
          newErrors.city = "Please enter a valid city";
        } else {
          delete newErrors.city;
        }
        break;

      case "state":
        if (!value.trim()) {
          newErrors.state = "State is required";
        } else if (value.trim().length < 2) {
          newErrors.state = "Please enter a valid state";
        } else {
          delete newErrors.state;
        }
        break;

      case "zipCode":
        if (!value.trim()) {
          newErrors.zipCode = "ZIP code is required";
        } else if (!zipRegex.test(value.trim())) {
          newErrors.zipCode =
            "Please enter a valid ZIP code (12345 or 12345-6789)";
        } else {
          delete newErrors.zipCode;
        }
        break;

      case "country":
        if (!value) {
          newErrors.country = "Country is required";
        } else {
          delete newErrors.country;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input based on field type
    let sanitizedValue = value;
    if (name === "name") {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "phone") {
      sanitizedValue = value.replace(/[^+\d\s-()]/g, "");
    } else if (name === "zipCode") {
      sanitizedValue = value.replace(/[^0-9-]/g, "");
    }

    setShippingAddress({
      ...shippingAddress,
      [name]: sanitizedValue,
    });

    // Real-time validation for touched fields
    if (touched[name]) {
      validateField(name, sanitizedValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(shippingAddress).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    let isValid = true;
    Object.keys(shippingAddress).forEach((key) => {
      if (!validateField(key, shippingAddress[key])) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error("Please fix the errors below before proceeding");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

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
            paymentMethod: `${paymentMethod} (Demo)`,
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

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const getFieldClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-2 border rounded-lg focus:outline-none";
    const hasError = getFieldError(fieldName);
    const isValid =
      touched[fieldName] && !errors[fieldName] && shippingAddress[fieldName];

    if (hasError) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
    } else if (isValid) {
      return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }

    return `${baseClasses} border-gray-300 focus:ring-2 focus:ring-yellow-500`;
  };

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

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.keys(shippingAddress).every(
      (key) => shippingAddress[key].toString().trim() !== ""
    ) &&
    paymentMethod;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} noValidate>
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
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={shippingAddress.name}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      className={getFieldClasses("name")}
                      maxLength={50}
                      aria-invalid={!!getFieldError("name")}
                    />
                    {getFieldError("name") ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      touched.name &&
                      shippingAddress.name &&
                      !errors.name && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      )
                    )}
                    {getFieldError("name") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      className={getFieldClasses("phone")}
                      aria-invalid={!!getFieldError("phone")}
                    />
                    {getFieldError("phone") ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      touched.phone &&
                      shippingAddress.phone &&
                      !errors.phone && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      )
                    )}
                    {getFieldError("phone") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 relative">
                    <input
                      type="text"
                      name="street"
                      placeholder="Street Address *"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      className={getFieldClasses("street")}
                      maxLength={100}
                      aria-invalid={!!getFieldError("street")}
                    />
                    {getFieldError("street") ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      touched.street &&
                      shippingAddress.street &&
                      !errors.street && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      )
                    )}
                    {getFieldError("street") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      className={getFieldClasses("city")}
                      maxLength={50}
                      aria-invalid={!!getFieldError("city")}
                    />
                    {getFieldError("city") ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      touched.city &&
                      shippingAddress.city &&
                      !errors.city && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      )
                    )}
                    {getFieldError("city") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="state"
                      placeholder="State/Province *"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      className={getFieldClasses("state")}
                      maxLength={50}
                      aria-invalid={!!getFieldError("state")}
                    />
                    {getFieldError("state") ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      touched.state &&
                      shippingAddress.state &&
                      !errors.state && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      )
                    )}
                    {getFieldError("state") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP/Postal Code *"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      className={getFieldClasses("zipCode")}
                      maxLength={10}
                      aria-invalid={!!getFieldError("zipCode")}
                    />
                    {getFieldError("zipCode") ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      touched.zipCode &&
                      shippingAddress.zipCode &&
                      !errors.zipCode && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      )
                    )}
                    {getFieldError("zipCode") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      onBlur={handleBlur}
                      className={getFieldClasses("country")}
                      aria-invalid={!!getFieldError("country")}
                    >
                      <option value="">Select Country *</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Egypt">Egypt</option>
                    </select>
                    {getFieldError("country") && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.country}
                      </p>
                    )}
                  </div>
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
                    {
                      value: "credit-card",
                      label: "Credit/Debit Card",
                      icon: "💳",
                    },
                    { value: "paypal", label: "PayPal", icon: "🟦" },
                    { value: "apple-pay", label: "Apple Pay", icon: "🍎" },
                    { value: "google-pay", label: "Google Pay", icon: "🟢" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        paymentMethod === option.value
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="mr-2 text-lg">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center">
                    <FiLock className="inline w-4 h-4 mr-2" />
                    This is a demo checkout. No actual payment will be
                    processed.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                {!isFormValid && Object.keys(touched).length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-2" />
                      Please complete all required fields and fix any errors
                      before placing your order.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing || !isFormValid}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                    isProcessing || !isFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
              </div>
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

              {/* Security Badge */}
              <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 flex items-center">
                  <FiLock className="w-4 h-4 mr-2" />
                  Your order is secured with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
