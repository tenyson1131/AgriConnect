import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import axios from "axios";

const index = () => {
  const router = useRouter();

  async function getProfileInfo() {
    console.log("get pr ino");
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/profile`
      );

      console.log("res.data: ", data);
    } catch (error) {
      console.log("details error", error);
    }
  }

  return (
    <View>
      <Text className="">Auth Page</Text>
      <Pressable
        className="bg-red-400 items-center py-2 my-5"
        onPress={() => {
          console.log("Login");
          router.push("/auth/login");
        }}
      >
        <Text>Login</Text>
      </Pressable>
      <Pressable
        className="bg-blue-400 items-center py-2 my-5"
        onPress={() => {
          console.log("Sign up");
          router.push("/auth/signup");
        }}
      >
        <Text>Sign up</Text>
      </Pressable>

      <View className="mt-5">
        <Text>Get profile info:</Text>
        <Pressable
          className="my-2 py-2 items-center bg-green-400"
          onPress={getProfileInfo}
        >
          <Text>Get profile info</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default index;
