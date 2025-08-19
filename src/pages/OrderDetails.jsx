import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { getOrderById, getProductById } from "../utils/api";
import toast from "react-hot-toast";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const orderData = await getOrderById(id);

      // Enrich order items with product details
      const enrichedItems = await Promise.all(
        orderData.items.map(async (item) => {
          try {
            const product = await getProductById(item.productId);
            return {
              ...item,
              title: product.title,
              image: product.image,
              price: product.price,
              category: product.category,
            };
          } catch (error) {
            return {
              ...item,
              title: `Product ${item.productId}`,
              image: "/placeholder.png",
              price: 0,
              category: "Unknown",
            };
          }
        })
      );

      setOrder({
        ...orderData,
        items: enrichedItems,
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const allStatuses = [
      { key: "pending", label: "Order Placed", icon: FiCheck },
      { key: "processing", label: "Processing", icon: FiPackage },
      { key: "shipped", label: "Shipped", icon: FiTruck },
      { key: "delivered", label: "Delivered", icon: FiCheck },
    ];

    const currentIndex = allStatuses.findIndex((s) => s.key === currentStatus);

    return allStatuses.map((status, index) => ({
      ...status,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-pulse" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order not found
          </h1>
          <Link to="/orders" className="text-blue-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order._id.slice(-8)}
                </h1>
                <p className="text-gray-600">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items?.length || 0} items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Status
              </h2>

              <div className="relative">
                {statusSteps.map((step, index) => (
                  <div
                    key={step.key}
                    className="flex items-center mb-8 last:mb-0"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-100 text-green-600"
                          : step.current
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>

                    <div className="ml-4 flex-1">
                      <p
                        className={`font-medium ${
                          step.completed || step.current
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.current && (
                        <p className="text-sm text-blue-600 mt-1">
                          Current status
                        </p>
                      )}
                    </div>

                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-5 mt-10 w-px h-8 ${
                          step.completed ? "bg-green-200" : "bg-gray-200"
                        }`}
                        style={{ top: `${index * 64 + 40}px` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Items
              </h2>

              <div className="divide-y divide-gray-200">
                {order.items?.map((item, index) => (
                  <div key={index} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title || "Product"}
                        className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.title || `Product ${item.productId}`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Category: {item.category || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${(item.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${order.totalPrice?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.user?.name || "Customer"}
                </p>
                <p>{order.shippingAddress?.street || "123 Main Street"}</p>
                <p>
                  {order.shippingAddress?.city || "Cairo"},{" "}
                  {order.shippingAddress?.state || "Cairo Governorate"}
                </p>
                <p>{order.shippingAddress?.zipCode || "12345"}</p>
                <p>{order.shippingAddress?.country || "Egypt"}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FiMail className="w-4 h-4 mr-3" />
                  <span>{order.user?.email || "customer@example.com"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiPhone className="w-4 h-4 mr-3" />
                  <span>{order.user?.phone || "+20 123 456 7890"}</span>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-medium transition-colors">
                  Track Package
                </button>

                {order.status === "delivered" && (
                  <>
                    <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                      Return Items
                    </button>
                    <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                      Leave Review
                    </button>
                  </>
                )}

                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                  Download Invoice
                </button>

                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                  Contact Support
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <FiCreditCard1 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {order.paymentMethod || "Credit Card"}
                  </p>
                  <p className="text-gray-600">****1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
