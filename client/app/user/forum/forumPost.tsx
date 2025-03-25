import { View, Text } from "react-native";
import React from "react";
import ForumPostScreen from "@/src/screens/forum/ForumPostScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const forumPost = () => {
  return (
    // <View>
    //   <Text>forumPost</Text>
    // </View>
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <ForumPostScreen />
    </SafeAreaView>
  );
};

export default forumPost;
