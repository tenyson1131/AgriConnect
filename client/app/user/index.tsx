import { View, Text, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function index() {
  const { onLogout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    const result = await onLogout!();

    router.replace("/auth");
  }
  return (
    <View>
      <Text>Homepage</Text>

      <Pressable className="bg-red-500 py-2" onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
