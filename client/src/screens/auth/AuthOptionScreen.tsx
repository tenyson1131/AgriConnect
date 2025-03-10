import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function AuthOptionsScreen({ navigation }) {
  // const [fontsLoaded] = useFonts({
  //   'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  //   'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  //   'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  //   'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <View className="flex-1 bg-[#111827]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 pt-10 pb-6">
          {/* Brand Identity */}
          <View className="items-center mb-12">
            <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] items-center justify-center">
              <Ionicons name="leaf" size={36} color="white" />
            </View>
            <Text className="font-['Poppins-Bold'] text-white text-xl mt-3">
              FarmConnect
            </Text>
          </View>

          {/* Main Content */}
          <View className="flex-1">
            {/* Welcome Message */}
            <Text className="font-['Poppins-Medium'] text-white text-xl mb-1">
              Welcome
            </Text>
            <Text className="font-['Poppins-Regular'] text-[#94a3b8] text-sm mb-8">
              Sign in to access your personalized experience
            </Text>

            {/* User Type Selection */}
            <View className="mb-8">
              <Text className="font-['Poppins-Medium'] text-white text-base mb-3">
                Choose your role:
              </Text>
              <View className="flex-row space-x-0">
                <TouchableOpacity
                  className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-l-2xl py-5 px-4 border-r border-[#1e293b]"
                  onPress={() =>
                    navigation.navigate("SignUp", { userType: "farmer" })
                  }
                >
                  <View className="items-center">
                    <View className="w-12 h-12 rounded-full bg-[#4f46e5]/20 items-center justify-center mb-2">
                      <FontAwesome5 name="seedling" size={22} color="#8b5cf6" />
                    </View>
                    <Text className="font-['Poppins-SemiBold'] text-white text-base">
                      Farmer
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-r-2xl py-5 px-4"
                  onPress={() =>
                    navigation.navigate("SignUp", { userType: "buyer" })
                  }
                >
                  <View className="items-center">
                    <View className="w-12 h-12 rounded-full bg-[#8b5cf6]/20 items-center justify-center mb-2">
                      <FontAwesome5
                        name="shopping-basket"
                        size={22}
                        color="#a78bfa"
                      />
                    </View>
                    <Text className="font-['Poppins-SemiBold'] text-white text-base">
                      Buyer
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Authentication Options */}
            <View className="space-y-4 mb-8">
              <TouchableOpacity
                className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] rounded-xl py-4"
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text className="font-['Poppins-SemiBold'] text-white text-center">
                  Create Account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#1e293b] rounded-xl py-4 border border-[#334155]"
                onPress={() => navigation.navigate("Login")}
              >
                <Text className="font-['Poppins-Medium'] text-white text-center">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-px bg-[#334155]" />
              <Text className="font-['Poppins-Regular'] text-[#94a3b8] mx-3">
                or continue with
              </Text>
              <View className="flex-1 h-px bg-[#334155]" />
            </View>

            {/* Social Login */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-[#1e293b] rounded-xl py-4 border border-[#334155]"
              onPress={() => console.log("Google Sign In")}
            >
              <View className="w-5 h-5 bg-white rounded-full items-center justify-center mr-3">
                <FontAwesome5 name="google" size={10} color="#4285F4" />
              </View>
              <Text className="font-['Poppins-Medium'] text-white">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Terms & Privacy */}
            <View className="mt-auto">
              <Text className="font-['Poppins-Regular'] text-[#64748b] text-xs text-center">
                By continuing, you agree to our Terms of Service & Privacy
                Policy
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
