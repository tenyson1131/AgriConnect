import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import HomeScreen from "@/src/screens/HomeScreen";
import axios from "axios";

export default function home() {
  const { onLogout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/product/get-products`
        );

        console.log("fetched products result: ", result.data);
        if (result.data) {
          setProducts(result.data.products);
        }
      } catch (error) {
        console.log("error in fetchProducts", error);
      }
    }

    fetchProducts();
  }, []);
  return (
    // <View>
    //   <Text>Homepage</Text>

    //   <View className="flex-row justify-between px-5">
    //     <View>
    //       <Text>ADRESS</Text>
    //     </View>

    //     <View>
    //       <Pressable
    //         className="bg-red-500 py-2"
    //         onPress={() => router.push("/user/profile")}
    //       >
    //         <Text>Profile</Text>
    //       </Pressable>
    //     </View>
    //   </View>
    // </View>
    <HomeScreen products={products} />
  );
}
