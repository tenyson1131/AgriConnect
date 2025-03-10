// import { View, Text } from "react-native";
// import React from "react";
// import { Stack } from "expo-router";

// export default function _layout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//     </Stack>
//   );
// }

import { Tabs } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Pressable, TouchableOpacity } from "react-native";

// Custom tab bar button to fix type errors
const TabBarButton = (props: any) => {
  const { children, onPress, accessibilityState } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      accessibilityState={accessibilityState}
    >
      {children}
    </TouchableOpacity>
  );
};

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          // left: "5%",
          // right: "5%",
          // width: "90%",
          marginHorizontal: 16,
          // elevation: 0,
          backgroundColor: "white",
          borderRadius: 12,
          height: 60,
          // shadowColor: "#000",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 0.3,
          paddingTop: 5,
          paddingBottom: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "System",
        },

        tabBarActiveTintColor: "#5a9d42",
        tabBarInactiveTintColor: "#888",
        // tabbarpre

        tabBarButton: (props) => <TabBarButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="home"
        // options={{ headerShown: false }}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="deals"
        // options={{ tabBarStyle: { display: "none" } }}
        options={{
          title: "Deals",
          tabBarIcon: ({ color }) => (
            <Feather name="tag" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        // options={{ tabBarStyle: { display: "none" } }}
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-bag" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        // options={{ tabBarStyle: { display: "none" } }}
        options={{
          title: "Profile",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
