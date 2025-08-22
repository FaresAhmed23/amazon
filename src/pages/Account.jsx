import { useState, useContext } from "react";
import {
  FiUser,
  FiShield,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiChevronRight,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiCheck,
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
  const [passwordErrors, setPasswordErrors] = useState({});
  const [touchedPassword, setTouchedPassword] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  const validatePasswordField = (name, value) => {
    const newErrors = { ...passwordErrors };

    switch (name) {
      case "currentPassword":
        if (!value) {
          newErrors.currentPassword = "Current password is required";
        } else {
          delete newErrors.currentPassword;
        }
        break;

      case "newPassword":
        if (!value) {
          newErrors.newPassword = "New password is required";
        } else if (value.length < 8) {
          newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!passwordRegex.test(value)) {
          newErrors.newPassword =
            "Password must contain uppercase, lowercase, and number";
        } else if (passwordData.currentPassword === value) {
          newErrors.newPassword =
            "New password must be different from current password";
        } else {
          delete newErrors.newPassword;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (passwordData.newPassword !== value) {
          newErrors.confirmPassword = "Passwords don't match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation for touched fields
    if (touchedPassword[name]) {
      validatePasswordField(name, value);
    }

    // Also validate confirm password when new password changes
    if (name === "newPassword" && touchedPassword.confirmPassword) {
      validatePasswordField("confirmPassword", passwordData.confirmPassword);
    }
  };

  const handlePasswordBlur = (e) => {
    const { name, value } = e.target;
    setTouchedPassword((prev) => ({ ...prev, [name]: true }));
    validatePasswordField(name, value);
  };

  const getPasswordError = (fieldName) => {
    return touchedPassword[fieldName] && passwordErrors[fieldName];
  };

  const getPasswordFieldClasses = (fieldName) => {
    const baseClasses =
      "w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:outline-none";
    const hasError = getPasswordError(fieldName);
    const isValid =
      touchedPassword[fieldName] &&
      !passwordErrors[fieldName] &&
      passwordData[fieldName];

    if (hasError) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
    } else if (isValid) {
      return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }
    return `${baseClasses} border-gray-300 focus:ring-yellow-500 focus:border-yellow-500`;
  };

  const handleLogout = () => {
    logout();
    navigate("/Home");
    toast.success("Logged out successfully");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    };
    setTouchedPassword(allTouched);

    // Validate all fields
    let isValid = true;
    Object.keys(passwordData).forEach((key) => {
      if (!validatePasswordField(key, passwordData[key])) {
        isValid = false;
      }
    });

    if (!isValid) {
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
      setPasswordErrors({});
      setTouchedPassword({});
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

  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-500",
    "bg-green-500",
  ];
  const isPasswordFormValid =
    Object.keys(passwordErrors).length === 0 &&
    Object.keys(passwordData).every((key) => passwordData[key]);

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

      {/* Enhanced Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Change Password
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose a strong password to keep your account secure
              </p>
            </div>

            <form
              onSubmit={handlePasswordChange}
              className="p-6 space-y-4"
              noValidate
            >
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={handlePasswordBlur}
                    className={getPasswordFieldClasses("currentPassword")}
                    placeholder="Enter current password"
                    aria-invalid={!!getPasswordError("currentPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {getPasswordError("currentPassword") && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={handlePasswordBlur}
                    className={getPasswordFieldClasses("newPassword")}
                    placeholder="Enter new password"
                    aria-invalid={!!getPasswordError("newPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        Password strength:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          passwordStrength <= 2
                            ? "text-red-600"
                            : passwordStrength === 3
                            ? "text-yellow-600"
                            : passwordStrength === 4
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {strengthLabels[passwordStrength - 1] || "Very Weak"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          strengthColors[Math.min(passwordStrength - 1, 4)] ||
                          "bg-red-500"
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Password must contain:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li
                      className={`flex items-center ${
                        passwordData.newPassword.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <FiCheck
                        className={`w-3 h-3 mr-1 ${
                          passwordData.newPassword.length >= 8
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${
                        /[a-z]/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <FiCheck
                        className={`w-3 h-3 mr-1 ${
                          /[a-z]/.test(passwordData.newPassword)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      One lowercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[A-Z]/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <FiCheck
                        className={`w-3 h-3 mr-1 ${
                          /[A-Z]/.test(passwordData.newPassword)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /\d/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <FiCheck
                        className={`w-3 h-3 mr-1 ${
                          /\d/.test(passwordData.newPassword)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      One number
                    </li>
                  </ul>
                </div>

                {getPasswordError("newPassword") && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={handlePasswordBlur}
                    className={getPasswordFieldClasses("confirmPassword")}
                    placeholder="Confirm new password"
                    aria-invalid={!!getPasswordError("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {/* Password match indicator */}
                  {passwordData.confirmPassword && passwordData.newPassword && (
                    <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                      {passwordData.newPassword ===
                      passwordData.confirmPassword ? (
                        <FiCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <FiAlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {getPasswordError("confirmPassword") && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Form validation summary */}
              {!isPasswordFormValid &&
                Object.keys(touchedPassword).length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-2" />
                      Please fix the errors above before changing your password.
                    </p>
                  </div>
                )}

              {/* Security Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Security Tip:</strong> Choose a unique password that
                  you don't use elsewhere. Consider using a password manager to
                  generate and store strong passwords.
                </p>
              </div>

              {/* Action Buttons */}
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
                    setPasswordErrors({});
                    setTouchedPassword({});
                    setShowCurrentPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword || !isPasswordFormValid}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    changingPassword || !isPasswordFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black"
                  }`}
                >
                  {changingPassword ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Changing...
                    </div>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
