import { useContext, useState } from "react";
import { MdDelete, MdAdd, MdRemove } from "react-icons/md";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiPercent,
  FiLock,
} from "react-icons/fi";
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
      setPromoCode("");
    } else if (promoCode === "SAVE5") {
      setDiscount(5);
      toast.success("$5 discount applied!");
      setPromoCode("");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const removeDiscount = () => {
    setDiscount(0);
    toast.success("Discount removed");
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    toast.success("Redirecting to checkout...");
    navigate("/checkout");
  };

  if (isLoading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FiShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 pt-6 sm:pt-8">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <FiShoppingCart className="w-16 sm:w-24 h-16 sm:h-24 mx-auto text-gray-300 mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your Amazon Cart is empty
            </h1>
            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
              Shop today's deals and discover amazing products
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 sm:px-8 py-3 rounded-lg font-medium text-base sm:text-lg transition-colors"
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
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-sm text-gray-600">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:underline text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <div key={item.productId} className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      {/* Product Info Row */}
                      <div className="flex gap-3 mb-3">
                        <Link
                          to={`/product/${item.productId}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline line-clamp-3 mb-2"
                          >
                            {item.title}
                          </Link>

                          {/* Rating - Mobile */}
                          {item.rating && (
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FiStar
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= Math.floor(item.rating.rate)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-1 text-xs text-blue-600">
                                ({item.rating.count})
                              </span>
                            </div>
                          )}

                          <p className="text-green-600 text-xs font-medium mb-1">
                            In Stock
                          </p>

                          {/* Price - Mobile */}
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity and Actions Row - Mobile */}
                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
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
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg"
                          >
                            <MdRemove className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 border-l border-r border-gray-300 min-w-[2.5rem] text-center text-sm font-medium">
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
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg"
                          >
                            <MdAdd className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                          >
                            <MdDelete className="w-4 h-4" />
                            <span className="hidden xs:inline">Delete</span>
                          </button>

                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <FiHeart className="w-4 h-4" />
                            <span className="hidden xs:inline">Save</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex gap-6">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.productId}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-32 h-32 object-contain rounded-lg hover:scale-105 transition-transform bg-gray-50 p-2"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
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
                          <div className="flex items-center border border-gray-300 rounded-lg">
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
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg"
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
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg"
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-4">
              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiPercent className="w-4 h-4 text-gray-600" />
                  <h3 className="font-medium">Promo Code</h3>
                </div>

                {discount > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Discount Applied!
                        </p>
                        <p className="text-xs text-green-600">
                          Save ${discount.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={removeDiscount}
                        className="text-green-600 hover:text-green-700"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code (SAVE10, SAVE5)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Items ({itemCount}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold">
                      Order Total:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-4 rounded-lg font-medium text-base sm:text-lg transition-colors mb-4"
              >
                Proceed to Buy ({itemCount} items)
              </button>

              {/* Security Info */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                  <FiLock className="w-3 h-3" />
                  <span>Secure checkout</span>
                </div>
                <p className="text-xs text-gray-600">
                  We protect your payment information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
