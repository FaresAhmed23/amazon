import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/index.css";
import { FiHeart, FiStar } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoStar } from "react-icons/io5";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { getProducts } from "../utils/api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContext/cart.context";
import { WishlistContext } from "../context/wishlistContext/wishlist.context";

function Products() {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [addedToCart, setAddedToCart] = useState(new Set());
  const [wishlistProcessing, setWishlistProcessing] = useState(new Set());

  const { addToCart, cart } = useContext(CartContext);
  const {
    addToWishlist,
    isInWishlist,
    removeItem: removeFromWishlist,
  } = useContext(WishlistContext);

  const handleWishlistToggle = async (productId) => {
    setWishlistProcessing((prev) => new Set(prev).add(productId));

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId.toString());
    } else {
      await addToWishlist(productId);
    }

    setWishlistProcessing((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const deals = searchParams.get("deals");
    const prime = searchParams.get("prime");

    let temp = [...products];

    // Filter by category
    if (category) {
      temp = temp.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      temp = temp.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter for deals (high-rated products)
    if (deals === "true") {
      temp = temp.filter((p) => p.rating && p.rating.rate >= 4.0);
    }

    // Filter for prime (products under $100 for "free shipping")
    if (prime === "true") {
      temp = temp.filter((p) => p.price <= 100);
    }

    setFilteredProducts(temp);
  }, [products, searchParams]);

  useEffect(() => {
    let temp = [...products];

    // Apply URL filters first
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const deals = searchParams.get("deals");
    const prime = searchParams.get("prime");

    if (category) {
      temp = temp.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      temp = temp.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (deals === "true") {
      temp = temp.filter((p) => p.rating && p.rating.rate >= 4.0);
    }

    if (prime === "true") {
      temp = temp.filter((p) => p.price <= 100);
    }

    // Filter Brand
    if (selectedBrands.length > 0) {
      temp = temp.filter((p) =>
        selectedBrands.some((brand) =>
          p.title.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Filter Price
    if (selectedPrices.length > 0) {
      temp = temp.filter((p) => {
        return selectedPrices.some((range) => {
          if (range === "all") return true;
          const [min, max] = range.split("-").map(Number);
          return p.price >= min && p.price <= max;
        });
      });
    }

    // Filter Rate
    if (selectedRating) {
      temp = temp.filter((p) => Math.floor(p.rating.rate) >= selectedRating);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        temp.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        temp.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        temp.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name-a-z":
        temp.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-z-a":
        temp.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(temp);
  }, [
    selectedBrands,
    selectedPrices,
    selectedRating,
    products,
    sortBy,
    searchParams,
  ]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (range) => {
    setSelectedPrices((prev) =>
      prev.includes(range) ? prev.filter((p) => p !== range) : [...prev, range]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart((prev) => new Set(prev).add(productId));

    const success = await addToCart(productId, 1);

    if (success) {
      setAddedToCart((prev) => new Set(prev).add(productId));
      // Remove from added state after 3 seconds
      setTimeout(() => {
        setAddedToCart((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }, 3000);
    }

    setAddingToCart((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.productId === productId.toString());
  };

  // Get page title based on URL parameters
  const getPageTitle = () => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const deals = searchParams.get("deals");
    const prime = searchParams.get("prime");

    if (deals === "true") return "Today's Deals";
    if (prime === "true") return "Prime Products";
    if (category)
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    if (search) return `Search results for "${search}"`;
    return "All Products";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        {searchParams.get("deals") === "true" && (
          <p className="text-gray-600 mt-1">
            High-rated products with great reviews
          </p>
        )}
        {searchParams.get("prime") === "true" && (
          <p className="text-gray-600 mt-1">
            Products with fast shipping (under $100)
          </p>
        )}
      </div>

      {/* Mobile filters toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="w-full inline-flex items-center justify-between rounded border border-gray-300 bg-white py-2 px-3 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          <span>Filters</span>
          <IoIosArrowDown
            className={`h-4 w-4 transition-transform ${
              filtersOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Sidebar (filters) */}
        <aside
          className={`w-full md:w-64 lg:w-72 shrink-0 rounded border border-gray-200 bg-white p-4 sticky top-4 ${
            filtersOpen ? "block" : "hidden"
          } md:block`}
        >
          {/* Clear Filters */}
          {(selectedBrands.length > 0 ||
            selectedPrices.length > 0 ||
            selectedRating) && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedPrices([]);
                  setSelectedRating(null);
                }}
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Brands */}
          <div className="brands">
            <h2 className="text-base text-black font-bold mb-2">Brands</h2>
            <div className="space-y-2">
              {[
                "Jacket",
                "Shirts",
                "Portable ",
                "SanDisk SSD ",
                "Power ",
                "Samsung ",
                "Gold ",
                "Women's ",
              ].map((brand) => {
                return (
                  <label
                    key={brand}
                    className="flex items-center hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="mr-2 size-3 rounded border-gray-300 shadow-sm text-blue-600 focus:ring-blue-500"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span className="text-sm text-gray-800">{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Prices */}
          <div className="prices mt-6">
            <h2 className="text-base text-black font-bold mb-2">Price</h2>
            <div className="space-y-2">
              {[
                { label: "All", value: "all" },
                { label: "$0 - $50", value: "0-50" },
                { label: "$50 - $100", value: "50-100" },
                { label: "$100 - $200", value: "100-200" },
              ].map((price) => {
                return (
                  <label
                    key={price.value}
                    className="flex items-center hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="mr-2 size-3 rounded border-gray-300 shadow-sm text-blue-600 focus:ring-blue-500"
                      checked={selectedPrices.includes(price.value)}
                      onChange={() => handlePriceChange(price.value)}
                    />
                    <span className="text-sm text-gray-800">{price.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Ratings */}
          <div className="review mt-6">
            <h2 className="text-base text-black font-bold mb-2">
              Customer Reviews
            </h2>
            <div className="space-y-2">
              {[4, 3, 2].map((r) => (
                <div
                  key={r}
                  className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded ${
                    selectedRating === r
                      ? "bg-blue-50 border border-blue-200"
                      : ""
                  }`}
                  onClick={() =>
                    handleRatingChange(selectedRating === r ? null : r)
                  }
                >
                  <div className="rating flex flex-row gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IoStar
                        key={star}
                        className={`w-4 h-4 ${
                          star <= r ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">& up</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <section className="flex-1">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} results
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Customer Reviews</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isLoading = addingToCart.has(product.id);
                const isAdded = addedToCart.has(product.id);
                const inCart = isInCart(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 overflow-hidden group relative"
                  >
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden bg-gray-50">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-200 p-4"
                        />
                        {product.category && (
                          <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-2 h-10">
                          {product.title}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.floor(product.rating.rate)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-blue-600 hover:underline">
                          ({product.rating.count})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={isLoading}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                          isAdded
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : inCart
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : isLoading
                            ? "bg-gray-100 text-gray-600 border border-gray-200 cursor-not-allowed"
                            : "bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-500"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            Adding...
                          </>
                        ) : isAdded ? (
                          <>
                            <FiCheck className="w-4 h-4" />
                            Added!
                          </>
                        ) : inCart ? (
                          <>
                            <FiShoppingCart className="w-4 h-4" />
                            In Cart
                          </>
                        ) : (
                          <>
                            <FiShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleWishlistToggle(product.id)}
                        disabled={wishlistProcessing.has(product.id)}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
                          isInWishlist(product.id)
                            ? "bg-red-100 text-red-600"
                            : "bg-white text-gray-600 hover:text-red-600"
                        }`}
                      >
                        {wishlistProcessing.has(product.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <FiHeart
                            className={`w-4 h-4 ${
                              isInWishlist(product.id) ? "fill-current" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Quick view link */}
                      <Link
                        to={`/product/${product.id}`}
                        className="block text-center text-xs text-blue-600 hover:underline mt-2"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Products;
