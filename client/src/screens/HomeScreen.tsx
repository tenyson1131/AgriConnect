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
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { RefreshControl } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const categories = [
  {
    id: 2,
    name: "Vegetables",
    img: require("../../assets/images/categories/vegetable.png"),
  },
  {
    id: 1,
    name: "Fruits",
    img: require("../../assets/images/categories/fruit.png"),
  },
  {
    id: 3,
    name: "Dairy",
    img: require("../../assets/images/categories/dairy.png"),
  },
  {
    id: 4,
    name: "Meat",
    img: require("../../assets/images/categories/meat.png"),
  },
  {
    id: 5,
    name: "Grain",
    img: require("../../assets/images/categories/grain.png"),
  },
];

const HomeScreen = ({ products, fetchProducts }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, []);

  const router = useRouter?.() || { push: () => {} };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Location and Profile Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="location-pin" size={22} color="#5a9d42" />
            <View style={{ marginLeft: 8 }}>
              <Text
                style={{ color: "#9ca3af", fontSize: 12, letterSpacing: 0.4 }}
              >
                Your Location
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                    letterSpacing: 0.2,
                  }}
                >
                  xuyASdz, ABC
                </Text>
                <Feather
                  name="chevron-down"
                  size={16}
                  color="#5a9d42"
                  style={{ marginLeft: 6 }}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(185, 243, 214, 0.6)",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.push("/user/profile")}
          >
            <Feather name="user" size={24} color="#28a745" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            marginTop: 8,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(243, 244, 246, 0.7)",
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
            }}
          >
            <Feather name="search" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search fresh produce..."
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 15,
                fontWeight: "400",
                color: "#1f2937",
              }}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(194, 239, 217, 0.35)",
              width: 46,
              height: 46,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="sliders" size={22} color="#38b779" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 18,
              paddingHorizontal: 16,
              marginBottom: 14,
              letterSpacing: 0.2,
            }}
          >
            Shop by Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // style={{ paddingLeft: 16 }}
          >
            <View className="flex-row pl-5 pr-2">
              {categories.map((category, i) => (
                <View
                  key={i}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      backgroundColor: "rgba(185, 243, 214, 0.5)",
                      borderRadius: 16,
                      padding: 14,
                      minWidth: 80,
                    }}
                  >
                    <Image
                      source={category.img}
                      style={{ width: 46, height: 46 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 13,
                      marginTop: 8,
                      letterSpacing: 0.4,
                      color: "#374151",
                    }}
                  >
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Top Deals Banner */}
        <View style={{ paddingHorizontal: 16, marginBottom: 28 }}>
          <View
            style={{
              backgroundColor: "#e0eeda",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 16,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#3b662c",
                    fontWeight: "700",
                    fontSize: 18,
                    letterSpacing: 0.3,
                  }}
                >
                  Top Deals of the Week
                </Text>
                <Text
                  style={{ color: "#488034", marginTop: 4, letterSpacing: 0.2 }}
                >
                  Get up to 30% off on seasonal produce
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#5a9d42",
                  borderRadius: 24,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 13 }}
                >
                  Shop Now
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Image
                source={require("@/assets/images/dealsBanner.jpg")}
                style={{
                  width: "100%",
                  height: 160,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                }}
              />
            </View>
          </View>
        </View>

        {/* Top Selling */}
        <View style={{ marginBottom: 80 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontWeight: "700", fontSize: 18, letterSpacing: 0.2 }}
            >
              Top Selling Products
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: "#5a9d42",
                  fontWeight: "500",
                  letterSpacing: 0.2,
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {products?.map((product) => (
              <TouchableOpacity
                key={product?._id}
                className="w-[48%] mb-4 rounded-2xl overflow-hidden bg-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                onPress={() => router.push(`/product/${product?._id}`)}
              >
                {/* Image Container */}
                <View className="h-40 w-full bg-gray-100">
                  <Image
                    source={{ uri: product?.images[0] }}
                    className="w-full h-full"
                    style={{ resizeMode: "cover" }}
                  />

                  {/* Discount Tag - Conditional */}
                  {product?.discount > 0 && (
                    <View className="absolute top-0 left-0 bg-red-500 px-2 py-1 rounded-br-lg">
                      <Text className="text-xs font-bold text-white">
                        {product?.discount}% OFF
                      </Text>
                    </View>
                  )}

                  {/* Favorite Button */}
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-white w-8 h-8 rounded-full items-center justify-center"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <Feather name="heart" size={15} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                {/* Product Details */}
                <View className="p-3">
                  {/* Farm Name */}
                  <View className="flex-row items-center mb-1">
                    <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                    <Text className="text-xs text-gray-500">
                      {product?.farmName || "Farm Fresh"}
                    </Text>
                  </View>

                  {/* Product Name */}
                  <Text
                    className="font-semibold text-gray-800 text-sm mb-2"
                    numberOfLines={2}
                    style={{ lineHeight: 18 }}
                  >
                    {product?.name}
                  </Text>

                  {/* Rating - if available */}
                  {product?.rating && (
                    <View className="flex-row items-center mb-2">
                      <Feather name="star" size={12} color="#FFAB00" />
                      <Text className="text-xs text-gray-600 ml-1">
                        {product?.rating} ({product?.reviewCount || 0})
                      </Text>
                    </View>
                  )}

                  {/* Price and Add Button */}
                  <View className="flex-row justify-between items-center">
                    <View>
                      {/* Show original price if discounted */}
                      {product?.originalPrice && (
                        <Text className="text-xs text-gray-400 line-through">
                          ${product?.originalPrice}
                        </Text>
                      )}
                      <Text className="font-bold text-gray-900 text-base">
                        ${product?.price}
                      </Text>
                    </View>

                    <TouchableOpacity className="bg-emerald-500 w-8 h-8 rounded-full items-center justify-center">
                      <Text className="text-white font-bold text-base">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
