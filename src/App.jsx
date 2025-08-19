import { useState, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LoadingSpinner from "./components/LoadingSpinner";
import UserProvider from "./context/userContext/user.context";
import CartProvider from "./context/cartContext/cart.context";
import WishlistProvider from "./context/wishlistContext/wishlist.context";

function App({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            suspense: true,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: "#4aed88",
                  },
                },
                error: {
                  duration: 4000,
                  theme: {
                    primary: "#ff6b6b",
                  },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
