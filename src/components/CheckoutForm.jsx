import { useState, useContext } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { FiLock, FiCreditCard } from "react-icons/fi";
import { confirmOrder } from "../utils/api";
import { CartContext } from "../context/cartContext/cart.context";
import toast from "react-hot-toast";

export default function CheckoutForm({
  shippingAddress,
  totals,
  deliveryOption,
  isGift,
  appliedPromo,
  onSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useContext(CartContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment.");
        toast.error("Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful, confirm order with backend
        try {
          const orderResult = await confirmOrder({
            paymentIntentId: paymentIntent.id,
            shippingAddress,
            deliveryOption,
            isGift,
            appliedPromo: appliedPromo?.code,
          });

          if (orderResult.success) {
            // Clear cart and show success
            await clearCart();
            toast.success("Order placed successfully! 🎉");
            onSuccess();

            // Redirect to order confirmation page
            window.location.href = `/orders/${orderResult.order._id}`;
          } else {
            throw new Error("Order confirmation failed");
          }
        } catch (orderError) {
          console.error("Order confirmation error:", orderError);
          toast.error(
            "Payment successful, but order confirmation failed. Please contact support."
          );
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.error("Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Section */}
      <div>
        <div className="flex items-center mb-4">
          <FiCreditCard className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="font-medium text-gray-900">Payment Method</h4>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <PaymentElement
            options={{
              layout: {
                type: "tabs",
                defaultCollapsed: false,
                radios: false,
                spacedAccordionItems: false,
              },
              fields: {
                billingDetails: {
                  name: "auto",
                  email: "auto",
                  phone: "auto",
                  address: {
                    country: "auto",
                    line1: "auto",
                    line2: "auto",
                    city: "auto",
                    state: "auto",
                    postalCode: "auto",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Billing Address</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="billingAddress"
              value="same"
              defaultChecked
              className="mr-2"
            />
            <span>Same as shipping address</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="billingAddress"
              value="different"
              className="mr-2"
            />
            <span>Use a different billing address</span>
          </label>
        </div>
      </div>

      {/* Order Review */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Order Review</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${totals.itemsTotal.toFixed(2)}</span>
          </div>
          {appliedPromo && totals.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedPromo.code}):</span>
              <span>-${totals.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>
              {totals.shippingCost === 0
                ? "FREE"
                : `$${totals.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${totals.taxAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-blue-900">
            I agree to the{" "}
            <a
              href="/terms"
              className="underline hover:no-underline"
              target="_blank"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline hover:no-underline"
              target="_blank"
            >
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center ${
          isLoading || !stripe || !elements
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 text-black"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center">
            <FiLock className="w-4 h-4 mr-2" />
            Complete Order - ${totals.total.toFixed(2)}
          </div>
        )}
      </button>

      {/* Security Notice */}
      <div className="text-center text-xs text-gray-500">
        <div className="flex items-center justify-center mb-1">
          <FiLock className="w-3 h-3 mr-1" />
          <span>Your payment information is secure and encrypted</span>
        </div>
        <p>Powered by Stripe • PCI DSS Compliant</p>
      </div>
    </form>
  );
}
