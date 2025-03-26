import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { ProductInterface } from "../types";

// extended interface for deals
interface DealInterface extends ProductInterface {
  dealType: "Discount" | "FlashSale" | "BundleOffer" | "SeasonalOffer";
  discountPercentage: number;
  originalPrice: number;
  endDate: Date | string;
  dealDescription: string;
  limitedStock?: boolean;
}

// dummy data for illustration
const DUMMY_DEALS: DealInterface[] = [
  {
    _id: "deal1",
    name: "Premium Kashmiri Apples",
    desc: "Fresh, crisp and juicy Kashmiri apples with a sweet-tart flavor. Handpicked from the best orchards.",
    price: 199, // Discounted price
    originalPrice: 299,
    discountPercentage: 33,
    images: [
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    category: "Fruits",
    stock: 25,
    seller: "usr56789",
    farmName: "Himalayan Orchards",
    location: {
      country: "India",
      state: "Kashmir",
      city: "Srinagar",
    },
    dealType: "Discount",
    endDate: "2023-12-10T23:59:59.000Z",
    dealDescription: "Special monsoon discount on premium Kashmiri apples!",
  },
  {
    _id: "deal2",
    name: "Organic Vegetable Basket",
    desc: "A handpicked selection of fresh seasonal vegetables. Includes carrots, tomatoes, spinach, bell peppers, and more.",
    price: 399,
    originalPrice: 599,
    discountPercentage: 33,
    images: [
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    category: "Vegetables",
    stock: 10,
    seller: "usr12345",
    farmName: "Green Earth Organics",
    location: {
      country: "India",
      state: "Karnataka",
      city: "Bangalore",
    },
    dealType: "BundleOffer",
    endDate: "2023-12-05T23:59:59.000Z",
    dealDescription: "Weekly vegetable basket at special bundle price!",
    limitedStock: true,
  },
  {
    _id: "deal3",
    name: "Premium Honey Collection",
    desc: "Pure, natural honey collected from the forests of Uttarakhand. Unprocessed and rich in nutrients.",
    price: 499,
    originalPrice: 699,
    discountPercentage: 29,
    images: [
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    category: "Organic and Specialty Products",
    stock: 15,
    seller: "usr34567",
    farmName: "Mountain Bee Farms",
    location: {
      country: "India",
      state: "Uttarakhand",
      city: "Nainital",
    },
    dealType: "FlashSale",
    endDate: "2023-11-30T23:59:59.000Z",
    dealDescription: "24-hour flash sale on premium forest honey!",
    limitedStock: true,
  },
  {
    _id: "deal4",
    name: "Organic Basmati Rice",
    desc: "Premium long-grain basmati rice, organically grown without pesticides. Aromatic and perfect for biryanis and pulaos.",
    price: 249,
    originalPrice: 299,
    discountPercentage: 17,
    images: [
      "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    category: "Grains and Pulses",
    stock: 50,
    seller: "usr23456",
    farmName: "Punjab Organic Farms",
    location: {
      country: "India",
      state: "Punjab",
      city: "Amritsar",
    },
    dealType: "SeasonalOffer",
    endDate: "2023-12-15T23:59:59.000Z",
    dealDescription: "Seasonal harvest special on premium basmati rice!",
  },
  {
    _id: "deal5",
    name: "Assorted Dry Fruits Pack",
    desc: "Premium selection of almonds, cashews, raisins, and pistachios. Perfect for snacking and gifting.",
    price: 799,
    originalPrice: 1199,
    discountPercentage: 33,
    images: [
      "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    category: "Nuts and Dry Fruits",
    stock: 20,
    seller: "usr45678",
    farmName: "Kashmir Valley Farms",
    location: {
      country: "India",
      state: "Kashmir",
      city: "Srinagar",
    },
    dealType: "BundleOffer",
    endDate: "2023-12-20T23:59:59.000Z",
    dealDescription: "Festival special assorted dry fruits pack!",
  },
];

const DealsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [deals, setDeals] = useState<DealInterface[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const { width } = Dimensions.get("window");

  // Mock API fetch
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setTimeout(() => {
          setDeals(DUMMY_DEALS);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching deals:", error);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleImageLoad = (dealId) => {
    setImageLoading((prev) => ({
      ...prev,
      [dealId]: true,
    }));
  };

  const filters = [
    "All",
    "Discount",
    "FlashSale",
    "BundleOffer",
    "SeasonalOffer",
  ];
  const filterLabels = {
    All: "All Collections",
    Discount: "Specials",
    FlashSale: "Limited",
    BundleOffer: "Curated",
    SeasonalOffer: "Seasonal",
  };

  const filteredDeals =
    activeFilter === "All"
      ? deals
      : deals.filter((deal) => deal.dealType === activeFilter);

  const getDaysRemaining = (endDate: string | Date) => {
    const end = new Date(endDate);
    const now = new Date();
    const differenceInTime = end.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#F5F5F5",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <ActivityIndicator size="small" color="#1A1A1A" />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#1A1A1A",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Curating Special Collections
          </Text>
          <Text style={{ fontSize: 14, color: "#757575", textAlign: "center" }}>
            Discovering extraordinary farm selections just for you
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Refined Header */}
      <View
        style={{
          paddingTop: 12,
          paddingBottom: 12,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#EEEEEE",
          backgroundColor: "#FAFAFA",
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
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F5F5F5",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#1A1A1A" }}>
            Today's Deals
          </Text>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F5F5F5",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="shopping-cart" size={18} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Elegant Filter Tabs */}
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#EEEEEE",
          backgroundColor: "#FAFAFA",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={{
                marginRight: 24,
                paddingBottom: 8,
                borderBottomWidth: activeFilter === filter ? 2 : 0,
                borderBottomColor: "#1A1A1A",
              }}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: activeFilter === filter ? "#1A1A1A" : "#757575",
                  fontWeight: activeFilter === filter ? "600" : "400",
                }}
              >
                {filterLabels[filter]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sophisticated Product Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "#FAFAFA",
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {filteredDeals.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#F5F5F5",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Feather name="package" size={30} color="#BDBDBD" />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1A1A1A",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              No selections available
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#757575",
                textAlign: "center",
                marginHorizontal: 40,
                marginBottom: 20,
              }}
            >
              Our artisans are preparing new selections for you
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {filteredDeals.map((deal) => (
              <TouchableOpacity
                key={deal._id}
                style={{
                  width: (width - 50) / 2,
                  marginBottom: 24,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  overflow: "hidden",
                }}
                onPress={() => router.push(`/products/${deal._id}`)}
              >
                {/* Sophisticated Image Display */}
                <View style={{ position: "relative" }}>
                  <View
                    style={{
                      height: 160,
                      backgroundColor: "#F5F5F5",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!imageLoading[deal._id] && (
                      <ActivityIndicator size="small" color="#1A1A1A" />
                    )}
                    <Image
                      source={{ uri: deal.images[0] }}
                      style={{
                        width: "100%",
                        height: 160,
                        opacity: imageLoading[deal._id] ? 1 : 0,
                      }}
                      resizeMode="cover"
                      onLoad={() => handleImageLoad(deal._id)}
                    />
                  </View>

                  {/* Minimal Tags */}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 10,
                          fontWeight: "500",
                        }}
                      >
                        {deal.discountPercentage}% Off
                      </Text>
                    </View>
                    {deal.limitedStock && (
                      <View
                        style={{
                          backgroundColor: "rgba(0,0,0,0.7)",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 10,
                            fontWeight: "500",
                          }}
                        >
                          Limited
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Refined Product Info */}
                <View style={{ padding: 12 }}>
                  <Text
                    style={{ fontSize: 11, color: "#757575", marginBottom: 4 }}
                  >
                    {deal.farmName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#1A1A1A",
                      marginBottom: 8,
                      lineHeight: 18,
                      height: 36,
                      fontWeight: "500",
                    }}
                    numberOfLines={2}
                  >
                    {deal.name}
                  </Text>
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#1A1A1A",
                        marginRight: 6,
                      }}
                    >
                      ₹{deal.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#BDBDBD",
                        textDecorationLine: "line-through",
                      }}
                    >
                      ₹{deal.originalPrice}
                    </Text>
                  </View>
                  <Text
                    style={{ fontSize: 10, color: "#757575", marginTop: 4 }}
                  >
                    {getDaysRemaining(deal.endDate) <= 0
                      ? "Ends today"
                      : `${getDaysRemaining(deal.endDate)} days remaining`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Elegant Promotion Banner */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          paddingHorizontal: 20,
          paddingVertical: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#F5F5F5",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="gift" size={16} color="#1A1A1A" />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{ fontSize: 13, fontWeight: "500", color: "#1A1A1A" }}
              >
                Artisan Festival Collection
              </Text>
              <Text style={{ fontSize: 11, color: "#757575" }}>
                Use code ARTISAN for 5% additional discount
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#1A1A1A",
              borderRadius: 4,
              paddingVertical: 6,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#1A1A1A" }}>
              Apply
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DealsScreen;
