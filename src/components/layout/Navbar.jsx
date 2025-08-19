import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiMapPin,
} from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { UserContext } from "../../context/userContext/user.context";
import { CartContext } from "../../context/cartContext/cart.context";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { getCartCount } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const cartCount = getCartCount();

  return (
    <header className="bg-gray-900 text-white">
      {/* Top bar - Hidden on mobile */}
      <div className="bg-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center space-x-4">
              <span>Free delivery on orders over $50</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:text-yellow-400 transition-colors">
                Help
              </button>
              <button className="hover:text-yellow-400 transition-colors">
                Customer Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile menu button - Left side */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -ml-2 hover:bg-gray-700 rounded-md transition-colors"
          >
            {isMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mx-2 md:mr-6">
            <img
              src="/images/amazon-logo-transparent.png"
              alt="Amazon"
              className="h-6 sm:h-8 w-auto filter brightness-0 invert"
            />
          </Link>

          {/* Location - Hidden on mobile */}
          <div className="hidden lg:flex items-center text-sm mr-4 hover:text-yellow-400 cursor-pointer transition-colors">
            <IoLocationOutline className="text-lg mr-1" />
            <div>
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="font-medium">Egypt</div>
            </div>
          </div>

          {/* Desktop Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-4"
          >
            <div className="flex w-full">
              <select className="bg-gray-200 text-black px-2 lg:px-3 py-2 rounded-l-md text-sm border-r border-gray-300 focus:outline-none">
                <option>All</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Amazon.eg"
                className="flex-1 px-3 py-2 text-black focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 px-3 lg:px-4 py-2 rounded-r-md transition-colors"
              >
                <FiSearch className="text-black w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 hover:bg-gray-700 rounded-md transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Language selector - Hidden on mobile */}
            <button className="hidden sm:flex items-center text-xs hover:text-yellow-400 transition-colors">
              <span className="w-5 h-3 mr-1 text-xs">🇺🇸</span>
              <span className="hidden lg:block">EN</span>
            </button>

            {/* Account */}
            <div className="relative group">
              <Link
                to={user ? "/account" : "/auth/login"}
                className="flex flex-col items-center text-xs hover:text-yellow-400 transition-colors p-1"
              >
                <FiUser className="text-lg sm:text-xl mb-0.5" />
                <div className="hidden sm:block text-center">
                  <div className="text-xs leading-tight">
                    Hello, {user ? user.name.split(" ")[0] : "Sign in"}
                  </div>
                  <div className="font-medium text-xs leading-tight">
                    Account
                  </div>
                </div>
              </Link>

              {/* Desktop Dropdown menu */}
              {user && (
                <div className="absolute right-0 mt-1 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 hidden sm:block">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      Your Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      Your Wish List
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orders - Hidden on mobile */}
            <Link
              to="/orders"
              className="hidden lg:flex flex-col items-center text-xs hover:text-yellow-400 transition-colors p-1"
            >
              <div className="text-xs">Returns</div>
              <div className="font-medium text-xs">& Orders</div>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center hover:text-yellow-400 transition-colors p-1"
            >
              <div className="relative">
                <FiShoppingCart className="text-xl sm:text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block ml-2">
                <div className="text-xs leading-tight">Cart</div>
                <div className="font-medium text-xs leading-tight">
                  {cartCount}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden bg-gray-800 px-3 py-3 border-t border-gray-700">
          <form onSubmit={handleSearch} className="flex">
            <select className="bg-gray-200 text-black px-2 py-2 rounded-l-md text-sm border-r border-gray-300 focus:outline-none">
              <option>All</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Books</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Amazon.eg"
              className="flex-1 px-3 py-2 text-black focus:outline-none text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-r-md transition-colors"
            >
              <FiSearch className="text-black w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Secondary navigation - Horizontal scroll on mobile */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center h-8 sm:h-10 space-x-4 sm:space-x-6 text-sm overflow-x-auto scrollbar-hide">
            <Link
              to="/products"
              className="hover:text-yellow-400 flex items-center whitespace-nowrap transition-colors"
            >
              <FiMenu className="mr-1 w-3 h-3" />
              All
            </Link>
            <Link
              to="/products?category=electronics"
              className="hover:text-yellow-400 whitespace-nowrap transition-colors"
            >
              Electronics
            </Link>
            <Link
              to="/products?category=jewelery"
              className="hover:text-yellow-400 whitespace-nowrap transition-colors"
            >
              Jewelry
            </Link>
            <Link
              to="/products?category=men's clothing"
              className="hover:text-yellow-400 whitespace-nowrap transition-colors"
            >
              Men's Fashion
            </Link>
            <Link
              to="/products?category=women's clothing"
              className="hover:text-yellow-400 whitespace-nowrap transition-colors"
            >
              Women's Fashion
            </Link>
            <Link
              to="/deals"
              className="hover:text-yellow-400 whitespace-nowrap transition-colors"
            >
              Today's Deals
            </Link>
            <Link
              to="/prime"
              className="hover:text-yellow-400 whitespace-nowrap transition-colors"
            >
              Prime
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="relative bg-white w-80 max-w-[85vw] h-full shadow-xl overflow-y-auto">
            {/* Menu Header */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FiUser className="w-8 h-8 mr-3 bg-gray-600 rounded-full p-1.5" />
                <div>
                  <div className="font-medium">
                    Hello, {user ? user.name.split(" ")[0] : "Sign in"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-md"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="py-2">
              {!user ? (
                <>
                  <Link
                    to="/auth/login"
                    className="flex items-center px-6 py-3 text-gray-800 hover:bg-gray-100 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="flex items-center px-6 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                </>
              ) : (
                <>
                  <Link
                    to="/account"
                    className="flex items-center px-6 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Account
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-6 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-6 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center px-6 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Wish List
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                </>
              )}

              {/* Shopping Categories */}
              <div className="px-6 py-2">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Shop by Category
                </h3>
              </div>

              <Link
                to="/products"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                to="/products?category=electronics"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Electronics
              </Link>
              <Link
                to="/products?category=jewelery"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Jewelry
              </Link>
              <Link
                to="/products?category=men's clothing"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Men's Fashion
              </Link>
              <Link
                to="/products?category=women's clothing"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Women's Fashion
              </Link>

              <div className="border-t border-gray-200 my-2"></div>

              {/* Other Links */}
              <Link
                to="/deals"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Today's Deals
              </Link>

              <Link
                to="/cart"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiShoppingCart className="mr-3" />
                Cart ({cartCount})
              </Link>

              {/* Location */}
              <div className="flex items-center px-6 py-3 text-gray-700">
                <FiMapPin className="mr-3" />
                Deliver to Egypt
              </div>

              {user && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}
