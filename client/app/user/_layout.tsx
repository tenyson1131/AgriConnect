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
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";

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
  const { USER, loadUser } = useContext(UserContext);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (isFetching || USER) return;
      setIsFetching(true);
      await loadUser();
      setIsFetching(false);
    };

    fetchUser(); // Initial fetch

    const interval = setInterval(() => {
      fetchUser();
    }, 2000); // Retry every 5 seconds if USER is null

    return () => clearInterval(interval); // Cleanup on unmount
  }, [USER]); // Rerun when USER or isFetching changes

  if (!USER) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-bag" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        // options={{ tabBarStyle: { display: "none" } }}
        options={{
          title: "Category",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        // options={{ tabBarStyle: { display: "none" } }}
        options={{
          title: "AgriTalk",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            // <Feather name="user" size={24} color={color} />
            <MaterialCommunityIcons
              name="leaf-circle"
              size={24}
              color={"#649101"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        // options={{ tabBarStyle: { display: "none" } }}
        options={{
          href: null,
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
