import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  return (
    <View>
      <Text>Auth Page</Text>
      <Pressable
        className="bg-red-400 items-center py-2 my-5"
        onPress={() => {
          console.log("Login");
          // router.push("/auth/login");
        }}
      >
        <Text>Login</Text>
      </Pressable>
      <Pressable
        className="bg-blue-400 items-center py-2 my-5"
        onPress={() => {
          console.log("Sign up");
          router.push("/auth/login");
        }}
      >
        <Text>Sign up</Text>
      </Pressable>
    </View>
  );
};

export default index;
