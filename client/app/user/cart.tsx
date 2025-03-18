import { View, Text } from "react-native";
import React from "react";
import CartScreen from "@/src/screens/CartScreen";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

export default function cart() {
  return (
    // <View>
    //   <Text>cart</Text>
    // </View>
    <CartScreen />
  );
}
