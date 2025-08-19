import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { UserContext } from "../../context/userContext/user.context";
import { CartContext } from "../../context/cartContext/cart.context";
import logo from "../../assets/images/amazon-logo-transparent.png";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { getCartCount } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const cartCount = getCartCount();

  return (
    <header className="bg-gray-900 text-white">
      {/* Top bar */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center space-x-4 text-xs">
              <span>Free delivery on orders over $50</span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <button className="hover:text-yellow-400">Help</button>
              <button className="hover:text-yellow-400">
                Customer Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mr-6">
            <img
              src={logo}
              alt="Amazon"
              className="h-8 w-auto filter brightness-0 invert"
            />
          </Link>

          {/* Location */}
          <div className="hidden lg:flex items-center text-sm mr-6 hover:text-yellow-400 cursor-pointer">
            <IoLocationOutline className="text-lg mr-1" />
            <div>
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="font-medium">Egypt</div>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="flex">
              <select className="bg-gray-200 text-black px-3 py-2 rounded-l-md text-sm border-r border-gray-300 focus:outline-none">
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
                className="flex-1 px-4 py-2 text-black focus:outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-r-md transition-colors"
              >
                <FiSearch className="text-black" />
              </button>
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            {/* Language selector */}
            <button className="hidden sm:flex items-center text-sm hover:text-yellow-400">
              <span className="flag-icon flag-icon-us w-5 h-3 mr-1"></span>
              EN
            </button>

            {/* Account */}
            <div className="relative group">
              <Link
                to={user ? "/account" : "/auth/login"}
                className="flex flex-col items-center text-xs hover:text-yellow-400"
              >
                <FiUser className="text-lg mb-1" />
                <div className="hidden sm:block">
                  <div>Hello, {user ? user.name.split(" ")[0] : "Sign in"}</div>
                  <div className="font-medium">Account & Lists</div>
                </div>
              </Link>

              {/* Dropdown menu */}
              {user && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Your Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Your Wish List
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orders */}
            <Link
              to="/orders"
              className="hidden sm:flex flex-col items-center text-xs hover:text-yellow-400"
            >
              <div>Returns</div>
              <div className="font-medium">& Orders</div>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center hover:text-yellow-400"
            >
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block ml-2">
                <div className="text-xs">Cart</div>
                <div className="font-medium">{cartCount}</div>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 hover:bg-gray-700 rounded-md"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary navigation */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 space-x-6 text-sm">
            <Link
              to="/products"
              className="hover:text-yellow-400 flex items-center"
            >
              <FiMenu className="mr-1" />
              All
            </Link>
            <Link
              to="/products?category=electronics"
              className="hover:text-yellow-400"
            >
              Electronics
            </Link>
            <Link
              to="/products?category=jewelery"
              className="hover:text-yellow-400"
            >
              Jewelry
            </Link>
            <Link
              to="/products?category=men's clothing"
              className="hover:text-yellow-400"
            >
              Men's Fashion
            </Link>
            <Link
              to="/products?category=women's clothing"
              className="hover:text-yellow-400"
            >
              Women's Fashion
            </Link>
            <Link to="/deals" className="hover:text-yellow-400">
              Today's Deals
            </Link>
            <Link to="/prime" className="hover:text-yellow-400">
              Prime
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-2 space-y-2">
            {!user ? (
              <>
                <Link
                  to="/auth/login"
                  className="block py-2 text-yellow-400 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="block py-2 hover:text-yellow-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <div className="py-2 text-yellow-400">Hello, {user.name}</div>
                <Link
                  to="/orders"
                  className="block py-2 hover:text-yellow-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Orders
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 hover:text-yellow-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart ({cartCount})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-yellow-400"
                >
                  Sign Out
                </button>
              </>
            )}
            <hr className="border-gray-600 my-2" />
            <Link
              to="/products"
              className="block py-2 hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              to="/deals"
              className="block py-2 hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Today's Deals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
