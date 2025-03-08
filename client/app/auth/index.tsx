import { View, Text, Pressable } from "react-native";
import React from "react";

const index = () => {
  return (
    <View>
      <Text>Auth Page</Text>
      <Pressable
        className="bg-red-400 items-center py-2 my-5"
        onPress={() => console.log("Login")}
      >
        <Text>Login</Text>
      </Pressable>
      <Pressable
        className="bg-blue-400 items-center py-2 my-5"
        onPress={() => console.log("Sign up")}
      >
        <Text>Sign up</Text>
      </Pressable>
    </View>
  );
};

export default index;
