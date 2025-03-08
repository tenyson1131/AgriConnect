import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import LoginScreen from "@/src/screens/LoginScreen";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { onLogin } = useAuth();

  const router = useRouter();

  async function handleLogin() {
    console.log("login btn pressed", email, password);
    if (!email || !password) {
      alert("Please fill the form");
      return;
    }

    const result = await onLogin!(email, password);
    if (result) {
      console.log("login result: ", result.status);

      if (result.status == 200) {
        router.replace("/user");
      }
    }
  }
  return (
    // <View>
    //   <Text>login Page</Text>
    //   <TextInput
    //     placeholder="email"
    //     className="border my-4"
    //     value={email}
    //     onChangeText={(text) => setEmail(text)}
    //   />
    //   <TextInput
    //     placeholder="password"
    //     className="border my-4"
    //     value={password}
    //     onChangeText={(text) => setPassword(text)}
    //   />

    //   <Pressable
    //     className="bg-blue-400 items-center py-2 my-5"
    //     onPress={handleLogin}
    //   >
    //     <Text>Sign up btn pressed</Text>
    //   </Pressable>
    // </View>
    <LoginScreen navigation={router} />
  );
}
