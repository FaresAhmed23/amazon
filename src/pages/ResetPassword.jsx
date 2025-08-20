import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword, validateResetToken } from "../utils/api";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

export default function ResetPassword() {
  const { resettoken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Password validation
  const getPasswordStrength = (password) => {
    const errors = [];
    if (password.length < 6) errors.push("At least 6 characters");
    if (!/(?=.*[a-z])/.test(password)) errors.push("One lowercase letter");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
    if (!/(?=.*\d)/.test(password)) errors.push("One number");
    return errors;
  };

  const passwordErrors = getPasswordStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  useEffect(() => {
    validateToken();
  }, [resettoken]);

  const validateToken = async () => {
    try {
      await validateResetToken(resettoken);
      setIsValidToken(true);
    } catch (error) {
      setError("Invalid or expired reset link");
      setIsValidToken(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordErrors.length > 0) {
      setError("Please fix password requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(resettoken, password, confirmPassword);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/">
            <img
              className="mx-auto h-12 w-auto cursor-pointer"
              src="/images/amazon-logo-transparent.png"
              alt="Amazon"
            />
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Reset Link
              </h2>

              <p className="text-gray-600 mb-6">
                {error || "This password reset link is invalid or has expired."}
              </p>

              <div className="space-y-4">
                <Link
                  to="/auth/forgot-password"
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-md font-medium text-center transition-colors"
                >
                  Request New Reset Link
                </Link>

                <Link
                  to="/auth/login"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium text-center transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/">
            <img
              className="mx-auto h-12 w-auto cursor-pointer"
              src="/images/amazon-logo-transparent.png"
              alt="Amazon"
            />
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Password Reset Successful
              </h2>

              <p className="text-gray-600 mb-6">
                Your password has been successfully updated. You can now sign in
                with your new password.
              </p>

              <button
                onClick={() => navigate("/auth/login")}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-md font-medium transition-colors"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img
            className="mx-auto h-12 w-auto cursor-pointer"
            src="/images/amazon-logo-transparent.png"
            alt="Amazon"
          />
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300">
          <div className="mb-6">
            <Link
              to="/auth/login"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
            >
              <FiArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>

            <h2 className="text-3xl font-medium text-gray-900">
              Create new password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your new password must be different from previous passwords.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
                <FiLock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              {password && (
                <div className="mt-2">
                  <div className="text-xs space-y-1">
                    {[
                      "At least 6 characters",
                      "One uppercase letter",
                      "One lowercase letter",
                      "One number",
                    ].map((requirement, index) => {
                      const checks = [
                        password.length >= 6,
                        /(?=.*[A-Z])/.test(password),
                        /(?=.*[a-z])/.test(password),
                        /(?=.*\d)/.test(password),
                      ];
                      const isValid = checks[index];

                      return (
                        <div
                          key={requirement}
                          className={`flex items-center ${
                            isValid ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                              isValid ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          {requirement}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 pl-10 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                    confirmPassword && !passwordsMatch
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                <FiLock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match
                </p>
              )}

              {confirmPassword && passwordsMatch && (
                <p className="mt-1 text-xs text-green-600 flex items-center">
                  <FiCheck className="w-3 h-3 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isLoading || passwordErrors.length > 0 || !passwordsMatch
              }
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black transition-colors ${
                isLoading || passwordErrors.length > 0 || !passwordsMatch
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
