import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const stats = [
    { label: "Orders", value: "24" },
    { label: "Reviews", value: "12" },
    { label: "Points", value: "1.4k" },
  ];

  const menuItems = [
    { icon: "settings", label: "Account Settings" },
    { icon: "bell", label: "Notifications" },
    { icon: "shopping-bag", label: "My Orders" },
    { icon: "heart", label: "Saved Items" },
    { icon: "credit-card", label: "Payment Methods" },
    { icon: "headphones", label: "Help Center" },
    { icon: "log-out", label: "Log Out" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View
        className="items-center gap-5"
        style={{
          flexDirection: "row",
          //   justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        <TouchableOpacity
        //   style={styles.backButton}
        //   onPress={() => navigation.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Profile</Text>
        {/* <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f1f5f9",
          }}
        >
          <Feather name="edit-2" size={18} color="#5a9d42" />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for tab bar
      >
        {/* Profile Card */}
        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* Background gradient banner */}
            <View
              style={{
                height: 80,
                backgroundColor: "#5a9d42",
                borderRadius: 16,
                marginBottom: 40,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "#7bb364",
                  transform: [{ rotate: "15deg" }, { scale: 1.5 }],
                  opacity: 0.5,
                }}
              />
            </View>

            {/* Profile image */}
            <View
              style={{
                position: "absolute",
                top: 40,
                alignSelf: "center",
                backgroundColor: "white",
                padding: 4,
                borderRadius: 60,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Image
                source={{
                  uri: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png",
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: "white",
                }}
              />
            </View>

            {/* Profile info */}
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text
                style={{ fontSize: 22, fontWeight: "700", marginBottom: 4 }}
              >
                User's Name
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Feather
                  name="map-pin"
                  size={14}
                  color="#9ca3af"
                  style={{ marginRight: 4 }}
                />
                <Text style={{ color: "#9ca3af", fontSize: 14 }}>
                  State, city
                </Text>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  paddingHorizontal: 20,
                  color: "#4b5563",
                  marginBottom: 16,
                }}
              >
                Food enthusiast and organic farming supporter. Always on the
                lookout for fresh local produce.
              </Text>

              {/* Connect button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#5a9d42",
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 30,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Feather
                  name="user-plus"
                  size={16}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 14 }}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats cards */}
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          {stats.map((stat, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 12,
                flex: 1,
                marginHorizontal: 5,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "700", color: "#5a9d42" }}
              >
                {stat.value}
              </Text>
              <Text style={{ color: "#6b7280", fontSize: 12 }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View> */}

        {/* Menu list */}
        <View style={{ marginTop: 24, marginHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 16,
              marginLeft: 4,
            }}
          >
            Settings
          </Text>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderBottomWidth: index === menuItems.length - 1 ? 0 : 1,
                  borderBottomColor: "#f3f4f6",
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor:
                      index === menuItems.length - 1 ? "#fee2e2" : "#f1f5f9",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                  }}
                >
                  <Feather
                    name={item.icon as any}
                    size={18}
                    color={
                      index === menuItems.length - 1 ? "#ef4444" : "#5a9d42"
                    }
                  />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: index === menuItems.length - 1 ? "600" : "500",
                    color:
                      index === menuItems.length - 1 ? "#ef4444" : "#1f2937",
                  }}
                >
                  {item.label}
                </Text>
                <Feather name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App info */}
        <View
          style={{ marginTop: 20, alignItems: "center", paddingBottom: 20 }}
        >
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>
            App version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
