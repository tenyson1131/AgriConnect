import { View, Text, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import HomeScreen from "@/src/screens/HomeScreen";

export default function home() {
  const { onLogout } = useAuth();
  const router = useRouter();
  return (
    // <View>
    //   <Text>Homepage</Text>

    //   <View className="flex-row justify-between px-5">
    //     <View>
    //       <Text>ADRESS</Text>
    //     </View>

    //     <View>
    //       <Pressable
    //         className="bg-red-500 py-2"
    //         onPress={() => router.push("/user/profile")}
    //       >
    //         <Text>Profile</Text>
    //       </Pressable>
    //     </View>
    //   </View>
    // </View>
    <HomeScreen />
  );
}
