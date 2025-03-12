import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ navigation, route }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // In a real app, you would get this data from route.params or an API
  const product = {
    id: 1,
    name: "Organic Spinach Leaf",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
    rating: 4.8,
    reviews: 245,
    farmName: "Green Valley Farms",
    description:
      "Spinach (Spinacia oleracea) is a leafy green vegetable that originated in Persia. It belongs to the amaranth family. It has tender, edible leaves which can be eaten raw or cooked. Spinach is rich in iron, vitamins, and antioxidants.",
    benefits: [
      "Rich in vitamins A, C, and K",
      "High iron content",
      "Excellent source of antioxidants",
      "Supports eye health",
      "Helps reduce blood pressure",
    ],
    tips: [
      {
        title: "Temperature",
        value: "18-25°C",
        icon: "thermometer",
      },
      {
        title: "Freshness",
        value: "1 hour",
        icon: "clock",
      },
      {
        title: "Size",
        value: "30 ML",
        icon: "droplet",
      },
    ],
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const toggleFavorite = () => setIsFavorite((prev) => !prev);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 absolute top-0 left-0 right-0 z-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
          >
            <Feather name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleFavorite}
            className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
          >
            <Feather
              name={isFavorite ? "heart" : "heart"}
              size={20}
              color={isFavorite ? "#FF6B6B" : "#666"}
            />
          </TouchableOpacity>
        </View>

        {/* Product Image with Gradient */}
        <View className="w-full aspect-square relative">
          <LinearGradient
            colors={["rgba(242, 248, 240, 1)", "rgba(255, 255, 255, .8)"]}
            className="absolute inset-0"
          />
          <Image
            source={{ uri: product.image }}
            className="w-full h-full p-8"
            resizeMode="contain"
          />

          {/* Organic Badge */}
          <View className="absolute left-4 bottom-4 bg-[#5a9d42] rounded-full w-10 h-10 items-center justify-center">
            <Feather name="check" size={18} color="white" />
          </View>

          {/* Page indicator dots */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            <View className="h-1.5 w-6 rounded-full bg-[#5a9d42] mx-0.5" />
            <View className="h-1.5 w-1.5 rounded-full bg-gray-300 mx-0.5" />
            <View className="h-1.5 w-1.5 rounded-full bg-gray-300 mx-0.5" />
          </View>
        </View>

        {/* Product Info Container */}
        <View className="px-5 pt-6 pb-24">
          {/* Product Title and Rating */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 tracking-tight mb-1">
                {product.name}
              </Text>
              <Text className="text-[#5a9d42] font-medium text-base">
                {product.farmName}
              </Text>
            </View>
            <View className="bg-[#f3f8f0] rounded-xl px-3 py-1.5">
              <View className="flex-row items-center">
                <Feather name="star" size={16} color="#f59e0b" />
                <Text className="font-semibold ml-1 mr-0.5">
                  {product.rating}
                </Text>
                <Text className="text-gray-500 text-xs">
                  ({product.reviews})
                </Text>
              </View>
            </View>
          </View>

          {/* Price and Add to Cart Section (Moved from bottom) */}
          <View className="bg-[#f7f9f5] rounded-2xl p-4 mb-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-500 text-sm">Price</Text>
                <Text className="text-2xl font-bold text-[#5a9d42]">
                  ${product.price}
                </Text>
              </View>

              <View className="flex-row items-center">
                {/* Quantity Control */}
                <View className="flex-row items-center bg-white rounded-full mr-3 p-1">
                  <TouchableOpacity
                    onPress={decreaseQuantity}
                    className="w-8 h-8 rounded-full items-center justify-center"
                  >
                    <Feather name="minus" size={16} color="#5a9d42" />
                  </TouchableOpacity>
                  <Text className="w-8 text-center font-semibold">
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={increaseQuantity}
                    className="w-8 h-8 rounded-full items-center justify-center"
                  >
                    <Feather name="plus" size={16} color="#5a9d42" />
                  </TouchableOpacity>
                </View>

                {/* Add to Basket Button */}
                <TouchableOpacity className="bg-[#5a9d42] rounded-full py-3 px-5 shadow-md">
                  <Feather name="shopping-bag" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </Text>
            <Text className="text-gray-600 leading-6 tracking-wide">
              {product.description}
            </Text>
          </View>

          {/* Health Benefits */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Health Benefits
            </Text>
            <View className="bg-[#f7f9f5] rounded-2xl p-4">
              {product.benefits.map((benefit, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="w-2 h-2 rounded-full bg-[#5a9d42] mr-3" />
                  <Text className="text-gray-700">{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tips Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Tips to keep it fresh
            </Text>
            <View className="flex-row justify-between">
              {product.tips.map((tip, index) => (
                <View
                  key={index}
                  className="bg-[#f3f8f0] rounded-2xl p-4 w-[31%] items-center"
                >
                  <View className="w-10 h-10 rounded-full bg-[#5a9d42] items-center justify-center mb-2">
                    <Feather name={tip.icon} size={18} color="white" />
                  </View>
                  <Text className="text-gray-500 text-xs mb-1">
                    {tip.title}
                  </Text>
                  <Text className="font-semibold text-gray-800">
                    {tip.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Related Products Section */}
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              You might also like
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {[1, 2, 3].map((item) => (
                <View
                  key={item}
                  className="bg-white rounded-2xl shadow-sm p-3 mr-4 w-32"
                >
                  <View className="bg-[#f7f9f5] rounded-xl p-2 mb-2">
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
                      }}
                      className="w-full h-20"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="font-medium text-gray-800" numberOfLines={2}>
                    Organic{" "}
                    {item === 1 ? "Kale" : item === 2 ? "Lettuce" : "Arugula"}
                  </Text>
                  <Text className="text-[#5a9d42] font-semibold mt-1">
                    ${(2.99 + item * 0.5).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
