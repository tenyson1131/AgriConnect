import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useContext, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import HomeScreen from "@/src/screens/HomeScreen";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProductDetailScreen from "@/src/screens/product/ProductDetailScreen";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";

export default function home() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomeScreen />
    </GestureHandlerRootView>
  );
}
