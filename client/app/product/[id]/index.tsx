import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import ProductDetailScreen from "@/src/screens/product/ProductDetailScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProductInterface } from "@/src/types";
import ErrGeneric from "@/src/screens/ErrGeneric";

export default function index() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetail] = useState<ProductInterface | null>(
    null
  );
  useEffect(() => {
    console.log("in product detail use effect");

    async function getProductDetail() {
      console.log("in get product detail", id);
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/product/get-product-detail/${id}`,
          { timeout: 8000 }
        );

        console.log("product detail res: ", res);

        if (res?.status == 200) {
          setProductDetail(res?.data?.product);
        }
      } catch (error) {
        console.log("err while fetching product detail", error);
      } finally {
        console.log("set laoding is false now");
        setLoading(false);
      }
    }

    getProductDetail();
  }, []);

  // if (!productDetail) return <ErrGeneric />;

  return (
    // <ScrollView >
    // <Text>{loading ? "Loading....." : "  Product detail page:{id}"}</Text>
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? (
        <Text>Loading.....</Text>
      ) : !productDetail ? (
        <ErrGeneric />
      ) : (
        <ProductDetailScreen productDetail={productDetail} />
      )}
    </GestureHandlerRootView>
    // <ProductDetailScreen />
    // </ScrollView >
  );
}
