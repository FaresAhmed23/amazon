import { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import {
  getCart,
  addToCart as apiAddToCart,
  removeFromCart,
  getProductById,
} from "../../utils/api";
import { UserContext } from "../userContext/user.context";
import { clearCart as apiClearCart } from "../../utils/api";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const { token, user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [token, user]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await getCart();

      if (data.items && data.items.length > 0) {
        const enrichedItems = await Promise.all(
          data.items.map(async (item) => {
            try {
              const product = await getProductById(item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
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
                quantity: item.quantity,
                title: `Product ${item.productId}`,
                price: 0,
                image: "/placeholder.png",
              };
            }
          })
        );
        setCart(enrichedItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      toast.error("Please log in to add items to cart");
      return false;
    }

    try {
      setIsLoading(true);

      const product = await getProductById(productId);

      await apiAddToCart(productId, quantity);
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) => item.productId === productId
        );

        if (existingItemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + quantity,
          };
          return updatedCart;
        } else {
          return [
            ...prevCart,
            {
              productId: productId,
              quantity: quantity,
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              category: product.category,
              rating: product.rating,
            },
          ];
        }
      });

      toast.success(
        <div className="flex items-center space-x-2">
          <img
            src={product.image}
            alt={product.title}
            className="w-8 h-8 object-contain"
          />
          <div>
            <p className="font-semibold text-sm">Added to Cart!</p>
            <p className="text-xs text-gray-600">
              {product.title.substring(0, 30)}...
            </p>
          </div>
        </div>
      );

      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setIsLoading(true);
      await removeFromCart(productId);

      setCart((prevCart) =>
        prevCart.filter((item) => item.productId !== productId)
      );

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      await removeFromCart(productId);
      await apiAddToCart(productId, newQuantity);

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await apiClearCart();
      setCart([]);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        updateQuantity,
        getCartCount,
        clearCart,
        getCartTotal,
        isLoading,
        fetchCart,
        setIsLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
