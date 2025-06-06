import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import ProfileScreen from "@/src/screens/ProfileScreen";

export default function index() {
  const router = useRouter();
  const { onLogout } = useAuth();

  async function handleLogout() {
    // console.log("in handle logout");
    const result = await onLogout!();

    router.replace("/auth");
  }
  return (
    // <View>
    //   <Text>Profile in index</Text>
    //   <Pressable
    //     className="py-2 bg-blue-300"
    //     onPress={() => router.push("/user/profile/details")}
    //   >
    //     <Text>Go to details</Text>
    //   </Pressable>

    //   <Pressable className="bg-red-500 py-2" onPress={handleLogout}>
    //     <Text>Logout</Text>
    //   </Pressable>
    // </View>
    <ProfileScreen handleLogout={handleLogout} />
  );
}
