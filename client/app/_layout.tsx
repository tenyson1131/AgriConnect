import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";
import toastConfig from "@/src/utils/toastConfig";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </CartProvider>
    </AuthProvider>
  );
}
