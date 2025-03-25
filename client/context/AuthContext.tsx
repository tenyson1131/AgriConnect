import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { UserInterface } from "@/src/types";

interface AuthContextType {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
  };
  onRegister?: (
    name: string,
    email: string,
    password: string,
    role?: "buyer" | "farmer",
    farmName?: string
  ) => Promise<any>;
  onVerifyOTP?: (email: string, otp: number) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  isLoading?: boolean;
}

const TOKEN_KEY = "jwt_token_key_212";

export const AuthContext = createContext<AuthContextType>({});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("stored token:", token);

      if (token) {
        setAuthState({
          token,
          authenticated: true,
        });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        setAuthState({
          token: null,
          authenticated: false,
        });
      }
      setIsLoading(false);
      console.log("out of loadToken");
    };

    loadToken();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: "buyer" | "farmer",
    farmName?: string
  ) => {
    try {
      return await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/auth/signup`,
        { name, email, password, role, farmName }
      );
    } catch (error) {
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const verifyOTP = async (email: string, otp: number) => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/auth/verify-otp`,
        { email, otp }
      );

      setAuthState({
        token: res.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      try {
        await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
        console.log("\n securestore done"); // ✅ If this prints, SecureStore worked.
      } catch (storeError) {
        console.error("SecureStore error:", storeError); // 🔴 Log the error if SecureStore fails.
      }

      return res;
    } catch (error) {
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/auth/login`,
        { email, password }
      );

      setAuthState({
        token: res.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      // await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
      try {
        await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
        console.log("\n securestore done"); // ✅ If this prints, SecureStore worked.
      } catch (storeError) {
        console.error("SecureStore error:", storeError); // 🔴 Log the error if SecureStore fails.
      }

      return res;
    } catch (error) {
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const logout = async () => {
    console.log("onlogout");
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onRegister: register,
    onVerifyOTP: verifyOTP,
    onLogin: login,
    onLogout: logout,
    authState,
    isLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
