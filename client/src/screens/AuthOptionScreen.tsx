import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AuthOptionScreenProps {
  navigation: any;
}

const AuthOptionScreen: React.FC<AuthOptionScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1470&auto=format&fit=crop",
      }}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>AgriConnect</Text>
            <Text style={styles.tagline}>Farm Fresh, Direct to You</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.farmerButton]}
              onPress={() =>
                navigation.navigate("SignUp", { userType: "farmer" })
              }
            >
              <Text style={styles.buttonText}>Sign up as Farmer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buyerButton]}
              onPress={() =>
                navigation.navigate("SignUp", { userType: "buyer" })
              }
            >
              <Text style={styles.buttonText}>Sign up as Buyer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Connect directly • Fair prices • Local produce
          </Text>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "15%",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 8,
    opacity: 0.9,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: "10%",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  farmerButton: {
    backgroundColor: "#27AE60", // Forest green for farmers
  },
  buyerButton: {
    backgroundColor: "#F39C12", // Orange for buyers
  },
  loginButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
});

export default AuthOptionScreen;
