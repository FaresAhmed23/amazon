import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext/user.context";
import "../styles/index.css";
import { registerUser } from "../utils/api";
import { FiAlertCircle, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // Validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
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

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!passwordRegex.test(value)) {
          newErrors.password =
            "Password must contain uppercase, lowercase, and number";
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input
    let sanitizedValue = value;
    if (name === "name") {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "phone") {
      sanitizedValue = value.replace(/[^+\d\s-()]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

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
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await registerUser(formData);
      login(response.token, response.user);
      navigate("/");
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const getFieldClasses = (fieldName) => {
    const baseClasses =
      "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm";
    const hasError = getFieldError(fieldName);
    const isValid =
      touched[fieldName] && !errors[fieldName] && formData[fieldName];

    if (hasError) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
    } else if (isValid) {
      return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }

    return `${baseClasses} border-gray-300 focus:ring-yellow-500 focus:border-yellow-500`;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <div className="login min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto cursor-pointer"
          src="/images/amazon-logo-transparent.png"
          alt="Amazon"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300">
          <h2 className="text-3xl font-medium text-gray-900 mb-6">
            Create Account
          </h2>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          <form className="space-y-4 mb-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClasses("name")}
                  placeholder="First and last name"
                  maxLength={50}
                  aria-invalid={!!getFieldError("name")}
                  aria-describedby={
                    getFieldError("name") ? "name-error" : undefined
                  }
                />
                {getFieldError("name") ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                ) : (
                  touched.name &&
                  formData.name &&
                  !errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiCheck className="h-5 w-5 text-green-500" />
                    </div>
                  )
                )}
              </div>
              {getFieldError("name") && (
                <p
                  id="name-error"
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClasses("email")}
                  placeholder="Enter your email"
                  aria-invalid={!!getFieldError("email")}
                  aria-describedby={
                    getFieldError("email") ? "email-error" : undefined
                  }
                />
                {getFieldError("email") ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                ) : (
                  touched.email &&
                  formData.email &&
                  !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiCheck className="h-5 w-5 text-green-500" />
                    </div>
                  )
                )}
              </div>
              {getFieldError("email") && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClasses("phone")}
                  placeholder="+1 (555) 123-4567"
                  aria-invalid={!!getFieldError("phone")}
                  aria-describedby={
                    getFieldError("phone") ? "phone-error" : undefined
                  }
                />
                {getFieldError("phone") ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                ) : (
                  touched.phone &&
                  formData.phone &&
                  !errors.phone && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiCheck className="h-5 w-5 text-green-500" />
                    </div>
                  )
                )}
              </div>
              {getFieldError("phone") && (
                <p
                  id="phone-error"
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClasses("password")}
                  placeholder="At least 8 characters"
                  aria-invalid={!!getFieldError("password")}
                  aria-describedby={
                    getFieldError("password")
                      ? "password-error"
                      : "password-requirements"
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
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

              <div id="password-requirements" className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  Password must contain:
                </p>
                <ul className="text-xs space-y-1">
                  <li
                    className={`flex items-center ${
                      formData.password.length >= 8
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <FiCheck
                      className={`w-3 h-3 mr-1 ${
                        formData.password.length >= 8
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${
                      /[a-z]/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <FiCheck
                      className={`w-3 h-3 mr-1 ${
                        /[a-z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    One lowercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /[A-Z]/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <FiCheck
                      className={`w-3 h-3 mr-1 ${
                        /[A-Z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    One uppercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /\d/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <FiCheck
                      className={`w-3 h-3 mr-1 ${
                        /\d/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    One number
                  </li>
                </ul>
              </div>

              {getFieldError("password") && (
                <p
                  id="password-error"
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  Object.keys(errors).length > 0 ||
                  !Object.keys(touched).length
                }
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                  isLoading ||
                  Object.keys(errors).length > 0 ||
                  !Object.keys(touched).length
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                {isLoading
                  ? "Creating account..."
                  : "Create your Amazon account"}
              </button>
            </div>
          </form>

          <hr />

          <div className="mt-4 mb-4">
            <p className="font-base text-gray-600 font-semibold">
              Buying for work?
            </p>
            <p className="text-blue-500 hover:underline text-sm cursor-pointer">
              Create a free business account
            </p>
          </div>

          <hr />

          <div className="mt-4 mb-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/auth/login")}
              >
                Sign in
              </span>
            </p>
            <div className="mt-4 text-xs text-gray-600 capitalize">
              By creating an account or logging in, you agree to Amazon's{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Conditions of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Notice
              </a>
              .
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-600">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="text-blue-500 hover:underline">
            Conditions of Use
          </a>
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="text-blue-500 hover:underline">
            Help
          </a>
        </div>
        <div>
          © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
        </div>
      </footer>
    </div>
  );
}

export default Register;
