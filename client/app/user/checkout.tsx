import { View, Text } from "react-native";
import React from "react";
import CheckoutScreen from "@/src/screens/CheckoutScreen";
import { SafeAreaView } from "react-native-safe-area-context";

const checkout = () => {
  return (
    // <View>
    //   <Text>checkout</Text>
    // </View>
    <SafeAreaView className="flex-1">
      <CheckoutScreen />
    </SafeAreaView>
  );
};

export default checkout;
