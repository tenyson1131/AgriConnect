import { View, Text } from "react-native";
import { useState } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const index = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { authState, isLoading } = useAuth();
  console.log("authstate from index: ", authState);

  if (isLoading) {
    return <Text>Loading...</Text>; // Prevent redirection until token is checked
  }

  if (authState?.authenticated) {
    return <Redirect href="/user" />;
  }

  return <Redirect href="/auth" />;
};

export default index;
