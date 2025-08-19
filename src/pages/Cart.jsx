import { useContext, useState } from "react";
import { MdDelete, MdAdd, MdRemove } from "react-icons/md";
import { FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext/cart.context";
import { WishlistContext } from "../context/wishlistContext/wishlist.context";
import { UserContext } from "../context/userContext/user.context";
import toast from "react-hot-toast";

export default function Cart() {
  const {
    cart,
    removeItem,
    updateQuantity,
    getCartTotal,
    isLoading,
    clearCart,
  } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [processingItems, setProcessingItems] = useState(new Set());
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = async (productId, newQuantity) => {
    setProcessingItems((prev) => new Set(prev).add(productId));
    await updateQuantity(productId, newQuantity);
    setProcessingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleRemoveItem = async (productId) => {
    setProcessingItems((prev) => new Set(prev).add(productId));
    await removeItem(productId);
    setProcessingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleMoveToWishlist = async (item) => {
    const success = await addToWishlist(item.productId);
    if (success) {
      await handleRemoveItem(item.productId);
      toast.success("Item moved to wishlist");
    }
  };

  const applyPromoCode = () => {
    if (promoCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
      toast.success("10% discount applied!");
    } else if (promoCode === "SAVE5") {
      setDiscount(5);
      toast.success("$5 discount applied!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    // Simple checkout - redirect to a checkout page or show modal
    toast.success("Redirecting to checkout...");
    // You can implement a simple checkout flow here
    navigate("/checkout");
  };

  if (isLoading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-pulse" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 pt-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FiShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Amazon Cart is empty
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Shop today's deals and discover amazing products
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.productId} className="py-6 flex gap-6">
                    {/* Product Image */}
                    <Link to={`/product/${item.productId}`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-32 h-32 object-contain rounded-lg hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline line-clamp-2 mb-2"
                      >
                        {item.title}
                      </Link>

                      {/* Rating */}
                      {item.rating && (
                        <div className="flex items-center mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.floor(item.rating.rate)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-blue-600">
                            ({item.rating.count})
                          </span>
                        </div>
                      )}

                      <p className="text-green-600 text-sm font-medium mb-4">
                        In Stock
                      </p>

                      {/* Quantity and Actions */}
                      <div className="flex items-center gap-6">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            disabled={
                              processingItems.has(item.productId) ||
                              item.quantity <= 1
                            }
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <MdRemove className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                            {processingItems.has(item.productId)
                              ? "..."
                              : item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            disabled={processingItems.has(item.productId)}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <MdAdd className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Actions */}
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:underline"
                        >
                          <MdDelete className="w-4 h-4" />
                          Delete
                        </button>

                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <FiHeart className="w-4 h-4" />
                          Save for later
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Promo Code */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Promo Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Items ({itemCount}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Order Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Proceed to Buy
              </button>

              {/* Security Info */}
              <div className="mt-4 text-center text-xs text-gray-600">
                <p>🔒 Secure checkout • We protect your payment information</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
