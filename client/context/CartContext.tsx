import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartItem } from "@/src/types";
import axios from "axios";
import { AuthContext } from "./AuthContext";

interface CartContextType {
  cart: CartItem[];
  loadCart: () => void;
  addToCart: (
    productId: string | number,
    quantity: number
  ) => Promise<{ status: number }>;
  removeFromCart: (id: string | number) => void;
  cart_Loading: boolean;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  loadCart: () => {},
  addToCart: async () => ({ status: 200 }),
  removeFromCart: () => {},
  cart_Loading: false,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useContext(AuthContext);

  const [cart, setCart] = useState<CartItem[]>([]);
  // this state is to keep track of loading state of all the api in cart context
  const [cart_Loading, setCart_Loading] = useState(false);

  // useEffect(() => {
  //   loadCart();
  // }, [authState]);

  async function loadCart() {
    try {
      setCart_Loading(true);
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/cart/get`
      );

      console.log("cart loaded: ", res.data);

      if (res.data) {
        setCart(res.data.items);
      }
    } catch (error) {
      console.log("err while loading cart", error);
    } finally {
      setCart_Loading(false);
    }
  }

  async function addToCart(productId: string | number, quantity: number) {
    try {
      setCart_Loading(true);

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/cart/add`,
        {
          productId,
          quantity,
        }
      );

      if (res.status == 200) {
        console.log("added to cart: ", res.data);
        setCart(res.data.cart);
        return { status: 200 };
      }
    } catch (error) {
      console.log("error while adding to cart", error);
      return { status: 400 };
    } finally {
      setCart_Loading(false);
    }
  }

  async function removeFromCart(productId: string | number) {
    try {
      setCart_Loading(true);

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/cart/remove`,
        {
          productId: productId,
        }
      );

      if (res.status == 200) {
        console.log("removed from cart: ", res.data);
        setCart(res.data.cart.items);
      }
    } catch (error) {
      console.log("error while adding to cart", error);
    } finally {
      setCart_Loading(false);
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, loadCart, addToCart, removeFromCart, cart_Loading }}
    >
      {children}
    </CartContext.Provider>
  );
};
