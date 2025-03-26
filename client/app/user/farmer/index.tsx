import { View, Text, StatusBar } from "react-native";
import React from "react";
import ProductListingForm from "@/src/screens/farmer/ProductListingForm";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  return (
    // <View>
    //   <Text>index</Text>
    // </View>

    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor={"white"} />
      <ProductListingForm />
    </SafeAreaView>
  );
};

export default index;
