import { View, Text } from "react-native";
import React, { useEffect } from "react";
import axios from "axios";

export default function details() {
  useEffect(() => {
    console.log("in details@#");
    async function getData() {
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/profile`
        );

        console.log("res.data: ", data);
      } catch (error) {
        console.log("details error", error);
      }
    }
    getData();
  }, []);
  return (
    <View>
      <Text>details</Text>
    </View>
  );
}
