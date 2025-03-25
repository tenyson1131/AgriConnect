import { View, Text } from "react-native";
import React from "react";
import CreatePostScreen from "@/src/screens/forum/CreatePostScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const createPost = () => {
  return (
    // <View>
    //   <Text>createPost</Text>
    // </View>
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <CreatePostScreen />
    </SafeAreaView>
  );
};

export default createPost;
