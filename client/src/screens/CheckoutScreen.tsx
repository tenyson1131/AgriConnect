import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  Feather,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

export default function RefinedCheckoutScreen() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // Changed to start visible

  // Address fields
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "United States",
  });

  // Sample cart items with more detailed information
  const cartItems = [
    {
      id: 1,
      name: "Organic Avocados",
      description: "Ripe & Ready to Eat",
      price: 4.99,
      quantity: 3,
      image: "avocado",
      organic: true,
      weight: "250g each",
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      description: "Sweet & Juicy",
      price: 3.49,
      quantity: 1,
      image: "strawberry",
      organic: true,
      weight: "400g box",
    },
    {
      id: 3,
      name: "Farm Fresh Eggs",
      description: "Free-Range Brown",
      price: 5.29,
      quantity: 1,
      image: "eggs",
      organic: false,
      weight: "12 pack",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = deliveryOption === "express" ? 5.99 : 2.99;
  const discount = 2.5; // Example discount
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax - discount;

  // Header animation for title - removed to fix glitching

  const renderProductImage = (imageName) => {
    // This uses a monochromatic design instead of gradients
    const bgColors = {
      avocado: "bg-emerald-100",
      strawberry: "bg-rose-100",
      eggs: "bg-amber-100",
    };

    const iconColors = {
      avocado: "#10b981",
      strawberry: "#e11d48",
      eggs: "#f59e0b",
    };

    return (
      <View
        className={`h-16 w-16 ${bgColors[imageName]} rounded-2xl items-center justify-center shadow-sm`}
      >
        <MaterialCommunityIcons
          name={
            imageName === "avocado"
              ? "fruit-pear"
              : imageName === "strawberry"
              ? "fruit-cherries"
              : "egg"
          }
          size={28}
          color={iconColors[imageName]}
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Custom Status Bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Modern Minimalist Header - Fixed to prevent glitching */}
      <View className="pt-12 pb-4 px-5 bg-white">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>

          <View>
            {/* Removed animated text that was causing glitching */}
            <Text className="text-gray-900 text-lg font-bold">Checkout</Text>
          </View>

          <TouchableOpacity className="h-10 w-10 bg-gray-100 rounded-full items-center justify-center">
            <AntDesign name="questioncircleo" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View className="flex-row items-center justify-between mt-4 px-4">
          <View className="items-center">
            <View className="h-8 w-8 rounded-full bg-emerald-500 items-center justify-center">
              <Feather name="shopping-bag" size={16} color="white" />
            </View>
            <Text className="text-xs text-gray-600 mt-1">Cart</Text>
          </View>

          <View className="flex-1 h-1 bg-emerald-100 mx-2">
            <View className="w-full h-full bg-emerald-500" />
          </View>

          <View className="items-center">
            <View className="h-8 w-8 rounded-full bg-emerald-500 items-center justify-center">
              <Feather name="credit-card" size={16} color="white" />
            </View>
            <Text className="text-xs text-gray-600 mt-1">Payment</Text>
          </View>

          <View className="flex-1 h-1 bg-gray-200 mx-2" />

          <View className="items-center">
            <View className="h-8 w-8 rounded-full bg-gray-200 items-center justify-center">
              <Feather name="check" size={16} color="#9CA3AF" />
            </View>
            <Text className="text-xs text-gray-400 mt-1">Complete</Text>
          </View>
        </View>
      </View>

      {/* Main Content - Removed Animated.ScrollView to fix glitching */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Order Summary Card */}
        <View className="mx-4 mt-6 mb-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-800 text-base font-bold">
              Order Summary
            </Text>
            <TouchableOpacity className="flex-row items-center py-1 px-3 bg-gray-100 rounded-full">
              <Text className="text-gray-700 text-xs font-medium mr-1">
                {cartItems.length} items
              </Text>
              <Feather name="chevron-down" size={14} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-3xl shadow-md overflow-hidden">
            {/* Order items - removed Animated.View to fix glitching */}
            <View className="p-4">
              {cartItems.map((item, index) => (
                <View
                  key={item.id}
                  className={`flex-row py-3 ${
                    index < cartItems.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {renderProductImage(item.image)}

                  <View className="flex-1 ml-3 justify-center">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1 pr-2">
                        <Text className="text-gray-900 font-semibold flex-1">
                          {item.name}
                        </Text>
                        {item.organic && (
                          <View className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full">
                            <Text className="text-emerald-600 text-xs">
                              Organic
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-900 font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center mt-1">
                      <Text className="text-gray-500 text-xs">
                        {item.weight}
                      </Text>

                      <View className="flex-row items-center bg-gray-50 rounded-full border border-gray-100">
                        <TouchableOpacity className="h-6 w-6 items-center justify-center">
                          <Feather name="minus" size={12} color="#4B5563" />
                        </TouchableOpacity>
                        <Text className="min-w-6 text-center text-gray-800 text-xs font-medium">
                          {item.quantity}
                        </Text>
                        <TouchableOpacity className="h-6 w-6 items-center justify-center">
                          <Feather name="plus" size={12} color="#4B5563" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Order summary footer with delivery estimate */}
            <View className="bg-gray-50 p-4">
              <View className="flex-row items-center">
                <View className="h-8 w-8 bg-white rounded-full items-center justify-center shadow-sm">
                  <AntDesign name="clockcircleo" size={16} color="#4B5563" />
                </View>
                <View className="ml-3">
                  <Text className="text-gray-600 text-xs">
                    Estimated delivery time
                  </Text>
                  <Text className="text-gray-800 font-medium">
                    Today, 35-45 min
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* NEW SECTION: Delivery Address */}
        <View className="mx-4 mt-5">
          <Text className="text-gray-800 text-base font-bold mb-3">
            Delivery Address
          </Text>
          <View className="bg-white rounded-3xl shadow-md overflow-hidden p-4">
            <View className="mb-3">
              <Text className="text-gray-600 text-xs mb-1">Address Line 1</Text>
              <TextInput
                value={address.line1}
                onChangeText={(text) => setAddress({ ...address, line1: text })}
                placeholder="Street address"
                className="bg-gray-50 p-3 rounded-xl text-gray-800"
              />
            </View>

            <View className="mb-3">
              <Text className="text-gray-600 text-xs mb-1">
                Address Line 2 (Optional)
              </Text>
              <TextInput
                value={address.line2}
                onChangeText={(text) => setAddress({ ...address, line2: text })}
                placeholder="Apt, Suite, Building, etc."
                className="bg-gray-50 p-3 rounded-xl text-gray-800"
              />
            </View>

            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600 text-xs mb-1">City</Text>
                <TextInput
                  value={address.city}
                  onChangeText={(text) =>
                    setAddress({ ...address, city: text })
                  }
                  placeholder="City"
                  className="bg-gray-50 p-3 rounded-xl text-gray-800"
                />
              </View>

              <View className="flex-1 ml-2">
                <Text className="text-gray-600 text-xs mb-1">State</Text>
                <TextInput
                  value={address.state}
                  onChangeText={(text) =>
                    setAddress({ ...address, state: text })
                  }
                  placeholder="State"
                  className="bg-gray-50 p-3 rounded-xl text-gray-800"
                />
              </View>
            </View>

            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600 text-xs mb-1">PIN Code</Text>
                <TextInput
                  value={address.pincode}
                  onChangeText={(text) =>
                    setAddress({ ...address, pincode: text })
                  }
                  placeholder="Postal code"
                  keyboardType="number-pad"
                  className="bg-gray-50 p-3 rounded-xl text-gray-800"
                />
              </View>

              <View className="flex-1 ml-2">
                <Text className="text-gray-600 text-xs mb-1">Country</Text>
                <View className="bg-gray-50 p-3 rounded-xl flex-row justify-between items-center">
                  <Text className="text-gray-800">{address.country}</Text>
                  <Feather name="chevron-down" size={16} color="#4B5563" />
                </View>
              </View>
            </View>

            <View className="flex-row items-center mt-2">
              <TouchableOpacity className="h-5 w-5 rounded border border-emerald-500 bg-emerald-50 items-center justify-center mr-2">
                <Feather name="check" size={12} color="#10b981" />
              </TouchableOpacity>
              <Text className="text-gray-600 text-sm">
                Save address for future orders
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Options */}
        <View className="mx-4 mt-5">
          <Text className="text-gray-800 text-base font-bold mb-3">
            Delivery Options
          </Text>
          <View className="bg-white rounded-3xl shadow-md overflow-hidden">
            <TouchableOpacity
              className={`p-4 ${
                deliveryOption === "standard" ? "bg-emerald-50" : "bg-white"
              }`}
              onPress={() => setDeliveryOption("standard")}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full ${
                    deliveryOption === "standard"
                      ? "bg-emerald-500"
                      : "border-2 border-gray-300"
                  } items-center justify-center`}
                >
                  {deliveryOption === "standard" && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-bold">
                    Standard Delivery
                  </Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    Estimated delivery: 35-45 minutes
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-gray-800 font-bold">$2.99</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="h-0.5 bg-gray-100" />

            <TouchableOpacity
              className={`p-4 ${
                deliveryOption === "express" ? "bg-emerald-50" : "bg-white"
              }`}
              onPress={() => setDeliveryOption("express")}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full ${
                    deliveryOption === "express"
                      ? "bg-emerald-500"
                      : "border-2 border-gray-300"
                  } items-center justify-center`}
                >
                  {deliveryOption === "express" && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>

                <View className="ml-3 flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-gray-800 font-bold">
                      Express Delivery
                    </Text>
                    <View className="ml-2 px-2 py-0.5 bg-amber-100 rounded-full">
                      <Text className="text-amber-700 text-xs font-medium">
                        Priority
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    Estimated delivery: 15-20 minutes
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-gray-800 font-bold">$5.99</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="mx-4 mt-5">
          <Text className="text-gray-800 text-base font-bold mb-3">
            Payment Method
          </Text>

          <View className="bg-white rounded-3xl shadow-md overflow-hidden">
            <TouchableOpacity
              className={`p-4 ${
                paymentMethod === "card" ? "bg-emerald-50" : "bg-white"
              }`}
              onPress={() => setPaymentMethod("card")}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full ${
                    paymentMethod === "card"
                      ? "bg-emerald-500"
                      : "border-2 border-gray-300"
                  } items-center justify-center`}
                >
                  {paymentMethod === "card" && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-bold">Credit Card</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    **** **** **** 4389
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <FontAwesome name="cc-visa" size={24} color="#1434CB" />
                  <TouchableOpacity className="ml-2 p-1">
                    <Feather name="more-vertical" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            <View className="h-0.5 bg-gray-100" />

            <TouchableOpacity
              className={`p-4 ${
                paymentMethod === "apple" ? "bg-emerald-50" : "bg-white"
              }`}
              onPress={() => setPaymentMethod("apple")}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full ${
                    paymentMethod === "apple"
                      ? "bg-emerald-500"
                      : "border-2 border-gray-300"
                  } items-center justify-center`}
                >
                  {paymentMethod === "apple" && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-bold">Apple Pay</Text>
                </View>

                <View className="flex-row items-center">
                  <AntDesign name="apple1" size={20} color="#000" />
                </View>
              </View>
            </TouchableOpacity>

            <View className="h-0.5 bg-gray-100" />

            <TouchableOpacity
              className={`p-4 ${
                paymentMethod === "paypal" ? "bg-emerald-50" : "bg-white"
              }`}
              onPress={() => setPaymentMethod("paypal")}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full ${
                    paymentMethod === "paypal"
                      ? "bg-emerald-500"
                      : "border-2 border-gray-300"
                  } items-center justify-center`}
                >
                  {paymentMethod === "paypal" && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-bold">PayPal</Text>
                </View>

                <View className="flex-row items-center">
                  <FontAwesome name="paypal" size={20} color="#003087" />
                </View>
              </View>
            </TouchableOpacity>

            <View className="h-0.5 bg-gray-100" />

            <TouchableOpacity className="p-4 flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-emerald-100 items-center justify-center">
                <Feather name="plus" size={14} color="#10b981" />
              </View>
              <Text className="ml-3 text-emerald-500 font-medium">
                Add New Payment Method
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promo Code Section */}
        <View className="mx-4 mt-5">
          <Text className="text-gray-800 text-base font-bold mb-3">
            Promo Code
          </Text>
          <View className="bg-white rounded-3xl shadow-md overflow-hidden p-4">
            <View className="flex-row">
              <TextInput
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
                className="bg-gray-50 p-3 flex-1 rounded-l-xl text-gray-800"
              />
              <TouchableOpacity className="bg-emerald-500 px-4 rounded-r-xl items-center justify-center">
                <Text className="text-white font-medium">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Space for bottom summary bar */}
        <View className="h-48" />
      </ScrollView>

      {/* Bottom Payment Bar */}
      <View className="absolute bottom-0 left-0 right-0">
        <View className="p-5 bg-white border-t border-gray-100 shadow-2xl rounded-t-3xl">
          {/* Summary Cards */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2 bg-gray-50 p-3 rounded-2xl">
              <Text className="text-gray-500 text-xs">Subtotal</Text>
              <Text className="text-gray-900 font-bold">
                ${subtotal.toFixed(2)}
              </Text>
            </View>

            <View className="flex-1 mx-1 bg-gray-50 p-3 rounded-2xl">
              <Text className="text-gray-500 text-xs">Tax & Fee</Text>
              <Text className="text-gray-900 font-bold">
                ${(tax + deliveryFee).toFixed(2)}
              </Text>
            </View>

            <View className="flex-1 ml-2 bg-emerald-50 p-3 rounded-2xl">
              <Text className="text-emerald-600 text-xs">Discount</Text>
              <Text className="text-emerald-600 font-bold">-$2.50</Text>
            </View>
          </View>

          {/* Total & Checkout Button */}
          <View className="flex-row items-center">
            <View className="flex-1 pr-4">
              <Text className="text-gray-500 text-xs">Total</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-2xl">
                  ${total.toFixed(2)}
                </Text>
                <AntDesign
                  name="infocirlceo"
                  size={14}
                  color="#9CA3AF"
                  className="ml-1"
                />
              </View>
            </View>

            <TouchableOpacity className="bg-emerald-500 py-4 px-6 rounded-2xl flex-row items-center shadow-sm">
              <Text className="text-white font-bold text-base">
                Place Order
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color="white"
                className="ml-2"
              />
            </TouchableOpacity>
          </View>

          {/* Security Note */}
          <View className="flex-row justify-center items-center mt-3">
            <Feather name="shield" size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">Secure Checkout</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
