import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  getProductsByCategory,
  getCategories,
} from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Home() {
  const [topDeals, setTopDeals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);

      // Fetch all data concurrently
      const [allProducts, allCategories] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      // Get top deals (products with high ratings, limit to 8)
      const topRatedProducts = allProducts
        .filter((product) => product.rating && product.rating.rate >= 4.0)
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 8);

      setTopDeals(topRatedProducts);

      // Get featured products from different categories
      const featuredByCategory = {};
      for (const category of allCategories.slice(0, 4)) {
        const categoryProducts = allProducts
          .filter((product) => product.category === category)
          .slice(0, 6);
        featuredByCategory[category] = categoryProducts;
      }

      setFeaturedProducts(featuredByCategory);
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white">
      <div id="hero" className="relative z-30 lg:pb-20">
        <div className="h-52 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] w-full object-cover block items-center justify-center">
          <img
            src="/images/f2fbe9b84327c8c1db6cabbeef327465bbb07fca.jpg"
            alt="Kitchen utensils"
            className="h-full w-full object-cover"
          />
          <div className="max-w-7xl mx-auto px-4 mb-8 mt-0 lg:mt-60"></div>
        </div>

        {/* Dynamic Category Cards Overlay */}
        <div className="static lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:transform lg:translate-y-1/2 z-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(featuredProducts).map(
                ([category, products], index) => (
                  <div
                    key={category}
                    className="bg-white p-4 sm:p-5 lg:p-6 shadow-lg rounded-sm hover:shadow-xl transition-shadow"
                  >
                    <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-4 capitalize">
                      {category
                        .replace(/'/g, "")
                        .replace("s clothing", " Fashion")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {products.slice(0, 4).map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="text-center group"
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-20 object-contain mb-1 group-hover:scale-105 transition-transform"
                          />
                          <span className="text-xs line-clamp-2">
                            {product.title.substring(0, 25)}...
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to={`/products?category=${category}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Explore all
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-8 mt-60"></div>

      {/* Top Deals Section */}
      <div id="top-deals" className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Top Deals - Highly Rated Products
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {topDeals.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex-shrink-0 w-40 group"
              >
                <div className="bg-white border rounded-lg p-3 hover:shadow-lg transition-shadow">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-32 object-contain mb-2 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="text-sm font-medium line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center mb-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs ml-1">{product.rating.rate}</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Category Sections */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mb-8 sm:mb-10 lg:mb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {Object.entries(featuredProducts).map(([category, products]) => (
            <div
              key={category}
              className="bg-white p-4 sm:p-5 lg:p-6 shadow-lg rounded-sm hover:shadow-xl transition-shadow"
            >
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-4 capitalize">
                Best in {category.replace("'s clothing", " Fashion")}
              </h3>

              {products.length > 0 && (
                <div className="mb-4">
                  <Link to={`/product/${products[0].id}`}>
                    <img
                      src={products[0].image}
                      alt={products[0].title}
                      className="w-full h-28 sm:h-32 lg:h-36 object-contain mb-3 cursor-pointer rounded hover:scale-105 transition-transform"
                    />
                  </Link>
                  <p className="text-sm sm:text-base leading-relaxed mb-2 line-clamp-2">
                    {products[0].title}
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl font-semibold text-red-600">
                    ${products[0].price}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {products.slice(1, 4).map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-14 sm:h-16 lg:h-20 object-contain rounded cursor-pointer hover:scale-105 transition-transform"
                    />
                  </Link>
                ))}
              </div>

              <Link
                to={`/products?category=${category}`}
                className="text-blue-600 text-sm hover:underline hover:text-blue-800 transition-colors"
              >
                Explore more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
