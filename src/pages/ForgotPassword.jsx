// pages/ForgotPassword.js (Update with EmailJS integration)
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../utils/api";
import { sendPasswordResetEmail } from "../services/email.service";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);

      // If backend returns email data, send email via EmailJS
      if (response.emailData) {
        try {
          await sendPasswordResetEmail(
            response.emailData.userEmail,
            response.emailData.resetUrl,
            response.emailData.userName
          );
          toast.success("Reset email sent successfully!");
        } catch (emailError) {
          console.error("EmailJS Error:", emailError);
          toast.error("Email sending failed, but reset link was generated.");
        }
      }

      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
                Check Your Email
              </h2>

              <p className="text-gray-600 mb-6">
                If an account with <strong>{email}</strong> exists, we've sent a
                password reset link to your email address.
              </p>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder or try again
                  in a few minutes.
                </p>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Try Another Email
                </button>

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
              Password assistance
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the email address associated with your Amazon account.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
                <FiMail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
