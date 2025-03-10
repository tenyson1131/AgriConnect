import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";
import toastConfig from "@/src/utils/toastConfig";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
