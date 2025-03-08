import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import axios from "axios";

export default function login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    console.log("Signup btn pressed", name, email, password);
    if (!name || !email || !password) {
      alert("Please fill the form");
      return;
    }

    try {
      const res = await axios.post(
        process.env.EXPO_PUBLIC_SERVER_URL + "/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      console.log(res);
    } catch (error) {
      console.log("error wile signup", error);
    }
  }
  return (
    <View>
      <Text>login Page</Text>
      <TextInput
        placeholder="name"
        className="border my-4"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="email"
        className="border my-4"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="password"
        className="border my-4"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Pressable
        className="bg-blue-400 items-center py-2 my-5"
        onPress={handleSignup}
      >
        <Text>Sign up btn pressed</Text>
      </Pressable>
    </View>
  );
}
