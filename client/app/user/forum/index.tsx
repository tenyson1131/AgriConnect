import { View, Text } from "react-native";
import React from "react";
import ForumScreen from "@/src/screens/forum/ForumScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const index = () => {
  return (
    // <View>
    //   <Text>forum</Text>
    // </View>
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <ForumScreen />
    </SafeAreaView>
  );
};

export default index;
