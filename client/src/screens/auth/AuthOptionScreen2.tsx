import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

export default function AuthOptionScreen2() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    Animated.timing(animatedValue, {
      toValue: tab === "login" ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const indicatorPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2 - 20],
  });

  return (
    <View className="flex-1 bg-blacks bg-gray-800">
      <StatusBar style="light" />

      {/* Abstract background patterns */}
      <View className="absolute top-0 right-0 h-64 w-64 opacity-40">
        <View className="absolute top-10 right-10 h-32 w-32 rounded-full bg-emerald-400 opacity-60" />
        <View className="absolute top-20 right-20 h-40 w-40 rounded-full bg-amber-400 opacity-40" />
      </View>
      <View className="absolute bottom-0 left-0 h-64 w-64 opacity-40">
        <View className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-emerald-500 opacity-50" />
        <View className="absolute bottom-30 left-20 h-32 w-32 rounded-full bg-amber-500 opacity-30" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow">
          <View className="flex-1 px-6 py-12">
            {/* Logo and Header */}
            <View className="items-center mt-6 mb-8">
              <View className="flex-row items-center justify-center mb-4">
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  className="p-3 rounded-2xl rotate-12"
                >
                  <MaterialCommunityIcons name="leaf" size={28} color="white" />
                </LinearGradient>
                <View className="-ml-2 -rotate-12">
                  <LinearGradient
                    colors={["#f59e0b", "#d97706"]}
                    className="p-3 rounded-2xl"
                  >
                    <MaterialCommunityIcons
                      name="basket"
                      size={28}
                      color="white"
                    />
                  </LinearGradient>
                </View>
              </View>
              <Text className="text-4xl font-bold text-white">
                <Text className="text-emerald-400">Agri</Text>
                <Text className="text-amber-400">Connect</Text>
              </Text>
              <View className="bg-white/10 rounded-full px-4 py-1 mt-3">
                <Text className="text-white/80 text-sm">
                  Farm Fresh. Direct Connect.
                </Text>
              </View>
            </View>

            {/* Main Content Card */}
            <BlurView
              intensity={30}
              tint="dark"
              className="overflow-hidden rounded-3xl mt-4 mb-4"
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
                className="rounded-3xl p-5 border border-white/20"
              >
                {/* Tab Selector */}
                <View className="flex-row bg-white/10 rounded-xl p-1 mb-6">
                  <TouchableOpacity
                    onPress={() => handleTabChange("login")}
                    className="flex-1 items-center py-3 z-10"
                  >
                    <Text
                      className={`font-medium ${
                        activeTab === "login" ? "text-white" : "text-white/60"
                      }`}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleTabChange("signup")}
                    className="flex-1 items-center py-3 z-10"
                  >
                    <Text
                      className={`font-medium ${
                        activeTab === "signup" ? "text-white" : "text-white/60"
                      }`}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                  <Animated.View
                    style={{
                      position: "absolute",
                      left: indicatorPosition,
                      top: 4,
                      width: width / 2 - 20,
                      height: 38,
                      backgroundColor: "rgba(16, 185, 129, 0.3)",
                      borderRadius: 10,
                    }}
                  />
                </View>

                {activeTab === "login" ? (
                  <View className="space-y-5">
                    <TouchableOpacity
                      className="bg-emerald-500 rounded-xl py-4 px-6 flex-row items-center justify-center"
                      onPress={() => router.push("/auth/login")}
                    >
                      <Feather
                        name="log-in"
                        size={20}
                        color="white"
                        className="mr-2"
                      />
                      <Text className="text-white text-center font-semibold text-lg ml-2">
                        Login with Email
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center my-4">
                      <View className="flex-1 h-px bg-white/20" />
                      <Text className="mx-4 text-white/60">
                        or continue with
                      </Text>
                      <View className="flex-1 h-px bg-white/20" />
                    </View>

                    <TouchableOpacity
                      className="bg-white/10 backdrop-blur-md rounded-xl py-4 px-6 flex-row items-center justify-center border border-white/20"
                      onPress={() => console.log("Google sign in")}
                    >
                      <FontAwesome5 name="google" size={20} color="#EA4335" />
                      <Text className="text-white text-center font-semibold text-lg ml-3">
                        Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="gap-5">
                    <TouchableOpacity
                      className="bg-amber-500 rounded-xl py-4 px-6 flex-row items-center justify-center mb-5s"
                      onPress={() => router.push("/auth/signup?type=buyer")}
                    >
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        size={20}
                        color="white"
                        className="mr-2"
                      />
                      <Text className="text-white text-center font-semibold text-lg ml-2">
                        Sign Up as Buyer
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-emerald-500 rounded-xl py-4 px-6 flex-row items-center justify-center"
                      onPress={() => router.push("/auth/signup?type=farmer")}
                    >
                      <MaterialCommunityIcons
                        name="tractor-variant"
                        size={20}
                        color="white"
                        className="mr-2"
                      />
                      <Text className="text-white text-center font-semibold text-lg ml-2">
                        Sign Up as Farmer
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center my-2">
                      <View className="flex-1 h-px bg-white/20" />
                      <Text className="mx-4 text-white/60">or</Text>
                      <View className="flex-1 h-px bg-white/20" />
                    </View>

                    <TouchableOpacity
                      className="bg-white/10 backdrop-blur-md rounded-xl py-4 px-6 flex-row items-center justify-center border border-white/20"
                      onPress={() => console.log("Google sign up")}
                    >
                      <FontAwesome5 name="google" size={20} color="#EA4335" />
                      <Text className="text-white text-center font-semibold text-lg ml-3">
                        Sign Up with Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View className="flex-row justify-center mt-6 mb-1">
                  <Text className="text-white/60 text-sm">
                    By continuing, you agree to our{" "}
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-emerald-400 text-sm">Terms</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>

            {/* Animated decorative elements */}
            <View className="items-center justify-center flex-row mt-10 mb-4 space-x-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <View
                  key={item}
                  className={`h-2 rounded-full ${
                    item % 2 === 0 ? "bg-emerald-500 w-8" : "bg-amber-500 w-4"
                  } opacity-50`}
                />
              ))}
            </View>

            {/* Brand feature tiles */}
            <View className="flex-row justify-around mt-6">
              <View className="items-center">
                <View className="bg-amber-500/20 p-3 rounded-lg">
                  <MaterialCommunityIcons
                    name="truck-fast-outline"
                    size={22}
                    color="#f59e0b"
                  />
                </View>
                <Text className="text-white/70 text-xs mt-2">
                  Fast Delivery
                </Text>
              </View>
              <View className="items-center">
                <View className="bg-emerald-500/20 p-3 rounded-lg">
                  <MaterialCommunityIcons
                    name="leaf"
                    size={22}
                    color="#10b981"
                  />
                </View>
                <Text className="text-white/70 text-xs mt-2">100% Organic</Text>
              </View>
              <View className="items-center">
                <View className="bg-amber-500/20 p-3 rounded-lg">
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={22}
                    color="#f59e0b"
                  />
                </View>
                <Text className="text-white/70 text-xs mt-2">
                  Direct from Farmers
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
