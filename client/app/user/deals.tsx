import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DealScreen from "@/src/screens/DealScreen";

export default function deals() {
  return (
    // <View>
    //   <Text>deals</Text>
    // </View>
    <SafeAreaView className="flex-1">
      <DealScreen />
    </SafeAreaView>
  );
}
