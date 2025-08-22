import { useState, useEffect, useContext } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiEye,
  FiShoppingCart,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { getOrders, getProductById } from "../utils/api";
import { CartContext } from "../context/cartContext/cart.context";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [buyingAgain, setBuyingAgain] = useState(new Set());

  // Add CartContext
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();

      // Enrich orders with product details
      const enrichedOrders = await Promise.all(
        data.map(async (order) => {
          const enrichedItems = await Promise.all(
            order.items.map(async (item) => {
              try {
                const product = await getProductById(item.productId);
                return {
                  ...item,
                  title: product.title,
                  image: product.image,
                  price: product.price,
                  category: product.category,
                  rating: product.rating,
                };
              } catch (error) {
                return {
                  ...item,
                  title: `Product ${item.productId}`,
                  image: "/placeholder.png",
                  price: 0,
                };
              }
            })
          );
          return {
            ...order,
            items: enrichedItems,
          };
        })
      );

      setOrders(enrichedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle Buy Again functionality
  const handleBuyAgain = async (order) => {
    setBuyingAgain((prev) => new Set(prev).add(order._id));

    try {
      let successCount = 0;
      let failCount = 0;
      const totalItems = order.items.length;

      // Show loading toast
      const loadingToast = toast.loading(
        `Adding ${totalItems} item${totalItems > 1 ? "s" : ""} to cart...`
      );

      // Add each item to cart
      for (const item of order.items) {
        try {
          const success = await addToCart(item.productId, item.quantity);
          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Failed to add item ${item.productId} to cart:`, error);
          failCount++;
        }
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show result toast
      if (successCount === totalItems) {
        toast.success(
          <div className="flex items-center space-x-2">
            <FiShoppingCart className="w-5 h-5" />
            <div>
              <p className="font-semibold">All items added to cart!</p>
              <p className="text-sm text-gray-600">
                {successCount} item{successCount > 1 ? "s" : ""} from order #
                {order._id.slice(-8)}
              </p>
            </div>
          </div>,
          { duration: 4000 }
        );
      } else if (successCount > 0) {
        toast.success(
          <div>
            <p className="font-semibold">Partially added to cart</p>
            <p className="text-sm text-gray-600">
              {successCount} of {totalItems} items added successfully
            </p>
          </div>,
          { duration: 4000 }
        );
      } else {
        toast.error("Failed to add items to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error in buy again:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBuyingAgain((prev) => {
        const newSet = new Set(prev);
        newSet.delete(order._id);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <FiPackage className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <FiTruck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <FiCheck className="w-5 h-5 text-green-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "processing":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "shipped":
        return "text-purple-600 bg-purple-100 border-purple-200";
      case "delivered":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const filteredOrders = orders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-pulse" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Orders</h1>

          {/* Filter tabs */}
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 w-fit">
            {[
              { key: "all", label: "All Orders" },
              { key: "pending", label: "Pending" },
              { key: "processing", label: "Processing" },
              { key: "shipped", label: "Shipped" },
              { key: "delivered", label: "Delivered" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filterStatus === filter.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FiPackage className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filterStatus === "all"
                ? "No orders yet"
                : `No ${filterStatus} orders`}
            </h2>
            <p className="text-gray-600 mb-8">
              {filterStatus === "all"
                ? "Start shopping to see your orders here"
                : `You don't have any ${filterStatus} orders`}
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="p-6">
                  <div className="grid gap-4">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.title || "Product"}
                          className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.title || `Product ${item.productId}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${((item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items?.length > 3 && (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-600">
                          +{order.items.length - 3} more items
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order actions */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                    <div className="flex space-x-3">
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                      {order.status === "delivered" && (
                        <button className="text-blue-600 hover:text-blue-700 hover:underline">
                          Write Review
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Track Order
                      </button>
                      {order.status === "delivered" && (
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Return Items
                        </button>
                      )}
                      <button
                        onClick={() => handleBuyAgain(order)}
                        disabled={buyingAgain.has(order._id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                          buyingAgain.has(order._id)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-yellow-400 hover:bg-yellow-500 text-black"
                        }`}
                      >
                        {buyingAgain.has(order._id) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <FiShoppingCart className="w-4 h-4" />
                            <span>Buy Again</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
