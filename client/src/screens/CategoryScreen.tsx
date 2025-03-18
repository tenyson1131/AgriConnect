import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductContext } from "@/context/ProductContext";

const { width } = Dimensions.get("window");

const categories = [
  { name: "Fruits", icon: "nutrition-outline" },
  { name: "Vegetables", icon: "leaf-outline" },
  { name: "Herbs and Spices", icon: "flower-outline" },
  { name: "Grains and Pulses", icon: "grain-outline" },
  { name: "Nuts and Dry Fruits", icon: "sunny-outline" },
  { name: "Dairy and Animal Products", icon: "water-outline" },
  { name: "Organic and Specialty Products", icon: "leaf-outline" },
  { name: "Handmade Pickles", icon: "flask-outline" },
  { name: "Farming Inputs and Supplies", icon: "construct-outline" },
  { name: "Handmade Snacks", icon: "pizza-outline" },
];

// Category-specific banners and titles
const categoryDetails = {
  Vegetables: {
    banner: "https://via.placeholder.com/800x200",
    title: "Organic Vegetables",
    subtitle: "Fresh from the farm",
    color: "#4CAF50", // Green
    textColor: "white",
  },
  Fruits: {
    banner: "https://via.placeholder.com/800x200",
    title: "Fresh Fruits",
    subtitle: "Sweet & Juicy Selection",
    color: "#FF9800", // Orange
    textColor: "white",
  },
  "Dairy and Animal Products": {
    banner: "https://via.placeholder.com/800x200",
    title: "Dairy Products",
    subtitle: "Farm Fresh Everyday",
    color: "#2196F3", // Blue
    textColor: "white",
  },
  "Handmade Snacks": {
    banner: "https://via.placeholder.com/800x200",
    title: "Bakery Items",
    subtitle: "Freshly Baked Goodness",
    color: "#795548", // Brown
    textColor: "white",
  },
  "Organic and Specialty Products": {
    banner: "https://via.placeholder.com/800x200",
    title: "Quality Products",
    subtitle: "Premium Selection",
    color: "#F44336", // Red
    textColor: "white",
  },
  "Handmade Pickles": {
    banner: "https://via.placeholder.com/800x200",
    title: "Handmade Pickles",
    subtitle: "Traditional Tastes",
    color: "#03A9F4", // Light Blue
    textColor: "white",
  },
  "Grains and Pulses": {
    banner: "https://via.placeholder.com/800x200",
    title: "Grains & Pulses",
    subtitle: "Pure & Natural",
    color: "#9C27B0", // Purple
    textColor: "white",
  },
  "Nuts and Dry Fruits": {
    banner: "https://via.placeholder.com/800x200",
    title: "Nuts & Dry Fruits",
    subtitle: "Healthy & Nutritious",
    color: "#8BC34A", // Light Green
    textColor: "white",
  },
  "Herbs and Spices": {
    banner: "https://via.placeholder.com/800x200",
    title: "Herbs & Spices",
    subtitle: "Aromatic & Flavorful",
    color: "#FF5722", // Deep Orange
    textColor: "white",
  },
  "Farming Inputs and Supplies": {
    banner: "https://via.placeholder.com/800x200",
    title: "Farming Supplies",
    subtitle: "Quality Farm Inputs",
    color: "#607D8B", // Blue Grey
    textColor: "white",
  },
};

