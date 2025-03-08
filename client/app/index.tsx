import { View, Text } from "react-native";
import { useState } from "react";
import { Redirect } from "expo-router";

const index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;
