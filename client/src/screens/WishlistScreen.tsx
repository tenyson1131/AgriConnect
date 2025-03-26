import React, { useState, useMemo, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
  ImageBackground,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { ProductContext } from "@/context/ProductContext";
import { ProductInterface } from "../types";

const { width, height } = Dimensions.get("window");

// Dummy data for wishlist
const dummyWishlist: ProductInterface[] = [
  {
    _id: "1",
    name: "Organic Red Apples",
    desc: "Fresh, juicy organic apples from local farms",
    price: 199,
    images: [
      "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    category: "Fruits",
    stock: 50,
    seller: "Organic Farms Co.",
    farmName: "Green Valley Farm",
    location: {
      country: "India",
      state: "Maharashtra",
      city: "Nashik",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Fresh Spinach",
    desc: "Organic spinach leaves, rich in nutrients",
    price: 79,
    images: [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    category: "Vegetables",
    stock: 30,
    seller: "Fresh Farms",
    farmName: "Sunrise Farm",
    location: {
      country: "India",
      state: "Gujarat",
      city: "Ahmedabad",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Organic Brown Rice",
    desc: "Premium quality organic brown rice",
    price: 299,
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    category: "Grains and Pulses",
    stock: 100,
    seller: "Rice Valley",
    farmName: "Paddy Fields",
    location: {
      country: "India",
      state: "Punjab",
      city: "Amritsar",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Organic Honey",
    desc: "Pure, raw, unfiltered honey from mountain flowers",
    price: 449,
    images: [
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    ],
    category: "Organic and Specialty Products",
    stock: 20,
    seller: "Mountain Beekeepers",
    farmName: "Honey Haven",
    location: {
      country: "India",
      state: "Himachal Pradesh",
      city: "Shimla",
    },
    createdAt: new Date().toISOString(),
  },
];

const WishlistPage = () => {
  const router = useRouter();
  const { wishlist } = useContext(ProductContext);

  const [selectedTab, setSelectedTab] = useState("All");

  const handleBack = () => {
    router.back();
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    console.log("Remove from wishlist:", productId);
  };

  const tabs = [
    "All",
    "Fruits",
    "Vegetables",
    "Grains and Pulses",
    "Organic and Specialty Products",
  ];

  // Filter products based on selected tab
  const filteredWishlist = useMemo(() => {
    if (selectedTab === "All") {
      // return dummyWishlist;
      return wishlist;
    } else {
      // return dummyWishlist.filter((item) => item.category === selectedTab);
      return wishlist.filter((item) => item.category === selectedTab);
    }
  }, [selectedTab]);

  const renderWishlistItem = ({ item }: { item: ProductInterface }) => (
    <Pressable
      onPress={() => handleProductPress(item._id)}
      style={{
        width: width - 40,
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        overflow: "hidden",
      }}
    >
      <ImageBackground
        source={{ uri: item.images[0] }}
        style={{
          width: "100%",
          height: 180,
        }}
        imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        <View
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 30,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
              {item.category}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleRemoveFromWishlist(item._id)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <AntDesign name="heart" size={18} color="#FF385C" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: 16,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#16161D",
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="store" size={14} color="#6D757D" />
                <Text
                  style={{
                    marginLeft: 4,
                    fontSize: 13,
                    color: "#6D757D",
                    fontWeight: "500",
                  }}
                >
                  {item.farmName}
                </Text>
                <View
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#6D757D",
                    marginHorizontal: 8,
                  }}
                />
                <Feather name="map-pin" size={13} color="#6D757D" />
                <Text
                  style={{
                    marginLeft: 4,
                    fontSize: 13,
                    color: "#6D757D",
                    fontWeight: "500",
                  }}
                >
                  {item.location.city}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: "#2FAB73",
                }}
              >
                ₹{item.price}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: "#6D757D",
          }}
          numberOfLines={2}
        >
          {item.desc}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="package-variant"
              size={16}
              color="#6D757D"
            />
            <Text
              style={{
                marginLeft: 4,
                fontSize: 13,
                color: "#6D757D",
              }}
            >
              {item.stock} in stock
            </Text>
          </View>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              backgroundColor: "#16161D",
              borderRadius: 12,
            }}
            onPress={() => handleProductPress(item._id)}
          >
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );

  const renderEmptyWishlist = () => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        marginTop: 40,
      }}
    >
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
        }}
        style={{ width: 120, height: 120, marginBottom: 30, opacity: 0.8 }}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: "#16161D",
          marginBottom: 10,
        }}
      >
        Your Wishlist is Empty
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#6D757D",
          textAlign: "center",
          lineHeight: 22,
          marginBottom: 30,
          paddingHorizontal: 20,
        }}
      >
        Explore our marketplace and save your favorite products for later
      </Text>
      <TouchableOpacity
        style={{
          paddingVertical: 14,
          paddingHorizontal: 28,
          backgroundColor: "#2FAB73",
          borderRadius: 14,
        }}
        onPress={() => router.push("/")}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Explore Products
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#F5F7FA",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#16161D" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#F1F7FF",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <AntDesign name="heart" size={22} color="#FF385C" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#16161D",
              }}
            >
              My Wishlist
            </Text>
          </View>
          <View style={{ width: 44, height: 44 }} />
        </View>
      </View>

      {/* Category Tabs */}
      <View
        style={{
          paddingVertical: 16,
          backgroundColor: "white",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 100,
                backgroundColor: selectedTab === tab ? "#16161D" : "#F5F7FA",
                marginRight: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedTab === tab ? "white" : "#6D757D",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Count */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#16161D" }}>
          {filteredWishlist.length} Products
        </Text>
      </View>

      {/* Wishlist */}
      {filteredWishlist.length === 0 ? (
        renderEmptyWishlist()
      ) : (
        <FlatList
          data={filteredWishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default WishlistPage;
