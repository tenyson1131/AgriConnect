import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { UserContext } from "@/context/UserContext";

const ProfileScreen = ({ handleLogout }: { handleLogout: () => void }) => {
  const { USER } = useContext(UserContext);

  // Mock user data
  const user = {
    name: "User 1 (hardcoded)",
    email: "User.User@example.com",
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    level: "Gold Member",
    points: 0,
  };

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Custom Header with Curved Bottom */}
      <View className="relative">
        <LinearGradient colors={["#f3f4f6", "#ffffff"]} className="pt-4 pb-16">
          <View className="px-6 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="mr-3 w-10 h-10items-center justify-center "
                onPress={() => router.back()} // Navigate back
              >
                <Feather name="arrow-left" size={20} />
              </TouchableOpacity>
              <Text className="font-bold text-2xl text-gray-800">Profile</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="mr-4 w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                <Feather name="bell" size={18} color="#4b5563" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                <Feather name="settings" size={18} color="#4b5563" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Oval bottom edge */}
        <View
          className="absolute -bottom-6 left-0 right-0 h-12 bg-gray-50"
          style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        />

        {/* Floating Profile Card */}
        <View className="absolute left-6 right-6 bottom-0 transform translate-y-1/2 z-10">
          <View className="bg-white rounded-2xl p-5 shadow-md flex-row items-center border border-gray-100">
            {/* Profile Image with Level Ring */}
            <View className="relative">
              <View className="w-20 h-20 rounded-full border-2 border-emerald-400 p-1">
                {/* <Image
                  source={{ uri: user.profileImage }}
                  className="w-full h-full rounded-full"
                /> */}
                <View className="itecenter justify-center w-full h-full rounded-full bg-gray-100">
                  <Text className=" text-center text-4xl text-green-700">
                    {USER?.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full px-2 py-1 border border-white">
                <Text className="text-xs font-bold text-white">Lvl 0</Text>
              </View>
            </View>

            <View className="ml-4 flex-1">
              <Text className="font-bold text-lg text-gray-800">
                {/* {user.name} */}
                {USER?.name}
              </Text>
              <Text className="text-gray-500 text-sm mb-1">
                {/* {user.email} */}
                {USER?.email}
              </Text>

              {/* Points Progress */}
              <View className="mt-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs text-gray-500">Rewards Points</Text>
                  <Text className="text-xs font-medium text-emerald-600">
                    {user.points}/3000
                  </Text>
                </View>
                <View className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden">
                  <View
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                    style={{ width: `${(user.points / 3000) * 100}%` }}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity className="ml-2 p-2">
              <Feather name="edit-2" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 pt-24s pt-10 mt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards Row */}
        <View className="flex-row justify-between px-6 mt-4 mb-6">
          {[
            { label: "Orders", value: "27", icon: "package", color: "#818cf8" },
            { label: "Wishlist", value: "19", icon: "heart", color: "#f87171" },
            { label: "Coupons", value: "8", icon: "gift", color: "#fbbf24" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white p-3 rounded-2xl shadow-sm items-center justify-center"
              style={{ width: "30%" }}
            >
              <View
                className="w-10 h-10 rounded-full mb-2 items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Feather name={item.icon} size={18} color={item.color} />
              </View>
              <Text className="font-bold text-lg text-gray-800">
                {item.value}
              </Text>
              <Text className="text-xs text-gray-500">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Sections */}
        <View className="px-6 mb-6">
          {/* My Shopping Section */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-800 mb-3 px-1">
              MY SHOPPING
            </Text>
            <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {[
                {
                  icon: "shopping-bag",
                  label: "Orders",
                  description: "Track, return or buy again",
                },
                {
                  icon: "credit-card",
                  label: "Payment Methods",
                  description: "Manage your cards and wallets",
                },
                {
                  icon: "map-pin",
                  label: "Addresses",
                  description: "Your saved delivery locations",
                },
              ].map((item, index, array) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-4 ${
                    index !== array.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{
                      backgroundColor:
                        index === 0
                          ? "#10b98120"
                          : index === 1
                          ? "#6366f120"
                          : "#f59e0b20",
                    }}
                  >
                    <Feather
                      name={item.icon}
                      size={18}
                      color={
                        index === 0
                          ? "#10b981"
                          : index === 1
                          ? "#6366f1"
                          : "#f59e0b"
                      }
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-800">
                      {item.label}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {item.description}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferences Section */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-800 mb-3 px-1">
              PREFERENCES
            </Text>
            <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {[
                { icon: "bell", label: "Notifications", toggle: true },
                { icon: "globe", label: "Language", value: "English (US)" },
                { icon: "shield", label: "Privacy", chevron: true },
              ].map((item, index, array) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-4 ${
                    index !== array.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-100">
                    <Feather name={item.icon} size={18} color="#4b5563" />
                  </View>
                  <Text className="ml-3 flex-1 font-medium text-gray-800">
                    {item.label}
                  </Text>

                  {item.value && (
                    <Text className="text-gray-500 text-sm">{item.value}</Text>
                  )}

                  {item.toggle && (
                    <View className="w-12 h-6 bg-emerald-100 rounded-full px-0.5 items-center flex-row">
                      <View className="w-5 h-5 bg-emerald-500 rounded-full shadow-sm ml-auto" />
                    </View>
                  )}

                  {item.chevron && (
                    <Feather name="chevron-right" size={18} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Help Section */}
          <View className="mb-10">
            <Text className="text-sm font-semibold text-gray-800 mb-3 px-1">
              HELP & SUPPORT
            </Text>
            <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {[
                {
                  icon: "help-circle",
                  label: "Help Center",
                  description: "FAQs and customer support",
                },
                {
                  icon: "message-circle",
                  label: "Live Chat",
                  description: "Talk to our support team",
                },
              ].map((item, index, array) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-4 ${
                    index !== array.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-100">
                    <Feather
                      name={item.icon as any}
                      size={18}
                      color="#4b5563"
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-800">
                      {item.label}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {item.description}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity className="mb-10" onPress={handleLogout}>
            <LinearGradient
              colors={["#fde8e8", "#fecaca"]} // Soft pastel red gradient
              className="py-4 rounded-sm border border-red-300 shadow-sm"
            >
              <Text className="font-medium text-center text-red-700">
                Sign Out
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
