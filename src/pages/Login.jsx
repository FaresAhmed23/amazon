import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext/user.context";
import logo from "../assets/images/amazon-logo-transparent.png";
import "../styles/index.css";
import { loginUser } from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      login(response.token, response.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src={logo}
          alt="Amazon"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300">
          <h2 className="text-3xl font-medium text-gray-900 mb-6">Sign in</h2>

          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email or mobile phone number
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-500 hover:text-blue-600"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-600">
            By continuing, you agree to Amazon's{" "}
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

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                New to Amazon?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Create your Amazon account
            </button>
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

export default Login;
