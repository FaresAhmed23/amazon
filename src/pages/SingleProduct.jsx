import { useState, useEffect, useContext } from "react";
import { FiStar, FiShoppingCart, FiCheck, FiHeart } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { GrSecure } from "react-icons/gr";
import { CiCreditCard1 } from "react-icons/ci";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/cartContext/cart.context";
import {
  getProductById,
  getProductsByCategory,
  getProducts,
} from "../utils/api";
import "../styles/index.css";
import { WishlistContext } from "../context/wishlistContext/wishlist.context";

// Add this component before the main SingleProduct component
const RelatedProductCard = ({ relatedProduct, index }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState(relatedProduct.image);

  const handleImageError = () => {
    console.log(
      `Image load failed for product ${relatedProduct.id} (attempt ${
        retryCount + 1
      })`
    );

    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setCurrentImageSrc(
          `${relatedProduct.image}?retry=${retryCount + 1}&t=${Date.now()}`
        );
      }, (index + 1) * 500);
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    console.log(`Image successfully loaded for product ${relatedProduct.id}`);
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <Link
      to={`/product/${relatedProduct.id}`}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300 group"
    >
      <div className="aspect-square bg-gray-50 rounded mb-3 overflow-hidden flex items-center justify-center relative">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
            <div className="text-center p-2">
              <div className="text-2xl mb-1">🖼️</div>
              <div className="text-xs">Image not available</div>
            </div>
          </div>
        ) : (
          <img
            src={currentImageSrc}
            alt={relatedProduct.title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      <p className="text-sm text-gray-800 line-clamp-2 mb-2 leading-tight">
        {relatedProduct.title}
      </p>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-gray-900">
          ${relatedProduct.price?.toFixed(2)}
        </p>
        {relatedProduct.rating?.rate && (
          <div className="flex items-center gap-1">
            <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">
              {relatedProduct.rating.rate.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      {relatedProduct.category && (
        <p className="text-xs text-gray-500 mt-1 capitalize">
          {relatedProduct.category}
        </p>
      )}
    </Link>
  );
};

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const { addToCart, cart } = useContext(CartContext);
  const {
    addToWishlist,
    isInWishlist,
    removeItem: removeFromWishlist,
    fetchWishlist,
  } = useContext(WishlistContext);

  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true);

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id.toString());
      } else {
        await addToWishlist(product.id);
      }

      await fetchWishlist();
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);

        fetchRelatedProducts(data.category);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (category) => {
    try {
      setLoadingRelated(true);

      let related = [];
      try {
        const categoryProducts = await getProductsByCategory(category);
        related = categoryProducts
          .filter((p) => p.id.toString() !== id)
          .slice(0, 6);
      } catch (error) {
        console.log(
          "Failed to fetch by category, fetching all products instead"
        );
      }

      if (related.length < 6) {
        try {
          const allProducts = await getProducts();
          const additionalProducts = allProducts
            .filter(
              (p) =>
                p.id.toString() !== id && !related.some((rp) => rp.id === p.id)
            )
            .slice(0, 6 - related.length);

          related = [...related, ...additionalProducts];
        } catch (error) {
          console.error("Error fetching additional products:", error);
        }
      }

      setRelatedProducts(related);
    } catch (error) {
      console.error("Error fetching related products:", error);
      setRelatedProducts([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const success = await addToCart(product.id, quantity);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    }

    setIsAddingToCart(false);
  };

  const isInCart = cart.some((item) => item.productId === id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-96 h-96 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product not found!
        </h1>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.category}</span>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 lg:h-[500px] object-contain p-6"
            />
          </div>

          {/* Product highlights */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Product highlights</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• High quality materials</li>
              <li>• Fast shipping available</li>
              <li>• Customer satisfaction guaranteed</li>
              <li>• Easy returns within 30 days</li>
            </ul>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main product details */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Brand */}
              <div className="mb-4">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Brand: {product.category}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating.rate)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating.rate}</span>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {product.rating.count} ratings
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-600">
                    List price:{" "}
                    <span className="line-through">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Inclusive of all taxes •{" "}
                  <span className="text-green-600 font-medium">
                    FREE delivery
                  </span>
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About this item</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-gray-200">
                <div className="text-center">
                  <CiCreditCard1 className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <GrSecure className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <IoLocationSharp className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">Fast Delivery</p>
                </div>
              </div>
            </div>

            {/* Purchase Box */}
            <div className="lg:w-80">
              <div className="border border-gray-200 rounded-lg p-6 sticky top-4 bg-white shadow-sm">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    FREE delivery
                  </p>
                </div>

                {/* Stock status */}
                <div className="mb-4">
                  <p className="text-green-600 font-medium text-lg">In Stock</p>
                  <p className="text-sm text-gray-600">
                    Ships from and sold by Amazon.eg
                  </p>
                </div>

                {/* Quantity selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      justAdded
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : isInCart
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : isAddingToCart
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500 text-black"
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                        Adding to Cart...
                      </>
                    ) : justAdded ? (
                      <>
                        <FiCheck className="w-5 h-5" />
                        Added to Cart!
                      </>
                    ) : isInCart ? (
                      <>
                        <FiShoppingCart className="w-5 h-5" />
                        Already in Cart
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    disabled={isAddingToWishlist}
                    className={`w-full border py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      isInWishlist(product.id)
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    } ${
                      isAddingToWishlist ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isAddingToWishlist ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FiHeart
                          className={`w-4 h-4 ${
                            isInWishlist(product.id) ? "fill-current" : ""
                          }`}
                        />
                        <span>
                          {isInWishlist(product.id)
                            ? "Remove from Wishlist"
                            : "Add to Wish List"}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Delivery info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <IoLocationSharp className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Deliver to Egypt
                      </p>
                      <button className="text-sm text-blue-600 hover:underline">
                        Update location
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional info */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                  <p>• Return policy: Returnable until Jan 31, 2025</p>
                  <p>• Payment: Secure transaction</p>
                  <p>• Ships from: Amazon</p>
                  <p>• Sold by: Amazon.eg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Review Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-yellow-600 mb-2">
                  {product.rating.rate}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(product.rating.rate)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">
                  {product.rating.count} global ratings
                </p>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {/* Sample reviews */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="font-medium">Great product!</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  By Amazon Customer on December 15, 2024
                </p>
                <p className="text-gray-800">
                  Really satisfied with this purchase. Quality is excellent and
                  delivery was fast.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <FiStar
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <FiStar className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="font-medium">Good value for money</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  By Verified Purchase on December 10, 2024
                </p>
                <p className="text-gray-800">
                  Does what it's supposed to do. Would recommend to others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Customers who viewed this item also viewed
        </h2>

        {loadingRelated ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.map((relatedProduct, index) => (
              <RelatedProductCard
                key={relatedProduct.id}
                relatedProduct={relatedProduct}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No related products found</p>
            <Link
              to="/products"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Browse all products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleProduct;
