import { useState, useEffect, useContext } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiCamera,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { getUserProfile, updateUserProfile } from "../utils/api";
import { UserContext } from "../context/userContext/user.context";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, login } = useContext(UserContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Egypt",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      currency: "USD",
      language: "en",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation patterns
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+?20)?(01)[0125][0-9]{8}$/;
  const addressRegex = /^[a-zA-Z0-9\s,.-]{5,100}$/;
  const cityRegex = /^[a-zA-Z\s]{2,50}$/;
  const stateRegex = /^[a-zA-Z\s]{2,50}$/;
  const zipCodeRegex = /^[0-9]{5}(-[0-9]{4})?$/;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else if (!nameRegex.test(value.trim())) {
          newErrors.name = "Name can only contain letters and spaces";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
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

      case "address.street":
        if (!value.trim()) {
          newErrors["address.street"] = "Street address is required";
        } else if (value.trim().length < 5) {
          newErrors["address.street"] = "Please enter a complete address";
        } else if (!addressRegex.test(value.trim())) {
          newErrors["address.street"] = "Please enter a valid address";
        } else {
          delete newErrors["address.street"];
        }
        break;

      case "address.city":
        if (!value.trim()) {
          newErrors["address.city"] = "City is required";
        } else if (!cityRegex.test(value.trim())) {
          newErrors["address.city"] = "Please enter a valid city name";
        } else {
          delete newErrors["address.city"];
        }
        break;

      case "address.state":
        if (!value.trim()) {
          newErrors["address.state"] = "State is required";
        } else if (!stateRegex.test(value.trim())) {
          newErrors["address.state"] = "Please enter a valid state";
        } else {
          delete newErrors["address.state"];
        }
        break;

      case "address.zipCode":
        if (!value.trim()) {
          newErrors["address.zipCode"] = "ZIP code is required";
        } else if (!zipCodeRegex.test(value.trim())) {
          newErrors["address.zipCode"] =
            "Please enter a valid ZIP code (12345 or 12345-6789)";
        } else {
          delete newErrors["address.zipCode"];
        }
        break;

      case "address.country":
        if (!value) {
          newErrors["address.country"] = "Country is required";
        } else {
          delete newErrors["address.country"];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Sanitize input based on field type
    let sanitizedValue = value;
    if (name === "name") {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "phone") {
      sanitizedValue = value.replace(/[^+\d\s-()]/g, "");
    } else if (name === "address.zipCode") {
      sanitizedValue = value.replace(/[^0-9-]/g, "");
    } else if (name === "address.city" || name === "address.state") {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : sanitizedValue,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : sanitizedValue,
      }));
    }

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

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const getFieldClasses = (fieldName) => {
    const baseClasses =
      "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none";
    const hasError = getFieldError(fieldName);
    const isValid =
      touched[fieldName] &&
      !errors[fieldName] &&
      getNestedValue(profile, fieldName);

    if (hasError) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
    } else if (isValid) {
      return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }
    return `${baseClasses} border-gray-300 focus:ring-yellow-500 focus:border-yellow-500`;
  };

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((current, key) => current && current[key], obj);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all required fields as touched
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address.street",
      "address.city",
      "address.state",
      "address.zipCode",
      "address.country",
    ];
    const allTouched = {};

    requiredFields.forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all required fields
    let isValid = true;
    requiredFields.forEach((field) => {
      const value = getNestedValue(profile, field);
      if (!validateField(field, value || "")) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);

    try {
      const response = await updateUserProfile(profile);

      // Update user context with new data
      const token = localStorage.getItem("token");
      login(token, response.user);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-pulse" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="p-6 space-y-8">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="w-12 h-12 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 shadow-sm"
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.name}
                  </h3>
                  <p className="text-gray-600">{profile.email}</p>
                  <button
                    type="button"
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`pl-10 ${getFieldClasses("name")}`}
                        placeholder="Enter your full name"
                        maxLength={50}
                        aria-invalid={!!getFieldError("name")}
                      />
                      {getFieldError("name") ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched.name &&
                        profile.name &&
                        !errors.name && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("name") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`pl-10 ${getFieldClasses("email")}`}
                        placeholder="Enter your email"
                        aria-invalid={!!getFieldError("email")}
                      />
                      {getFieldError("email") ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched.email &&
                        profile.email &&
                        !errors.email && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("email") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`pl-10 ${getFieldClasses("phone")}`}
                        placeholder="Enter your phone number"
                        aria-invalid={!!getFieldError("phone")}
                      />
                      {getFieldError("phone") ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched.phone &&
                        profile.phone &&
                        !errors.phone && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("phone") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        name="address.street"
                        value={profile.address?.street || ""}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        rows={3}
                        className={`pl-10 ${getFieldClasses("address.street")}`}
                        placeholder="Enter your street address"
                        maxLength={100}
                        aria-invalid={!!getFieldError("address.street")}
                      />
                      {getFieldError("address.street") ? (
                        <div className="absolute top-3 right-3 pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched["address.street"] &&
                        profile.address?.street &&
                        !errors["address.street"] && (
                          <div className="absolute top-3 right-3 pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("address.street") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors["address.street"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address.city"
                        value={profile.address?.city || ""}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={getFieldClasses("address.city")}
                        placeholder="Enter your city"
                        maxLength={50}
                        aria-invalid={!!getFieldError("address.city")}
                      />
                      {getFieldError("address.city") ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched["address.city"] &&
                        profile.address?.city &&
                        !errors["address.city"] && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("address.city") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors["address.city"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address.state"
                        value={profile.address?.state || ""}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={getFieldClasses("address.state")}
                        placeholder="Enter your state"
                        maxLength={50}
                        aria-invalid={!!getFieldError("address.state")}
                      />
                      {getFieldError("address.state") ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched["address.state"] &&
                        profile.address?.state &&
                        !errors["address.state"] && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("address.state") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors["address.state"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address.zipCode"
                        value={profile.address?.zipCode || ""}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={getFieldClasses("address.zipCode")}
                        placeholder="Enter ZIP code"
                        maxLength={10}
                        aria-invalid={!!getFieldError("address.zipCode")}
                      />
                      {getFieldError("address.zipCode") ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched["address.zipCode"] &&
                        profile.address?.zipCode &&
                        !errors["address.zipCode"] && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("address.zipCode") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors["address.zipCode"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="address.country"
                        value={profile.address?.country || "Egypt"}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={getFieldClasses("address.country")}
                        aria-invalid={!!getFieldError("address.country")}
                      >
                        <option value="">Select Country</option>
                        <option value="Egypt">Egypt</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                      {getFieldError("address.country") ? (
                        <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        touched["address.country"] &&
                        profile.address?.country &&
                        !errors["address.country"] && (
                          <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )
                      )}
                    </div>
                    {getFieldError("address.country") && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors["address.country"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="preferences.currency"
                      value={profile.preferences?.currency || "USD"}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="EGP">EGP - Egyptian Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      name="preferences.language"
                      value={profile.preferences?.language || "en"}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Notification Preferences
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="preferences.emailNotifications"
                        checked={
                          profile.preferences?.emailNotifications || false
                        }
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Email notifications for orders and promotions
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="preferences.smsNotifications"
                        checked={profile.preferences?.smsNotifications || false}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        SMS notifications for order updates
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Validation Summary */}
              {!isFormValid && Object.keys(touched).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-2" />
                    Please fix the errors above before saving your profile.
                  </p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={saving || !isFormValid}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  saving || !isFormValid
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-black"
                }`}
              >
                <FiSave className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
