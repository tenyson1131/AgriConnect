import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { CartContext } from "@/context/CartContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample cart data
// const initialCartItems = [
//   {
//     id: 1,
//     name: "Indonesian Beans",
//     category: "Beans",
//     weight: "500g",
//     price: 42.5,
//     quantity: 1,
//     image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
//   },
//   {
//     id: 2,
//     name: "Peru Beans",
//     category: "Beans",
//     weight: "250g",
//     price: 60.0,
//     quantity: 2,
//     image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
//   },
// ];

const CartScreen = () => {
  const router = useRouter();
  // const [cartItems, setCartItems] = useState(initialCartItems);

  const { cart_Loading, cart, loadCart, removeFromCart } =
    useContext(CartContext);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  // Calculate cart totals
  const itemsTotal = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;
  const discount = 0;
  const total = itemsTotal - discount;

  // Update quantity functions
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <View className="flex-1 bg-white s bg-red-600s">
      {/* Header */}
      <SafeAreaView className="bg-white borders">
        <View className="flex-row items-center justify-between px-4 pt-12s pt-2 pb-7">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">My Cart</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      {/* Notification Banner */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-orange-50 px-4 py-3 rounded-2xl">
          <View className="w-7 h-7 rounded-full bg-orange-100 items-center justify-center mr-3">
            <Feather name="shopping-bag" size={14} color="#FF6B21" />
          </View>
          <Text className="text-orange-500 text-sm font-medium">
            You have {cart.length} items in your cart
          </Text>
        </View>
      </View>

      {/* Main Container - Flex-1 to push checkout to bottom */}
      <View className="flex-1 flex-col justify-between">
        {cart_Loading ? (
          <View className="mt-10">
            <ActivityIndicator size="large" color="#333" />
          </View>
        ) : (
          //  {/* Cart Items */}
          <ScrollView
            className="flex-grow px-4"
            showsVerticalScrollIndicator={false}
          >
            {cart.length > 0 &&
              cart?.map((item) => (
                <View
                  key={item._id}
                  className="flex-row py-4 border-b border-gray-100"
                >
                  {/* Product Image */}
                  <View className="w-[70px] h-[70px] bg-gray-100 rounded-xl items-center justify-center mr-3 overflow-hidden">
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Product Info */}
                  <View className="flex-1 justify-between">
                    <View className="flex-row justify-between">
                      <View className="flex-1 pr-4">
                        <Text className="text-base font-semibold text-gray-900 mb-1">
                          {item.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mb-2">
                          {item.category} •{/* {item.weight} */}
                        </Text>
                      </View>

                      {/* Delete button */}
                      <TouchableOpacity
                        onPress={() => removeFromCart(item._id)}
                        className="p-1"
                      >
                        <Feather name="trash-2" size={18} color="#888" />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-semibold text-gray-900">
                        ₹ {item.price.toFixed(2)}
                      </Text>

                      {/* Quantity Controls */}
                      <View className="flex-row items-center bg-gray-100 rounded-full py-1 px-1">
                        <TouchableOpacity
                          onPress={() => decreaseQuantity(item._id)}
                          className="w-7 h-7 bg-white rounded-full items-center justify-center"
                        >
                          <Feather name="minus" size={16} color="#333" />
                        </TouchableOpacity>

                        <Text className="mx-3 font-semibold">
                          {item.quantity}
                        </Text>

                        <TouchableOpacity
                          onPress={() => increaseQuantity(item._id)}
                          className="w-7 h-7 bg-white rounded-full items-center justify-center"
                        >
                          <Feather name="plus" size={16} color="#333" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
        )}

        {/* Order Summary - positioned at bottom */}
        <View className="p-4 bg-white">
          {/* Summary Rows */}
          <View className="mb-6">
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500 text-base">Items</Text>
              <Text className="text-gray-900 font-medium text-base">
                ₹ {itemsTotal.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500 text-base">Discounts</Text>
              <Text className="text-green-600 font-medium text-base">
                - ₹ {discount.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-gray-900 font-semibold text-base">
                Total
              </Text>
              <Text className="text-gray-900 font-bold text-base">
                ₹ {total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity className="bg-gray-900 rounded-full py-4 items-center">
            <Text className="text-white font-semibold text-base">Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartScreen;
