import axios from "axios";

// API
const API_BASE_URL = "https://nodejs2323.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// ================== Products ==================
export const getProducts = async () => {
  try {
    const res = await axios.get("https://fakestoreapi.com/products");
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const res = await axios.get(`https://fakestoreapi.com/products/categories`);
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const res = await axios.get(
      `https://fakestoreapi.com/products/category/${category}`
    );
    return res.data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};

// ================== Cart ==================
export const getCart = async () => {
  try {
    const res = await api.get("/cart");
    return res.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const res = await api.post("/cart/add", {
      productId: productId.toString(),
      quantity,
    });
    return res.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const res = await api.post("/cart/remove", {
      productId: productId.toString(),
    });
    return res.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const res = await api.delete("/cart/clear");
    return res.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// ================== Auth / Users ==================
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// ================== Orders ==================
export const checkout = async (checkoutData) => {
  try {
    const res = await api.post("/orders/checkout", checkoutData);
    return res.data;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const res = await api.get("/orders");
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// ================== Wishlist ==================
export const getWishlist = async () => {
  try {
    const res = await api.get("/wishlist");
    return res.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  try {
    const res = await api.post("/wishlist/add", {
      productId: productId.toString(),
    });
    return res.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const res = await api.post("/wishlist/remove", {
      productId: productId.toString(),
    });
    return res.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

// ================== User Profile ==================
export const getUserProfile = async () => {
  try {
    const res = await api.get("/user/profile");
    return res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const res = await api.put("/user/profile", profileData);
    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const res = await api.put("/user/change-password", passwordData);
    return res.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Utility functions for fake store API (if needed)
export const getUserCart = async (userId) => {
  try {
    const res = await axios.get(
      `https://fakestoreapi.com/carts/user/${userId}`
    );
    return res.data;
  } catch (error) {
    console.error(`Error fetching cart for user ${userId}:`, error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`https://fakestoreapi.com/users`);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`https://fakestoreapi.com/users/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};
