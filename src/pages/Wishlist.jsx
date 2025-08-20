import { useContext, useEffect, useState } from "react";
import { FiHeart, FiShoppingCart, FiX, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/wishlistContext/wishlist.context";
import { CartContext } from "../context/cartContext/cart.context";
import { getProducts } from "../utils/api";

export default function Wishlist() {
  const { wishlist, removeItem, isLoading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchRecommendedProducts();
    }
  }, [wishlist]);

  const fetchRecommendedProducts = async () => {
    try {
      setLoadingRecommended(true);
      const allProducts = await getProducts();

      // Get categories from wishlist items
      const wishlistCategories = [
        ...new Set(wishlist.map((item) => item.category)),
      ];

      // Filter products by categories in wishlist, exclude already wishlisted items
      const wishlistProductIds = new Set(
        wishlist.map((item) => item.productId)
      );

      let recommended = allProducts.filter(
        (product) =>
          wishlistCategories.includes(product.category) &&
          !wishlistProductIds.has(product.id.toString())
      );

      // If not enough products from wishlist categories, add other high-rated products
      if (recommended.length < 6) {
        const otherProducts = allProducts
          .filter(
            (product) =>
              !wishlistProductIds.has(product.id.toString()) &&
              !wishlistCategories.includes(product.category) &&
              product.rating &&
              product.rating.rate >= 4.0
          )
          .sort((a, b) => b.rating.rate - a.rating.rate);

        recommended = [...recommended, ...otherProducts];
      }

      // Shuffle and limit to 6 products
      const shuffled = recommended.sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 6));
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const handleMoveToCart = async (item) => {
    const success = await addToCart(item.productId, 1);
    if (success) {
      await removeItem(item.productId);
    }
  };

  if (isLoading && wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiHeart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 pt-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FiHeart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Wish List is empty
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Save items you love by clicking the heart icon
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Wish List
          </h1>
          <p className="text-gray-600">{wishlist.length} items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Remove button */}
              <div className="relative">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <FiX className="w-4 h-4 text-gray-600" />
                </button>

                <Link to={`/product/${item.productId}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-contain bg-gray-50 p-4 hover:scale-105 transition-transform"
                  />
                </Link>
              </div>

              <div className="p-4">
                <Link
                  to={`/product/${item.productId}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 mb-2 block"
                >
                  {item.title}
                </Link>

                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-3 h-3 ${
                            star <= Math.floor(item.rating.rate)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">
                      ({item.rating.count})
                    </span>
                  </div>
                )}

                <p className="text-lg font-bold text-gray-900 mb-3">
                  ${item.price}
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    Move to Cart
                  </button>

                  <Link
                    to={`/product/${item.productId}`}
                    className="block w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Recommendations */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            {loadingRecommended ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading recommendations...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recommendedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-50 rounded mb-2 p-2">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                      {product.title}
                    </p>
                    <div className="flex items-center mb-1">
                      {product.rating && (
                        <>
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-xs text-gray-600 ml-1">
                            {product.rating.rate}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="font-semibold text-sm text-green-600">
                      ${product.price}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
