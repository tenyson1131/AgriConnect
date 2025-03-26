import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  AntDesign,
  Feather,
  Octicons,
} from "@expo/vector-icons";
import "nativewind";
import { CartContext } from "@/context/CartContext";
import axios from "axios";
import Toast from "react-native-toast-message";
import { UserContext } from "@/context/UserContext";

const CheckoutPage = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { loadUser } = useContext(UserContext);
  const { cart_Loading, cart, loadCart, removeFromCart } =
    useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("delivery");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Primary color theme
  const PRIMARY_COLOR = "#2FAB73"; // Green color
  const PRIMARY_LIGHT = "rgba(47, 171, 115, 0.08)";
  const SECONDARY_COLOR = "#219653";

  // Form state
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Calculate order summary
  const subtotal = Array.isArray(cart?.items)
    ? cart.items.reduce(
        (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
        0
      )
    : 0;
  const deliveryFee = 49;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const discount = promoApplied ? Math.round(subtotal * 0.15) : 0; // 15% discount if promo applied
  const total = subtotal + deliveryFee + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "fresh15") {
      setPromoApplied(true);
      Alert.alert("Success", "Promo code applied successfully!");
    } else {
      Alert.alert("Invalid Code", "The promo code you entered is invalid.");
    }
  };

  const handleBack = () => {
    if (activeSection === "payment") {
      setActiveSection("delivery");
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        router.push("/");
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (activeSection === "delivery") {
      // Validate address fields
      if (
        !address.fullName ||
        !address.phone ||
        !address.addressLine1 ||
        !address.city ||
        !address.state ||
        !address.pincode
      ) {
        Alert.alert(
          "Incomplete Information",
          "Please fill all the required address fields."
        );
        return;
      }
      setActiveSection("payment");
      return;
    }

    // api call to place order--------
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/order/checkout`,
        { paymentMethod, address }
      );

      console.log("Order placed successfully", res.data);

      if (res.status == 200) {
        loadUser();
        router.replace("/user/profile/order");
      }
    } catch (error) {
      console.log("error while checkout", error.response);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response.data.message,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  const PaymentOptions = [
    {
      id: "card",
      name: "Debit/Credit Card",
      icon: <FontAwesome5 name="credit-card" size={18} color={PRIMARY_COLOR} />,
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: (
        <FontAwesome5
          name="money-bill-wave"
          size={18}
          color={SECONDARY_COLOR}
        />
      ),
    },
    {
      id: "COD",
      name: "Cash on Delivery",
      icon: <MaterialIcons name="payments" size={18} color="#F2994A" />,
    },
  ];

  const renderDeliveryDetails = () => (
    <View className="mx-4 mt-0 bg-white rounded-2xl overflow-hidden shadow-md">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <View className="w-7 h-7 rounded-full bg-emerald-500 items-center justify-center mr-3">
          <Feather name="map-pin" size={16} color="#ffffff" />
        </View>
        <Text className="text-lg font-bold text-gray-800 tracking-wide">
          Delivery Details
        </Text>
      </View>

      <View className="p-4">
        <View className="mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Full Name
            </Text>
            <TextInput
              className={`h-12 border ${
                address.fullName
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } rounded-xl px-4 text-gray-800`}
              placeholder="Enter your full name"
              value={address.fullName}
              onChangeText={(text) =>
                setAddress({ ...address, fullName: text })
              }
            />
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Phone Number
            </Text>
            <TextInput
              className={`h-12 border ${
                address.phone
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } rounded-xl px-4 text-gray-800`}
              placeholder="Enter your phone number"
              value={address.phone}
              onChangeText={(text) => setAddress({ ...address, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Address Line 1
            </Text>
            <TextInput
              className={`h-12 border ${
                address.addressLine1
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } rounded-xl px-4 text-gray-800`}
              placeholder="Street address, House no."
              value={address.addressLine1}
              onChangeText={(text) =>
                setAddress({ ...address, addressLine1: text })
              }
            />
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Address Line 2 (Optional)
            </Text>
            <TextInput
              className={`h-12 border ${
                address.addressLine2
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } rounded-xl px-4 text-gray-800`}
              placeholder="Apartment, building, floor, etc."
              value={address.addressLine2}
              onChangeText={(text) =>
                setAddress({ ...address, addressLine2: text })
              }
            />
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="w-[48%]">
            <Text className="text-sm font-medium text-gray-600 mb-2">City</Text>
            <TextInput
              className={`h-12 border ${
                address.city
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } rounded-xl px-4 text-gray-800`}
              placeholder="City"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />
          </View>
          <View className="w-[48%]">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              State
            </Text>
            <TextInput
              className={`h-12 border ${
                address.state
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } rounded-xl px-4 text-gray-800`}
              placeholder="State"
              value={address.state}
              onChangeText={(text) => setAddress({ ...address, state: text })}
            />
          </View>
        </View>

        <View className="mb-4">
          <View className="w-[48%]">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Pincode
            </Text>
            <TextInput
              className={`h-12 border ${
                address.pincode
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } rounded-xl px-4 text-gray-800`}
              placeholder="Pincode"
              value={address.pincode}
              onChangeText={(text) => setAddress({ ...address, pincode: text })}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderPaymentSection = () => (
    <View className="mx-4 mt-0 bg-white rounded-2xl overflow-hidden shadow-md">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <View className="w-7 h-7 rounded-full bg-emerald-500 items-center justify-center mr-3">
          <MaterialIcons name="payment" size={16} color="#ffffff" />
        </View>
        <Text className="text-lg font-bold text-gray-800 tracking-wide">
          Payment Method
        </Text>
      </View>

      <View className="p-4">
        {PaymentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`flex-row items-center justify-between py-3.5 px-4 border mb-3.5 rounded-xl ${
              paymentMethod === option.id
                ? `border-emerald-500 bg-emerald-50`
                : `border-gray-200 bg-gray-50`
            }`}
            onPress={() => setPaymentMethod(option.id)}
          >
            <View className="flex-row items-center">
              <View className="mr-3.5">{option.icon}</View>
              <Text
                className={`text-base ${
                  paymentMethod === option.id
                    ? "font-semibold text-emerald-600"
                    : "font-medium text-gray-700"
                }`}
              >
                {option.name}
              </Text>
            </View>
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                paymentMethod === option.id
                  ? "border-emerald-500"
                  : "border-gray-300"
              }`}
            >
              {paymentMethod === option.id && (
                <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Promo Code Section */}
      <View className="p-4 border-t border-gray-100">
        <View className="flex-row items-center mb-3.5">
          <Octicons name="tag" size={16} color="#666666" />
          <Text className="text-base font-semibold text-gray-800 ml-2">
            Promo Code
          </Text>
        </View>

        <View className="flex-row items-center">
          <TextInput
            className="flex-1 h-12 border border-gray-200 rounded-xl px-4 text-gray-800 mr-3 bg-gray-50"
            placeholder="Enter promo code"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity
            className={`h-12 px-4 rounded-xl items-center justify-center ${
              promoCode ? "bg-emerald-500" : "bg-gray-400"
            }`}
            onPress={handleApplyPromo}
            disabled={!promoCode}
          >
            <Text className="text-base font-semibold text-white">Apply</Text>
          </TouchableOpacity>
        </View>

        {promoApplied && (
          <View className="flex-row items-center justify-between mt-3.5 p-3.5 bg-emerald-50 rounded-xl">
            <View className="flex-row items-center">
              <AntDesign name="checkcircle" size={16} color={PRIMARY_COLOR} />
              <Text className="text-sm font-medium text-emerald-600 ml-2">
                FRESH15 applied - 15% off
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPromoCode("");
                setPromoApplied(false);
              }}
            >
              <AntDesign name="close" size={16} color="#666666" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="h-[60px] flex-row items-center justify-between px-4 bg-white border-b border-gray-100 shadow-sm">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={22} color="#000000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 tracking-wide">
          Checkout
        </Text>
        <View className="w-10" />
      </View>

      {/* Progress Indicator */}
      <View className="flex-row items-center justify-center py-5 bg-white border-b border-gray-100">
        <View className="items-center">
          <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center">
            <Text className="text-white text-sm font-semibold">1</Text>
          </View>
          <Text className="mt-1.5 text-xs font-medium text-gray-800">
            Delivery
          </Text>
        </View>
        <View
          className={`w-16 h-0.5 mx-3 ${
            activeSection === "payment" ? "bg-emerald-500" : "bg-gray-200"
          }`}
        />
        <View className="items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              activeSection === "payment" ? "bg-emerald-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activeSection === "payment" ? "text-white" : "text-gray-500"
              }`}
            >
              2
            </Text>
          </View>
          <Text
            className={`mt-1.5 text-xs font-medium ${
              activeSection === "payment" ? "text-gray-800" : "text-gray-500"
            }`}
          >
            Payment
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View className="m-4 bg-white rounded-2xl overflow-hidden shadow-md">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-800 tracking-wide">
              Order Summary
            </Text>
            <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center">
              <Text className="text-xs font-bold text-white">
                {cart.length}
              </Text>
            </View>
          </View>

          {/* Order Items */}
          <View className="p-4">
            {Array.isArray(cart) &&
              cart?.map((item, index) => (
                <View
                  className={`flex-row py-3.5 ${
                    index < cart.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                  key={item._id}
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-[75px] h-[75px] rounded-xl bg-gray-100"
                  />
                  <View className="flex-1 ml-3.5 justify-between">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-base font-semibold text-gray-800 flex-1 mr-2 leading-5">
                        {item.name}
                      </Text>
                      <Text className="text-base font-bold text-gray-800">
                        ₹{item.price}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500 my-1">
                      {item.category}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="bg-gray-200 px-2.5 py-1 rounded-md">
                        <Text className="text-sm font-medium text-gray-700">
                          Qty: {item.quantity}
                        </Text>
                      </View>
                      <Text className="text-base font-bold text-emerald-600">
                        ₹{item.price * item.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {activeSection === "delivery"
          ? renderDeliveryDetails()
          : renderPaymentSection()}

        {/* Order Total */}
        <View className="mx-4 mt-0 mb-24 bg-white rounded-2xl overflow-hidden shadow-md">
          <View className="px-4 py-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-800 tracking-wide">
              Price Details
            </Text>
          </View>

          <View className="p-4">
            <View className="flex-row justify-between mb-3.5">
              <Text className="text-base text-gray-600">Subtotal</Text>
              <Text className="text-base font-semibold text-gray-800">
                ₹{subtotal}
              </Text>
            </View>

            <View className="flex-row justify-between mb-3.5">
              <Text className="text-base text-gray-600">Delivery Fee</Text>
              <Text className="text-base font-semibold text-gray-800">
                ₹{deliveryFee}
              </Text>
            </View>

            <View className="flex-row justify-between mb-3.5">
              <Text className="text-base text-gray-600">Tax (5%)</Text>
              <Text className="text-base font-semibold text-gray-800">
                ₹{tax}
              </Text>
            </View>

            {promoApplied && (
              <View className="flex-row justify-between mb-3.5">
                <Text className="text-base font-medium text-emerald-600">
                  Discount (15%)
                </Text>
                <Text className="text-base font-semibold text-emerald-600">
                  -₹{discount}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between mt-1.5 pt-4 border-t border-gray-100">
              <Text className="text-lg font-bold text-gray-800">
                Total Amount
              </Text>
              <Text className="text-xl font-bold text-emerald-600">
                ₹{total}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 pt-3 pb-6 gap-4 bg-white border-t border-gray-100 shadow-lg">
        <TouchableOpacity
          className="h-14 bg-emerald-500 rounded-xl items-center justify-center shadow-md shadow-emerald-200"
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-lg font-bold text-white tracking-wide">
              {activeSection === "delivery"
                ? "Continue to Payment"
                : "Place Order"}
            </Text>
          )}
        </TouchableOpacity>
        {/* force buy */}
        <TouchableOpacity
          className={`${
            activeSection == "delivery" && "hidden"
          } h-14 bg-emerald-800 rounded-xl items-center justify-center shadow-md shadow-emerald-200`}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-lg font-bold text-white tracking-wide">
              Force buy order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CheckoutPage;
