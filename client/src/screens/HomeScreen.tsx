import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Entypo,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

const categories = [
  { id: 1, name: "Fruits", icon: "🍎" },
  { id: 2, name: "Vegetables", icon: "🥦" },
  { id: 3, name: "Dairy", icon: "🥛" },
  { id: 4, name: "Meat", icon: "🥩" },
  { id: 5, name: "Grain", icon: "🌾" },
];

const products = [
  {
    id: 1,
    name: "Fresh Apples",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
    rating: 4.5,
    farmName: "Green Valley",
  },
  {
    id: 2,
    name: "Organic Tomatoes",
    price: 2.49,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337",
    rating: 4.7,
    farmName: "Sunshine Farms",
  },
  {
    id: 3,
    name: "Farm Eggs",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f",
    rating: 4.8,
    farmName: "Happy Hens",
  },
  {
    id: 4,
    name: "Fresh Milk",
    price: 3.29,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
    rating: 4.6,
    farmName: "Dairy Delight",
  },
];

const HomeScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white pb-16">
      <ScrollView className="flex-1">
        {/* Location and Profile Section */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <View className="flex-row items-center">
            <Entypo name="location-pin" size={20} color="#5a9d42" />
            <View className="ml-1">
              <Text className="text-gray-500 text-xs">Your Location</Text>
              <View className="flex-row items-center">
                <Text className="font-semibold text-base">xuyASdz, ABC</Text>
                <Feather name="chevron-down" size={16} color="#5a9d42" />
              </View>
            </View>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            onPress={() => router.push("/user/profile")}
          >
            <Feather name="user" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View className="flex-row px-4 mb-4">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2">
            <Feather name="search" size={20} color="#888" />
            <TextInput
              placeholder="Search fresh produce..."
              className="flex-1 ml-2 text-base"
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity className="bg-agri-green-500 w-12 h-12 rounded-full items-center justify-center">
            <Feather name="sliders" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mb-4">
          <Text className="font-bold text-lg px-4 mb-3">Shop by Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="items-center mr-4 bg-gray-100 rounded-lg p-3 min-w-20"
              >
                <Text className="text-xl mb-1">{category.icon}</Text>
                <Text className="font-medium">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Deals Banner */}
        <View className="px-4 mb-4">
          <View className="bg-agri-green-100 rounded-xl p-4s flex-rows items-betweens sjustify-center">
            <View className="flex-1 flex-row justify-between borders">
              <View className="borders">
                <Text className="text-agri-green-800 font-bold text-lg">
                  Top Deals of the Week
                </Text>
                <Text className="text-agri-green-700 mt-1s">
                  Get up to 30% off on seasonal produce
                </Text>
              </View>
              <TouchableOpacity className="borders bg-agri-green-500 rounded-full px-4s spy-2 smt-2 self-start">
                <Text className="text-black font-medium">Shop Now</Text>
              </TouchableOpacity>
            </View>
            {/*  */}
            <View className="mt-4">
              <Image
                source={require("@/assets/images/dealsBanner.jpg")}
                className="w-full h-40 rounded-lg"
              />
            </View>

            {/* <Image
              source={{
                uri: "https://img.freepik.com/free-vector/grocery-store-sale-banner-template_23-2151089846.jpg?t=st=1741505296~exp=1741508896~hmac=ee7e2b6fefb0e179ccdd014b90888aac0fac0c1e22c3bdfb46708ec59221e696&w=1060",
              }}
              className="w-20 h-20 rounded-lg"
            /> */}
          </View>
        </View>

        {/* Top Selling */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="font-bold text-lg">Top Selling Products</Text>
            <TouchableOpacity>
              <Text className="text-agri-green-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="px-4 flex-row flex-wrap justify-between">
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="bg-white rounded-xl mb-4 shadow-sm w-[48%] overflow-hidden border border-gray-100"
              >
                <Image
                  source={{ uri: product.image }}
                  className="w-full h-24 rounded-t-xl"
                />
                <View className="p-2">
                  <View className="flex-row items-center">
                    <Text className="text-xs text-gray-500">
                      {product.farmName}
                    </Text>
                    <View className="flex-row items-center ml-auto">
                      <Text className="text-xs text-yellow-500">★</Text>
                      <Text className="text-xs ml-1">{product.rating}</Text>
                    </View>
                  </View>
                  <Text className="font-medium mt-1">{product.name}</Text>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="font-bold text-agri-green-700">
                      ${product.price}
                    </Text>
                    <TouchableOpacity className="bg-agri-green-500 rounded-full w-7 h-7 items-center justify-center">
                      <Text className="text-white font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View className="absolute bottom-5s top-[680px] left-4 right-4 bg-white rounded-2xl shadow-lg py-3 px-2 flex-row justify-around">
        <TouchableOpacity className="items-center">
          <Feather name="home" size={24} color="#5a9d42" />
          <Text className="text-xs mt-1 font-medium text-agri-green-500">
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="tag" size={24} color="#888" />
          <Text className="text-xs mt-1 text-gray-500">Deals</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="shopping-bag" size={24} color="#888" />
          <Text className="text-xs mt-1 text-gray-500">Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="user" size={24} color="#888" />
          <Text className="text-xs mt-1 text-gray-500">Profile</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default HomeScreen;
