import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";

// Mock data (in a real app, this would come from an API)
const mockDeals = [
  {
    id: "1",
    name: "Organic Wheat Bundle",
    farmName: "Green Horizons Farm",
    originalPrice: 50.0,
    discountedPrice: 35.0,
    discountPercentage: 30,
    image: "/api/placeholder/300/200",
    stock: 50,
    expiryTime: new Date(Date.now() + 86400000), // 24 hours from now
    category: "Grains",
  },
  {
    id: "2",
    name: "Fresh Tomato Harvest",
    farmName: "Sunny Valley Farms",
    originalPrice: 20.0,
    discountedPrice: 12.0,
    discountPercentage: 40,
    image: "/api/placeholder/300/200",
    stock: 0,
    expiryTime: new Date(Date.now() + 43200000), // 12 hours from now
    category: "Vegetables",
  },
  // Add more mock deals...
];

const DealCard = ({ deal }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = deal.expiryTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deal.expiryTime]);

  const isExpiringSoon =
    timeLeft !== "Expired" &&
    new Date(deal.expiryTime).getTime() - Date.now() < 43200000; // Less than 12 hours

  return (
    <View className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      {/* Deal Image */}
      <Image
        source={{ uri: deal.image }}
        className="w-full h-48 rounded-lg mb-4"
        resizeMode="cover"
      />

      {/* Deal Details */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold">{deal.name}</Text>
        {isExpiringSoon && (
          <View className="bg-red-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs">Ending Soon</Text>
          </View>
        )}
      </View>

      <Text className="text-gray-600 mb-2">{deal.farmName}</Text>

      {/* Pricing */}
      <View className="flex-row items-center mb-2">
        <Text className="text-xl font-bold text-green-600 mr-2">
          ${deal.discountedPrice.toFixed(2)}
        </Text>
        <Text className="line-through text-gray-400 mr-2">
          ${deal.originalPrice.toFixed(2)}
        </Text>
        <View className="bg-green-100 px-2 py-1 rounded-full">
          <Text className="text-green-700 text-xs">
            {deal.discountPercentage}% OFF
          </Text>
        </View>
      </View>

      {/* Stock & Timer */}
      <View className="flex-row justify-between items-center">
        <Text
          className={`${deal.stock === 0 ? "text-red-500" : "text-green-600"}`}
        >
          {deal.stock === 0 ? "Out of Stock" : `${deal.stock} Left`}
        </Text>
        <Text
          className={`
          ${timeLeft === "Expired" ? "text-red-500" : "text-gray-600"}
        `}
        >
          {timeLeft}
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        className={`
          mt-4 py-3 rounded-lg 
          ${
            deal.stock === 0
              ? "bg-gray-300"
              : timeLeft === "Expired"
              ? "bg-gray-400"
              : "bg-green-600"
          }
        `}
        disabled={deal.stock === 0 || timeLeft === "Expired"}
      >
        <Text className="text-center text-white font-bold">
          {deal.stock === 0
            ? "Notify Me"
            : timeLeft === "Expired"
            ? "Expired"
            : "Claim Deal"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("discount");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDeals(mockDeals);
      setLoading(false);
    }, 1500);
  }, []);

  const categories = ["All", "Grains", "Vegetables", "Fruits", "Dairy"];

  const sortedDeals = deals
    .filter((deal) => filter === "All" || deal.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return b.discountPercentage - a.discountPercentage;
        case "expiry":
          return a.expiryTime.getTime() - b.expiryTime.getTime();
        case "popularity":
          // In a real app, you'd have a popularity metric
          return 0;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 flex-row justify-between items-center shadow-sm">
        <Text className="text-2xl font-bold">Agricultural Deals</Text>
        <View className="flex-row">
          <TouchableOpacity className="mr-4">
            <MaterialIcons name="filter-list" color="black" size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="linechart" color="black" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white py-2 px-2"
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            className={`
              px-4 py-2 rounded-full mr-2 
              ${filter === cat ? "bg-green-600" : "bg-gray-200"}
            `}
            onPress={() => setFilter(cat)}
          >
            <Text
              className={`
              ${filter === cat ? "text-white" : "text-black"}
            `}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sorting Options */}
      <View className="bg-white py-2 px-4 flex-row justify-between">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setSortBy("discount")}
        >
          <Text
            className={`
            mr-2 
            ${
              sortBy === "discount"
                ? "text-green-600 font-bold"
                : "text-gray-600"
            }
          `}
          >
            Discount
          </Text>
          <Ionicons
            name="chevron-down"
            color={sortBy === "discount" ? "#10B981" : "gray"}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setSortBy("expiry")}
        >
          <Text
            className={`
            mr-2 
            ${
              sortBy === "expiry" ? "text-green-600 font-bold" : "text-gray-600"
            }
          `}
          >
            Expiry
          </Text>
          <Ionicons
            name="time-outline"
            color={sortBy === "expiry" ? "#10B981" : "gray"}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setSortBy("popularity")}
        >
          <Text
            className={`
            mr-2 
            ${
              sortBy === "popularity"
                ? "text-green-600 font-bold"
                : "text-gray-600"
            }
          `}
          >
            Popularity
          </Text>
          <AntDesign
            name="linechart"
            color={sortBy === "popularity" ? "#10B981" : "gray"}
            size={20}
          />
        </TouchableOpacity>
      </View>

      {/* Deals List */}
      <ScrollView className="px-4 pt-4" showsVerticalScrollIndicator={false}>
        {sortedDeals.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <Text className="text-gray-500 text-lg">
              No deals found in this category
            </Text>
          </View>
        ) : (
          sortedDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        )}
      </ScrollView>
    </View>
  );
};

export default DealsPage;