const CategoryScreen = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  console.log("params:", category);
  const categoryScrollRef = useRef(null);

  const { products } = useContext(ProductContext);

  // selectedCategory from URL params or default to "Vegetables"
  const [selectedCategory, setSelectedCategory] = useState(
    category || "Vegetables"
  );

  // This will hold the filtered products based on the selected category
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    // Filter products based on selected category
    if (products && products.length > 0) {
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory, products]);

  // Scroll to the selected category when component mounts or category changes
  useEffect(() => {
    if (categoryScrollRef.current) {
      const selectedIndex = categories.findIndex(
        (cat) => cat.name === selectedCategory
      );
      if (selectedIndex !== -1) {
        setTimeout(() => {
          const scrollToX = selectedIndex * (width * 0.25);
          categoryScrollRef?.current?.scrollTo({
            x: scrollToX,
            animated: true,
          });
        }, 100);
      }
    }
  }, [selectedCategory]);

  // Render stars for ratings
  const RatingStars = ({ rating }) => {
    return (
      <View className="flex-row">
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={
              i < Math.floor(rating)
                ? "star"
                : i < rating
                ? "star-half"
                : "star-outline"
            }
            size={12}
            color="#f59e0b"
          />
        ))}
        <Text className="text-xs text-gray-500 ml-1">{rating}</Text>
      </View>
    );
  };

  // Function to format price
  const formatPrice = (price) => {
    return `₹${price}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="light" />

      {/* Category Banner Section  */}
      <View
        className="overflow-hidden rounded-b-3xl"
        style={{
          backgroundColor:
            categoryDetails[selectedCategory]?.color || "#4CAF50",
        }}
      >
        {/* Header with Back Button */}
        <View className="pt-10 px-4 pb-3 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <View className="flex-row">
            <TouchableOpacity className="p-1 mr-2">
              <Ionicons name="heart-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <Ionicons name="ellipsis-vertical" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner Content */}
        <View className="px-4 pb-4 flex-row">
          <View className="flex-1">
            <Text className="text-white text-sm opacity-80">fresh</Text>
            <Text className="text-white font-bold text-2xl mt-1">
              {categoryDetails[selectedCategory]?.title || selectedCategory}
            </Text>

            <TouchableOpacity className="flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-1 mt-2 self-start">
              <Ionicons name="location-outline" size={14} color="white" />
              <Text className="text-white text-xs ml-1">
                ..............................
              </Text>
            </TouchableOpacity>

            {/* Rating dots */}
            <View className="flex-row mt-3">
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-white mr-1"
                  style={{ opacity: i < 4 ? 1 : 0.5 }}
                />
              ))}
            </View>
          </View>

          {/* Banner Image */}
          <View className="w-32 h-32 rounded-2xl overflow-hidden bg-white bg-opacity-20">
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Categories Tab  */}
      <View className="mt-4 px-2">
        <ScrollView
          ref={categoryScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-1"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              onPress={() => setSelectedCategory(category.name)}
              className={`px-4 py-3 mx-1.5 rounded-xl flex-row items-center ${
                selectedCategory === category.name
                  ? "bg-opacity-10"
                  : "bg-white"
              }`}
              style={
                selectedCategory === category.name
                  ? {
                      backgroundColor: `${
                        categoryDetails[category.name]?.color || "#4CAF50"
                      }20`,
                    }
                  : null
              }
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={
                  selectedCategory === category.name
                    ? categoryDetails[category.name]?.color || "#4CAF50"
                    : "#9ca3af"
                }
              />
              <Text
                className={`font-medium ml-2 ${
                  selectedCategory === category.name
                    ? "text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter/Sort Option */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-gray-800 font-medium">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "item" : "items"}
        </Text>
        <TouchableOpacity className="flex-row items-center bg-white px-3 py-1.5 rounded-lg shadow-sm">
          <Ionicons name="options-outline" size={16} color="#4b5563" />
          <Text className="text-gray-600 ml-1 font-medium">Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredProducts.length > 0 ? (
          <View className="flex-row flex-wrap justify-between">
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product._id}
                className="bg-white mb-4 rounded-2xl shadow-sm overflow-hidden w-[48%]"
                style={{ elevation: 1 }}
              >
                <Image
                  source={{ uri: product.images[0] }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-xs text-gray-500">
                    {product.farmName}
                  </Text>
                  <Text
                    className="font-semibold text-gray-800 mt-1"
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>
                  <RatingStars rating={4.5} />
                  {/* You might want to add a rating field to your product data */}
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="font-bold text-gray-800">
                      {formatPrice(product.price)}
                    </Text>
                    <TouchableOpacity
                      className="rounded-full p-1.5"
                      style={{
                        backgroundColor:
                          categoryDetails[selectedCategory]?.color || "#4CAF50",
                      }}
                    >
                      <Ionicons name="add" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-10">
            <Ionicons name="basket-outline" size={60} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-center">
              No products available in this category
            </Text>
            <TouchableOpacity
              className="mt-4 px-6 py-2 rounded-full"
              style={{
                backgroundColor:
                  categoryDetails[selectedCategory]?.color || "#4CAF50",
              }}
            >
              <Text className="text-white font-medium">
                Browse Other Categories
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryScreen;
