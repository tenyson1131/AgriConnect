import { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text } from "react-native";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Transparent black for glass effect
        borderLeftColor: "#4CAF50", // Green left border
        borderRadius: 10, // Rounded edges
        shadowColor: "#4CAF50", // Green glow effect
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff", // White text
      }}
      text2Style={{
        fontSize: 14,
        color: "#dddddd", // Light gray text
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: "rgba(30, 30, 30, 0.9)", // Darker glass effect
        borderLeftColor: "#FF5252", // Red border for errors
        borderRadius: 10,
        shadowColor: "#FF5252",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
        color: "#ffff",
      }}
      text2Style={{
        fontSize: 14,
        color: "#bbbbbb",
      }}
    />
  ),

  info: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "rgba(20, 20, 20, 0.85)",
        borderLeftColor: "#2196F3", // Blue for info
        borderRadius: 10,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
      }}
      text2Style={{
        fontSize: 14,
        color: "#cccccc",
      }}
    />
  ),

  default: (props) => (
    <View
      style={{
        padding: 15,
        borderRadius: 10,
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#ffffff" }}>
        {props.text1}
      </Text>
      <Text style={{ fontSize: 14, color: "#bbbbbb" }}>{props.text2}</Text>
    </View>
  ),
};

export default toastConfig;
