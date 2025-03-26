import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import axios from "axios";
import { OrderInterface } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/order/get-orders`
        );

        console.log("fetched orders: ", result.data);
        if (result.data) {
          setOrders(result.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const tabs = ["All", "Pending", "Confirmed", "Shipped", "Delivered"];

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === activeTab);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          color: "#F59E0B",
          bgColor: "bg-amber-50",
          icon: (
            <MaterialIcons name="pending-actions" size={14} color="#F59E0B" />
          ),
        };
      case "Confirmed":
        return {
          color: "#3B82F6",
          bgColor: "bg-blue-50",
          icon: <MaterialIcons name="thumb-up" size={14} color="#3B82F6" />,
        };
      case "Shipped":
        return {
          color: "#8B5CF6",
          bgColor: "bg-purple-50",
          icon: (
            <MaterialIcons name="local-shipping" size={14} color="#8B5CF6" />
          ),
        };
      case "Delivered":
        return {
          color: "#10B981",
          bgColor: "bg-green-50",
          icon: <MaterialIcons name="check-circle" size={14} color="#10B981" />,
        };
      default:
        return {
          color: "#6B7280",
          bgColor: "bg-gray-50",
          icon: <MaterialIcons name="help" size={14} color="#6B7280" />,
        };
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const getTotalQuantity = (products: any[]) => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  const getSellerName = (order: OrderInterface) => {
    return order.products[0]?.productId?.farmName || "Farm Fresh";
  };

  const getDeliveryLocation = (order: OrderInterface) => {
    const { city, state } = order.address;
    return city && state ? `${city}, ${state}` : "Location not specified";
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-white p-6 rounded-3xl shadow-md items-center">
          <ActivityIndicator size="large" color="#2FAB73" />
          <Text className="mt-4 text-base text-gray-600 font-medium">
            Loading your orders...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with Gradient Feel */}
      <View className="bg-white px-5 pt-6 pb-5 rounded-b-3xl shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3"
            >
              <Ionicons name="arrow-back" size={22} color="#2A2A2A" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                My Orders
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Track and manage your purchases
              </Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-green-50 justify-center items-center">
            <Feather name="filter" size={18} color="#2FAB73" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6"
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-4 py-2 mr-3 rounded-full ${
                activeTab === tab ? "bg-green-500" : "bg-gray-100"
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab ? "text-white" : "text-gray-600"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView showsVerticalScrollIndicator={false} className="px-5 py-6">
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-16">
            <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center mb-6">
              <Feather name="shopping-bag" size={40} color="#BDBDBD" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              No orders yet
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-8 px-10 leading-5">
              Your orders will appear here once you make a purchase
            </Text>
            <TouchableOpacity
              className="bg-green-500 px-6 py-3 rounded-full shadow-sm"
              onPress={() => router.push("/user/category")}
            >
              <Text className="text-white font-medium">Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {filteredOrders.map((order) => (
              <TouchableOpacity
                key={order._id}
                className="mb-6 bg-white rounded-3xl overflow-hidden shadow-sm"
                onPress={() => router.push(`/orders/${order._id}`)}
              >
                {/* Order Status Banner */}
                <View
                  className={`px-5 py-3 ${
                    getStatusInfo(order.orderStatus).bgColor
                  } flex-row justify-between items-center`}
                >
                  <View className="flex-row items-center">
                    {getStatusInfo(order.orderStatus).icon}
                    <Text
                      className="text-xs font-medium ml-1.5"
                      style={{ color: getStatusInfo(order.orderStatus).color }}
                    >
                      {order.orderStatus}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </Text>
                </View>

                {/* Seller and Order ID */}
                <View className="px-5 pt-3 pb-2 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-green-50 justify-center items-center mr-2">
                      <FontAwesome5 name="store" size={12} color="#2FAB73" />
                    </View>
                    <View>
                      <Text className="text-sm font-semibold text-gray-800">
                        {getSellerName(order)}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {getDeliveryLocation(order)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500">
                    #{order._id.slice(-5)}
                  </Text>
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-100 mx-5" />

                {/* Products Preview */}
                <View className="px-5 py-3">
                  {order.products.slice(0, 1).map((product) => (
                    <View key={product._id} className="flex-row">
                      <Image
                        source={{ uri: product.productId.images[0] }}
                        className="w-16 h-16 rounded-xl"
                      />
                      <View className="flex-1 ml-3 justify-center">
                        <Text className="text-sm font-semibold text-gray-800 mb-1">
                          {product.productId.name}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-xs text-gray-500">
                            {product.quantity} × ₹{product.price}
                          </Text>
                          {order.products.length > 1 && (
                            <View className="ml-3 flex-row items-center">
                              <Entypo name="plus" size={12} color="#9CA3AF" />
                              <Text className="text-xs text-gray-500 ml-1">
                                {order.products.length - 1} more item
                                {order.products.length - 1 > 1 ? "s" : ""}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Payment Info */}
                <View className="h-px bg-gray-100 mx-5" />
                <View className="px-5 py-3 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-7 h-7 rounded-full bg-gray-100 justify-center items-center mr-2">
                      {order.paymentMethod === "Online" ? (
                        <Feather name="credit-card" size={14} color="#4B5563" />
                      ) : (
                        <MaterialIcons
                          name="payments"
                          size={14}
                          color="#4B5563"
                        />
                      )}
                    </View>
                    <View>
                      <Text className="text-xs text-gray-600">
                        {order.paymentMethod}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{
                          color:
                            order.paymentStatus === "Success"
                              ? "#10B981"
                              : "#F59E0B",
                        }}
                      >
                        {order.paymentStatus}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm font-medium text-gray-600 mr-1">
                      Total:
                    </Text>
                    <Text className="text-lg font-bold text-green-600">
                      ₹{order.totalAmount}
                    </Text>
                  </View>
                </View>

                {/* Track Order Button */}
                <View className="h-px bg-gray-100 mx-5" />
                <View className="px-5 py-3">
                  <TouchableOpacity
                    className="w-full bg-green-50 rounded-full py-2.5 flex-row justify-center items-center"
                    onPress={() => router.push(`/orders/${order._id}`)}
                  >
                    <Feather name="eye" size={14} color="#2FAB73" />
                    <Text className="ml-2 text-sm font-medium text-green-600">
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;
