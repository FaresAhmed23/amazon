import { useState, useEffect, useContext } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiCamera,
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <form onSubmit={handleSubmit}>
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
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        name="address.street"
                        value={profile.address?.street || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter your street address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={profile.address?.city || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={profile.address?.state || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Enter your state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={profile.address?.zipCode || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Enter ZIP code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="address.country"
                      value={profile.address?.country || "Egypt"}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="Egypt">Egypt</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
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
            </div>

            {/* Save Button */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center space-x-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-colors ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
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
