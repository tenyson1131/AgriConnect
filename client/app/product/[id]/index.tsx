import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import ProductDetailScreen from "@/src/screens/product/ProductDetailScreen";

export default function index() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  // const [productDetail, setProductDetail] = useState({});
  // useEffect(() => {
  // //   async function getProductDetail() {
  // //     setLoading(true);
  // //     try {
  // //       const res = await axios.get(
  // //         `${process.env.EXPO_PUBLIC_SERVER_URL}/api/product/get-product-detail/${id}`
  // //       );

  // //       console.log("product detail res: ", res);
  // //     } catch (error) {
  // //       console.log("err while fetching product detail", error);
  // //     } finally {
  // //       setLoading(false);
  // //     }
  // //   }

  // //   getProductDetail();
  // // }, []);

  return (
    // <ScrollView >
    // <Text>{loading ? "Loading....." : "  Product detail page:{id}"}</Text>
    <ProductDetailScreen />
    // </ScrollView >
  );
}
