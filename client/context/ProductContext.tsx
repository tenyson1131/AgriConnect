import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { ProductInterface } from "@/src/types";

interface ProductContextType {
  products: ProductInterface[];
  productLoading: boolean;
  fetchProducts: () => Promise<void>;
  wishlist: ProductInterface[];
  fetchWishlist: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  productLoading: false,
  fetchProducts: async () => {},
  wishlist: [],
  fetchWishlist: async () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (authState?.authenticated) {
      fetchProducts();
      fetchWishlist();
    } else {
      setProducts([]); // Reset products if logged out
    }
  }, [authState?.authenticated]);

  async function fetchProducts(retries = 8, delay = 1000) {
    try {
      setProductLoading(true);
      const result = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/product/get-products`
      );

      console.log("fetched products result: ", result.data);
      if (result.data) {
        setProducts(result.data.products);
      }
    } catch (error) {
      console.log(`Error in fetchProducts (attempt ${4 - retries}):`, error);

      if (retries > 0) {
        console.log(`Retrying fetchProducts in ${delay}ms...`);
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        console.log("Failed to fetch products after multiple attempts.");
      }
    } finally {
      setProductLoading(false);
    }
  }

  async function fetchWishlist() {
    try {
      const result = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/product/get-wishlist`
      );

      console.log("fetched wishlist result: ", result.data);
      if (result.data) {
        setWishlist(result.data.wishlist);
      }
    } catch (error) {
      console.log("error in fetchWishlist: ", error);
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        productLoading,
        fetchProducts,
        wishlist,
        fetchWishlist,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
