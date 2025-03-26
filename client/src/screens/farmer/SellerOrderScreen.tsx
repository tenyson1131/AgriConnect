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
import { SafeAreaView } from "react-native-safe-area-context";

// Interfaces based on data models
export interface ProductInterface {
  _id: string;
  name: string;
  desc: string;
  price: number;
  images: string[];
  category: ProductCategory;
  stock: number;
  seller: string;
  farmName: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  createdAt?: Date | string;
}

type ProductCategory =
  | "Fruits"
  | "Vegetables"
  | "Herbs and Spices"
  | "Grains and Pulses"
  | "Nuts and Dry Fruits"
  | "Dairy and Animal Products"
  | "Organic and Specialty Products"
  | "Handmade Pickles"
  | "Farming Inputs and Supplies"
  | "Handmade Snacks";

export interface OrderInterface {
  _id: string;
  buyer: {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  seller: string;
  totalAmount: number;
  paymentMethod: "COD" | "Online";
  paymentStatus: "Pending" | "Success";
  orderStatus: "Pending" | "Confirmed" | "Shipped" | "Delivered";
  products: {
    _id: string;
    price: number;
    quantity: number;
    productId: ProductInterface;
  }[];
  address: {
    fullName: string;
    phone: string | number;
    addressLine1: string;
    addressLine2: string;
    country?: string;
    state?: string;
    city?: string;
    pincode: string | number;
  };
  createdAt: Date | string;
}

// Dummy data for illustration - you'll replace this with axios API call
const DUMMY_SELLER_ORDERS: OrderInterface[] = [
  {
    _id: "ord12345",
    buyer: {
      _id: "usr98765",
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+91 98765 43210",
    },
    seller: "usr56789",
    products: [
      {
        _id: "prod789",
        price: 249,
        quantity: 2,
        productId: {
          _id: "prod789",
          name: "Organic Red Apples",
          desc: "Fresh organic apples from the hills of Himachal Pradesh",
          price: 249,
          images: [
            "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          ],
          category: "Fruits",
          stock: 50,
          seller: "usr56789",
          farmName: "Fresh Farms Co.",
          location: {
            country: "India",
            state: "Himachal Pradesh",
            city: "Shimla",
          },
        },
      },
      {
        _id: "prod456",
        price: 120,
        quantity: 1,
        productId: {
          _id: "prod456",
          name: "Fresh Farm Eggs",
          desc: "Free-range country eggs from our organic farm",
          price: 120,
          images: [
            "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          ],
          category: "Dairy and Animal Products",
          stock: 30,
          seller: "usr56789",
          farmName: "Fresh Farms Co.",
          location: {
            country: "India",
            state: "Punjab",
            city: "Amritsar",
          },
        },
      },
    ],
    totalAmount: 618,
    paymentMethod: "Online",
    paymentStatus: "Success",
    orderStatus: "Shipped",
    address: {
      fullName: "Alex Johnson",
      phone: "+91 98765 43210",
      addressLine1: "Apt 404, Sunshine Towers",
      addressLine2: "Liberty Gardens",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400053",
    },
    createdAt: "2023-11-15T08:30:00.000Z",
  },
  {
    _id: "ord67890",
    buyer: {
      _id: "usr87654",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 87654 32109",
    },
    seller: "usr56789",
    products: [
      {
        _id: "prod123",
        price: 79,
        quantity: 3,
        productId: {
          _id: "prod123",
          name: "Organic Spinach",
          desc: "Fresh organic spinach leaves harvested daily",
          price: 79,
          images: [
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          ],
          category: "Vegetables",
          stock: 100,
          seller: "usr56789",
          farmName: "Fresh Farms Co.",
          location: {
            country: "India",
            state: "Karnataka",
            city: "Bangalore",
          },
        },
      },
    ],
    totalAmount: 237,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Confirmed",
    address: {
      fullName: "Priya Sharma",
      phone: "+91 87654 32109",
      addressLine1: "123, Green View Apartments",
      addressLine2: "MG Road",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: "560001",
    },
    createdAt: "2023-11-10T14:45:00.000Z",
  },
  {
    _id: "ord78901",
    buyer: {
      _id: "usr76543",
      name: "Rahul Verma",
      email: "rahul@example.com",
      phone: "+91 76543 21098",
    },
    seller: "usr56789",
    products: [
      {
        _id: "prod789",
        price: 249,
        quantity: 5,
        productId: {
          _id: "prod789",
          name: "Organic Red Apples",
          desc: "Fresh organic apples from the hills of Himachal Pradesh",
          price: 249,
          images: [
            "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          ],
          category: "Fruits",
          stock: 50,
          seller: "usr56789",
          farmName: "Fresh Farms Co.",
          location: {
            country: "India",
            state: "Himachal Pradesh",
            city: "Shimla",
          },
        },
      },
    ],
    totalAmount: 1245,
    paymentMethod: "Online",
    paymentStatus: "Success",
    orderStatus: "Pending",
    address: {
      fullName: "Rahul Verma",
      phone: "+91 76543 21098",
      addressLine1: "45, Sunshine Colony",
      addressLine2: "Sector 16",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110001",
    },
    createdAt: "2023-11-18T10:22:00.000Z",
  },
];

const SellerOrdersScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  // This useEffect would fetch data from your API
  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const result = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/order/get-sellerOrders`
        );

        console.log("fetched seller orders: ", result.data);
        if (result.data) {
          setOrders(result.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  const tabs = ["All", "Pending", "Confirmed", "Shipped", "Delivered"];

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === activeTab);

  const getStatusInfo = (status) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const getTotalQuantity = (products) => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    // Here you would implement the API call to update order status
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // Example API call:
    // await axios.put(`your-api-endpoint/orders/${orderId}`, { orderStatus: newStatus });

    // For demo purposes, let's update the local state
    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, orderStatus: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-white p-6 rounded-3xl shadow-md items-center">
          <ActivityIndicator size="large" color="#2FAB73" />
          <Text className="mt-4 text-base text-gray-600 font-medium">
            Loading orders...
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
                Customer Orders
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Manage orders from your customers
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
              <Feather name="package" size={40} color="#BDBDBD" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              No orders yet
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-8 px-10 leading-5">
              When customers place orders, they will appear here
            </Text>
          </View>
        ) : (
          <>
            {filteredOrders.map((order) => (
              <View
                key={order._id}
                className="mb-6 bg-white rounded-3xl overflow-hidden shadow-sm"
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

                {/* Customer Info */}
                <View className="px-5 pt-3 pb-2 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mr-2">
                      <FontAwesome5 name="user" size={12} color="#3B82F6" />
                    </View>
                    <View>
                      <Text className="text-sm font-semibold text-gray-800">
                        {order.buyer.name || "Customer"}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {order.buyer.phone || "No contact info"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500">
                    #{order._id.slice(-5)}
                  </Text>
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-100 mx-5" />

                {/* Order Items */}
                <View className="px-5 py-3">
                  <Text className="text-xs text-gray-500 mb-2">
                    {getTotalQuantity(order.products)} item(s) • ₹
                    {order.totalAmount}
                  </Text>

                  {order.products.map((product) => (
                    <View key={product._id} className="flex-row mb-2 last:mb-0">
                      <Image
                        source={{ uri: product.productId.images[0] }}
                        className="w-14 h-14 rounded-lg"
                      />
                      <View className="flex-1 ml-3 justify-center">
                        <Text className="text-sm font-semibold text-gray-800">
                          {product.productId.name}
                        </Text>
                        <View className="flex-row justify-between items-center">
                          <Text className="text-xs text-gray-500">
                            {product.quantity} × ₹{product.price}
                          </Text>
                          <Text className="text-sm font-medium text-gray-800">
                            ₹{product.quantity * product.price}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Shipping Address */}
                <View className="h-px bg-gray-100 mx-5" />
                <View className="px-5 py-3">
                  <View className="flex-row items-center mb-2">
                    <Feather name="map-pin" size={14} color="#6B7280" />
                    <Text className="text-xs font-medium text-gray-700 ml-1.5">
                      Shipping Address
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 leading-5">
                    {order.address.fullName}, {order.address.addressLine1},
                    {order.address.addressLine2 &&
                      ` ${order.address.addressLine2},`}
                    {"\n"}
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.pincode}
                  </Text>
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

                {/* Action Buttons */}
                <View className="h-px bg-gray-100 mx-5" />
                <View className="px-5 py-3">
                  <View className="flex-row space-x-2">
                    {order.orderStatus === "Pending" && (
                      <>
                        <TouchableOpacity
                          className="flex-1 bg-green-50 rounded-full py-2.5 flex-row justify-center items-center"
                          onPress={() =>
                            handleUpdateStatus(order._id, "Confirmed")
                          }
                        >
                          <MaterialIcons
                            name="thumb-up"
                            size={14}
                            color="#2FAB73"
                          />
                          <Text className="ml-2 text-xs font-medium text-green-600">
                            Confirm
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="flex-1 bg-red-50 rounded-full py-2.5 flex-row justify-center items-center"
                          onPress={() =>
                            alert(
                              "Order cancellation functionality would go here"
                            )
                          }
                        >
                          <MaterialIcons
                            name="cancel"
                            size={14}
                            color="#EF4444"
                          />
                          <Text className="ml-2 text-xs font-medium text-red-600">
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {order.orderStatus === "Confirmed" && (
                      <TouchableOpacity
                        className="flex-1 bg-purple-50 rounded-full py-2.5 flex-row justify-center items-center"
                        onPress={() => handleUpdateStatus(order._id, "Shipped")}
                      >
                        <MaterialIcons
                          name="local-shipping"
                          size={14}
                          color="#8B5CF6"
                        />
                        <Text className="ml-2 text-xs font-medium text-purple-600">
                          Mark as Shipped
                        </Text>
                      </TouchableOpacity>
                    )}

                    {order.orderStatus === "Shipped" && (
                      <TouchableOpacity
                        className="flex-1 bg-green-50 rounded-full py-2.5 flex-row justify-center items-center"
                        onPress={() =>
                          handleUpdateStatus(order._id, "Delivered")
                        }
                      >
                        <MaterialIcons
                          name="check-circle"
                          size={14}
                          color="#10B981"
                        />
                        <Text className="ml-2 text-xs font-medium text-green-600">
                          Mark as Delivered
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      className="flex-1 bg-gray-100 rounded-full py-2.5 flex-row justify-center items-center"
                      onPress={() => router.push(`/seller/orders/${order._id}`)}
                    >
                      <Feather name="eye" size={14} color="#4B5563" />
                      <Text className="ml-2 text-xs font-medium text-gray-700">
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellerOrdersScreen;
