import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { CartContext } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { ProductInterface } from "@/src/types";
import { productTips_benefits } from "./tips_benefits";
import { toggleWishlist } from "@/src/utils/wishlistController";
import { ProductContext } from "@/context/ProductContext";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({
  productDetail,
}: {
  productDetail: ProductInterface;
}) => {
  const router = useRouter();
  const { cart_Loading, addToCart } = useContext(CartContext);
  const { wishlist, fetchWishlist } = useContext(ProductContext);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  // const toggleFavorite = () => setIsFavorite((prev) => !prev);

  const tips =
    productTips_benefits[productDetail?.category]?.tips ||
    productTips_benefits["Vegetables"].tips;
  const benefits =
    productTips_benefits[productDetail?.category]?.benefits ||
    productTips_benefits["Vegetables"].benefits;

  const handleAddToCart = async () => {
    try {
      // Start button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Call the addToCart function (simulated for this example)
      const response = await addToCart(productDetail._id, quantity);

      // If successfully added to cart
      if (response && response.status === 200) {
        setIsAddedToCart(true);

        // Show success animation
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setIsAddedToCart(false));

        // Show toast notification
        Toast.show({
          type: "success",
          text1: "Added to Cart",
          text2: `${quantity} ${
            quantity > 1 ? "items" : "item"
          } added successfully`,
          position: "bottom",
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Toast.show({
        type: "error",
        text1: "Failed to add item",
        text2: "Please try again",
        position: "bottom",
      });
    }
  };

  async function handleWishlist() {
    try {
      const result = await toggleWishlist(productDetail?._id);
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

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 absolute top-10 left-0 right-0 z-10">
          <TouchableOpacity
            onPress={() => router?.back()}
            className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
          >
            <Feather name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleWishlist}
            className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
          >
            {/* <Feather
              name="heart"
              size={20}
              // color={isFavorite ? "#FF6B6B" : "#666"}
            /> */}
            {wishlist?.find((e) => e._id == productDetail?._id) ? (
              <AntDesign name="heart" size={20} color="red" />
            ) : (
              <AntDesign name="hearto" size={20} color="black" />
            )}
          </TouchableOpacity>
        </View>

        {/* Product Image with Gradient */}
        <View className="w-full aspect-square relative">
          <FlatList
            data={productDetail.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={({ viewableItems }) => {
              if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index || 0);
              }
            }}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            renderItem={({ item }) => (
              <View style={{ width: width, aspectRatio: 1 }}>
                <LinearGradient
                  colors={["rgba(242, 248, 240, 1)", "rgba(255, 255, 255, .8)"]}
                  className="absolute inset-0"
                />
                <Image
                  source={{ uri: item }}
                  className="w-full h-full p-8"
                  resizeMode="cover"
                />
              </View>
            )}
          />

          {/* Organic Badge */}
          <View className="absolute left-4 bottom-7 bg-gray-800 rounded-full w-10 h-10 items-center justify-center">
            <Feather name="check" size={18} color="white" />
          </View>

          {/* Page indicator dots */}
          <View className="absolute bottom-7 left-0 right-0 flex-row justify-center">
            {productDetail.images.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full mx-0.5 ${
                  activeIndex === index
                    ? "w-6 bg-gray-800"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Product Info Container - with rounded top corners */}
        <View className="px-5 pt-6 pb-24 -mt-5 bg-white rounded-t-3xl">
          {/* Product Title and Rating */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-1">
                {productDetail?.name}
              </Text>
              <Text className="text-base text-gray-600">
                {productDetail?.farmName}
              </Text>
            </View>
            <View className="bg-gray-100 rounded-xl px-3 py-1.5">
              <View className="flex-row items-center">
                <Feather name="star" size={16} color="#f59e0b" />
                <Text className="font-semibold mx-1">4.8</Text>
                <Text className="text-xs text-gray-600">(242)</Text>
              </View>
            </View>
          </View>

          {/* Price and Add to Cart Section */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-600 text-sm">Price</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  ₹{productDetail?.price}
                </Text>
              </View>

              <View className="flex-row items-center">
                {/* Quantity Control */}
                <View className="flex-row items-center bg-white rounded-full p-1 mr-3">
                  <TouchableOpacity
                    onPress={decreaseQuantity}
                    className="w-8 h-8 rounded-full items-center justify-center"
                  >
                    <Feather name="minus" size={16} color="#333" />
                  </TouchableOpacity>
                  <Text className="w-8 text-center font-semibold">
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={increaseQuantity}
                    className="w-8 h-8 rounded-full items-center justify-center"
                  >
                    <Feather name="plus" size={16} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Add to Basket Button with animation */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    className="bg-gray-800 rounded-full py-3 px-5 shadow relative"
                    onPress={handleAddToCart}
                    disabled={cart_Loading}
                  >
                    {cart_Loading ? (
                      <View style={styles.loadingIndicator} />
                    ) : (
                      <>
                        <Feather name="shopping-bag" size={18} color="white" />
                        {isAddedToCart && (
                          <Animated.View
                            style={[
                              styles.checkmarkContainer,
                              { opacity: opacityAnim },
                            ]}
                          >
                            <Feather name="check" size={16} color="white" />
                          </Animated.View>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </Text>
            <Text className="text-gray-600 leading-6">
              {productDetail?.desc}
            </Text>
          </View>

          {/* Health Benefits */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Health Benefits
            </Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              {benefits?.map((benefit, index) => (
                <View
                  key={index}
                  className="flex-row items-center mb-2 last:mb-0"
                >
                  <View className="w-2 h-2 rounded-full bg-gray-800 mr-3" />
                  <Text className="text-gray-700">{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tips Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Tips to keep it fresh
            </Text>
            <View className="flex-row justify-between">
              {tips.map((tip, index) => (
                <View key={index} className="bg-gray-50 rounded-xl p-3 w-[31%]">
                  <View className="flex-row items-center justify-center mb-1">
                    <Feather name={tip.icon as any} size={16} color="#333" />
                  </View>
                  <Text className="text-gray-600 text-xs text-center mb-0.5">
                    {tip.title}
                  </Text>
                  <Text className="font-medium text-gray-800 text-sm text-center">
                    {tip.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Related Products Section */}
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              You might also like
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              className="pt-1"
            >
              {[1, 2, 3].map((item) => (
                <TouchableOpacity
                  key={item}
                  className="bg-gray-50 rounded-xl mr-3 w-36 overflow-hidden"
                >
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
                    }}
                    className="w-full h-24 bg-white"
                    resizeMode="cover"
                  />
                  <View className="p-2">
                    <Text
                      className="font-medium text-gray-800 text-sm"
                      numberOfLines={1}
                    >
                      {item === 1
                        ? "Organic Kale"
                        : item === 2
                        ? "Fresh Lettuce"
                        : "Wild Arugula"}
                    </Text>
                    <View className="flex-row justify-between items-center mt-1">
                      <Text className="text-gray-800 font-semibold text-sm">
                        ${(2.99 + item * 0.5).toFixed(2)}
                      </Text>
                      <TouchableOpacity className="bg-gray-200 rounded-xl w-6 h-6 items-center justify-center">
                        <Feather name="plus" size={14} color="#333" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Toast container */}
      <Toast />
    </View>
  );
};

// Minimal StyleSheet for animations that can't be handled by NativeWind
const styles = StyleSheet.create({
  loadingIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "white",
    borderTopColor: "transparent",
  },
  checkmarkContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#5a9d42",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductDetailScreen;
