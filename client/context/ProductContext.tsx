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
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  productLoading: false,
  fetchProducts: async () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  useEffect(() => {
    if (authState?.authenticated) {
      fetchProducts();
    } else {
      setProducts([]); // Reset products if logged out
    }
  }, [authState?.authenticated]);

  async function fetchProducts() {
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
      console.log("error in fetchProducts", error);
    } finally {
      setProductLoading(false);
    }
  }

  return (
    <ProductContext.Provider
      value={{ products, productLoading, fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};
