import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { RefreshControl } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";
import { toggleWishlist } from "../utils/wishlistController";
import { CartContext } from "@/context/CartContext";
import Toast from "react-native-toast-message";
import { ProductInterface } from "../types";

const { width } = Dimensions.get("window");

const categories = [
  {
    id: 2,
    name: "Vegetables",
    paramName: "Vegetables",
    img: require("../../assets/images/categories/vegetable.png"),
  },
  {
    id: 1,
    name: "Fruits",
    paramName: "Fruits",
    img: require("../../assets/images/categories/fruit.png"),
  },
  {
    id: 3,
    name: "Dairy",
    paramName: "Dairy",
    img: require("../../assets/images/categories/dairy.png"),
  },
  {
    id: 4,
    name: "Meat",
    paramName: "Meat",
    img: require("../../assets/images/categories/meat.png"),
  },
  {
    id: 5,
    // name: "Grain",
    name: "Pickles",
    paramName: "Handmade Pickles",
    img: require("../../assets/images/categories/grain.png"),
  },
];

const HomeScreen = () => {
  const { USER } = useContext(UserContext);
  const { products, fetchProducts, wishlist, fetchWishlist } =
    useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  const [refreshing, setRefreshing] = React.useState(false);

  // const [searchedProducts, setProducts] = useState<ProductInterface>();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, []);

  const router = useRouter?.() || { push: () => {} };

  async function handleWishlist(productId: string) {
    try {
      const result = await toggleWishlist(productId);
      if (result) {
        // console.log("login result: inside if", result);
        // if (result.error as == true) {
        //   Toast.show({
        //     type: "error",
        //     // text1: "Error",
        //     text1: result.message,
        //     position: "bottom",
        //   });
        // }

        fetchWishlist();
      }
    } catch (error) {
      console.log("@# login err:", error);
    }
  }

  async function addCart(productId: string) {
    try {
      const response = await addToCart(productId, 1);
      if (response && response.status == 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product added to cart",
          position: "top",
        });
      }
    } catch (error) {
      console.log("error in addCart: ", error);
    }
  }

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
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", flex: 1 }}
          >
            {/* <Entypo name="location-pin" size={22} color="#5a9d42" /> */}
            {/* <FontAwesome name="user-circle-o" size={36} color="#398763" /> */}

            <FontAwesome name="user-circle" size={36} color="#398763" />

            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text
                style={{ color: "#9ca3af", fontSize: 12, letterSpacing: 0.4 }}
              >
                Welcome
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // marginTop: 2,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                    letterSpacing: 0.2,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {/* xuyASdz, ABC */}
                  {USER?.name || "Guest"}
                </Text>
                {/* <Feather
                  name="chevron-down"
                  size={16}
                  color="#5a9d42"
                  style={{ marginLeft: 6 }}
                /> */}
              </View>
            </View>
          </View>
          {/* user img/icon */}
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
            {/* <Feather name="user" size={24} color="#28a745" /> */}

            {USER?.img && USER.img.trim() !== "" ? (
              <Image
                source={{ uri: USER.img }}
                className="h-full w-full"
                style={{ borderRadius: 18 }}
              />
            ) : (
              <Text className="text-3xl text-[#28a745] text-center">
                {USER?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            )}

            {/* <Text className="text-3xl text-[#28a745] text-center">
              {USER?.name?.charAt(0).toUpperCase() || "U"}
            </Text> */}
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
                    onPress={() =>
                      router.push(
                        `/user/category?category=${category.paramName}`
                      )
                    }
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
                onPress={() => router.push("/user/category")}
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
            {products?.length > 0 ? (
              products?.map((product) => (
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
                      onPress={() => handleWishlist(product?._id)}
                    >
                      {/* <Feather name="heart" size={15} color="#9ca3af" /> */}
                      {wishlist?.find((e) => e._id == product?._id) ? (
                        <AntDesign name="heart" size={15} color="red" />
                      ) : (
                        <AntDesign name="hearto" size={15} color="#9ca3af" />
                      )}
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
                            ₹{product?.originalPrice}
                          </Text>
                        )}
                        <Text className="font-bold text-gray-900 text-base">
                          ₹{product?.price}
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="bg-emerald-500 w-8 h-8 rounded-full items-center justify-center"
                        onPress={() => addCart(product?._id)}
                      >
                        <Text className="text-white font-bold text-base">
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // <Text>Loading...</Text>
              <ProductSkeleton />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function ProductSkeleton() {
  const shimmerAnimatedValue = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnimatedValue, {
        toValue: width,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, []);

  const getShimmerStyle = () => {
    const shimmerTranslate = shimmerAnimatedValue.interpolate({
      inputRange: [-width, width],
      outputRange: [-width, width],
    });

    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transform: [{ translateX: shimmerTranslate }],
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    };
  };

  return Array(2)
    .fill()
    .map((_, index) => (
      <View
        key={`skeleton-${index}`}
        className="w-[48%] mb-4 rounded-2xl overflow-hidden bg-white"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Image Container Skeleton */}
        <View className="h-40 w-full bg-gray-300 relative overflow-hidden">
          <Animated.View style={getShimmerStyle()} />
        </View>

        {/* Product Details Skeleton */}
        <View className="p-3">
          {/* Farm Name Skeleton */}
          <View className="flex-row items-center mb-1">
            <View className="w-2 h-2 rounded-full bg-gray-300 relative overflow-hidden mr-1">
              <Animated.View style={getShimmerStyle()} />
            </View>
            <View className="w-20 h-3 bg-gray-300 rounded relative overflow-hidden">
              <Animated.View style={getShimmerStyle()} />
            </View>
          </View>

          {/* Product Name Skeleton */}
          <View className="w-full h-4 bg-gray-300 rounded mb-1 relative overflow-hidden">
            <Animated.View style={getShimmerStyle()} />
          </View>
          <View className="w-3/4 h-4 bg-gray-300 rounded mb-2 relative overflow-hidden">
            <Animated.View style={getShimmerStyle()} />
          </View>

          {/* Rating Skeleton */}
          <View className="flex-row items-center mb-2">
            <View className="w-16 h-3 bg-gray-300 rounded relative overflow-hidden">
              <Animated.View style={getShimmerStyle()} />
            </View>
          </View>

          {/* Price and Add Button Skeleton */}
          <View className="flex-row justify-between items-center">
            <View>
              <View className="w-12 h-3 bg-gray-300 rounded mb-1 relative overflow-hidden">
                <Animated.View style={getShimmerStyle()} />
              </View>
              <View className="w-16 h-5 bg-gray-300 rounded relative overflow-hidden">
                <Animated.View style={getShimmerStyle()} />
              </View>
            </View>

            <View className="bg-gray-300 w-8 h-8 rounded-full relative overflow-hidden">
              <Animated.View style={getShimmerStyle()} />
            </View>
          </View>
        </View>
      </View>
    ));
}

export default HomeScreen;
