import { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import {
  getWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist,
  getProductById,
} from "../../utils/api";
import { UserContext } from "../userContext/user.context";

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const { token, user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [token, user]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const data = await getWishlist();

      if (data.items && data.items.length > 0) {
        const enrichedItems = await Promise.all(
          data.items.map(async (item) => {
            try {
              const product = await getProductById(item.productId);
              return {
                productId: item.productId,
                addedAt: item.addedAt,
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                rating: product.rating,
              };
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
              return {
                productId: item.productId,
                addedAt: item.addedAt,
                title: `Product ${item.productId}`,
                price: 0,
                image: "/placeholder.png",
              };
            }
          })
        );
        setWishlist(enrichedItems);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!token) {
      toast.error("Please log in to add items to wishlist");
      return false;
    }

    try {
      setIsLoading(true);

      const product = await getProductById(productId);
      await apiAddToWishlist(productId);

      setWishlist((prevWishlist) => [
        ...prevWishlist,
        {
          productId: productId,
          addedAt: new Date().toISOString(),
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating,
        },
      ]);

      toast.success(
        <div className="flex items-center space-x-2">
          <img
            src={product.image}
            alt={product.title}
            className="w-8 h-8 object-contain"
          />
          <div>
            <p className="font-semibold text-sm">Added to Wishlist!</p>
            <p className="text-xs text-gray-600">
              {product.title.substring(0, 30)}...
            </p>
          </div>
        </div>
      );

      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.data?.message === "Item already in wishlist") {
        toast.error("Item already in your wishlist");
      } else {
        toast.error("Failed to add item to wishlist");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setIsLoading(true);
      await removeFromWishlist(productId);

      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.productId !== productId)
      );

      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId.toString());
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeItem,
        isInWishlist,
        getWishlistCount,
        isLoading,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
