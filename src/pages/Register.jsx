import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext/user.context";
import "../styles/index.css";
import { registerUser } from "../utils/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await registerUser(formData);
      // response returns {token, user}
      login(response.token, response.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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

          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Passwords must be at least 6 characters.
                </p>
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
