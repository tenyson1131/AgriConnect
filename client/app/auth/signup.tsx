import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import SignUpScreen from "@/src/screens/auth/SignUpScreen";

export default function signup() {
  const { type } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { onRegister } = useAuth();
  const router = useRouter();

  // async function handleSignup() {
  //   console.log("Signup btn pressed", name, email, password);
  //   if (!name || !email || !password) {
  //     alert("Please fill the form");
  //     return;
  //   }

  //   const result = await onRegister!(name, email, password);
  //   if (result) {
  //     console.log("Signup result: ", result);
  //   }
  // }
  return (
    // <View>
    //   <Text>signup Page</Text>
    //   <TextInput
    //     placeholder="name"
    //     className="border my-4"
    //     value={name}
    //     onChangeText={(text) => setName(text)}
    //   />
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
    //     onPress={handleSignup}
    //   >
    //     <Text>Sign up btn pressed</Text>
    //   </Pressable>
    // </View>
    <SignUpScreen navigation={router} type={type} />
  );
}
