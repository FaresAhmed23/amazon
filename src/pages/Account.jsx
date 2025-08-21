import { useState, useContext } from "react";
import {
  FiUser,
  FiShield,
  FiPackage,
  FiHeart,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext/user.context";
import { CartContext } from "../context/cartContext/cart.context";
import { WishlistContext } from "../context/wishlistContext/wishlist.context";
import { changePassword } from "../utils/api";
import toast from "react-hot-toast";

export default function Account() {
  const { user, logout } = useContext(UserContext);
  const { getCartCount } = useContext(CartContext);
  const { getWishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/Home");
    toast.success("Logged out successfully");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const accountSections = [
    {
      title: "Your Account",
      items: [
        {
          icon: FiUser,
          title: "Your Profile",
          description: "Edit your personal information and preferences",
          link: "/profile",
          action: null,
        },
        {
          icon: FiShield,
          title: "Login & Security",
          description: "Manage your password and security settings",
          link: null,
          action: () => setShowPasswordModal(true),
        },
      ],
    },
    {
      title: "Your Orders",
      items: [
        {
          icon: FiPackage,
          title: "Your Orders",
          description: "Track, return, or buy things again",
          link: "/orders",
          action: null,
        },
        {
          icon: FiHeart,
          title: `Your Wish List (${getWishlistCount()})`,
          description: "View and manage your saved items",
          link: "/wishlist",
          action: null,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Account
              </h1>
              <p className="text-gray-600">
                Hello, {user?.name} - Manage your Amazon experience
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/cart"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Items in Cart</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCartCount()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getWishlistCount()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/orders"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Account Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {accountSections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {section.items.map((item, index) => {
                  const Component = item.link ? Link : "button";
                  const props = item.link
                    ? { to: item.link }
                    : { onClick: item.action, className: "w-full text-left" };

                  return (
                    <Component
                      key={index}
                      {...props}
                      className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${
                        !item.link ? "w-full text-left" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <FiChevronRight className="w-5 h-5 text-gray-400" />
                    </Component>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Change Password
              </h3>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className={`px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium ${
                    changingPassword ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
