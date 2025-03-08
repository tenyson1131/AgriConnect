import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface SignUpScreenProps {
  navigation: any;
  //   route: {
  //     params: {
  //       userType: "farmer" | "buyer";
  //     };
  //   };
}

const { width, height } = Dimensions.get("window");

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  //   const { userType } = route.params;
  const [userType, setUserType] = useState<"buyer" | "farmer">("buyer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Colors based on user type
  const [gradientColors, setGradientColors] = useState<[string, string]>([
    "#6A3DE8",
    "#9B6DFF",
  ]);
  const [buttonColor, setButtonColor] = useState("#6A3DE8");

  useEffect(() => {
    // Set theme colors based on user type
    if (userType === "buyer") {
      setGradientColors(["#6A3DE8", "#9B6DFF"]);
      setButtonColor("#6A3DE8");
    } else {
      setGradientColors(["#27AE60", "#6FCF97"]);
      setButtonColor("#27AE60");
    }
  }, [userType]);

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      // Show error
      return;
    }

    if (password !== confirmPassword) {
      // Show password mismatch error
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to home screen after successful signup
      // navigation.navigate('Home');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.header}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace("/auth/login")}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.logoText}>AgriConnect</Text>
        </SafeAreaView>

        {/* <View style={styles.wave}>
          <Image
            source={{ uri: "https://i.imgur.com/HGnBfce.png" }}
            style={styles.waveImage}
            resizeMode="stretch"
          />
        </View> */}
        <View className="bg-green-500s absolute bottom-0 left-0 w-full h-4 items-center">
          <View className="bg-white/30 h-full w-[85%] rounded-t-full"></View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <View style={styles.welcomeSection}>
                <Text style={styles.createAccount}>
                  {userType === "farmer"
                    ? "Join as a Farmer"
                    : "Create Buyer Account"}
                </Text>
                <Text style={styles.subtitle}>
                  {userType === "farmer"
                    ? "Start selling your farm products directly"
                    : "Connect with local farmers and fresh produce"}
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Your full name"
                      placeholderTextColor="#A0A0A0"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Your email address"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Your phone number"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry={!showPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.signupButton,
                    { backgroundColor: buttonColor },
                    isLoading && styles.signupButtonDisabled,
                  ]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  <Text style={styles.signupButtonText}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  By signing up, you agree to our{" "}
                  <Text style={[styles.termsLink, { color: buttonColor }]}>
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text style={[styles.termsLink, { color: buttonColor }]}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              <View style={styles.footer}>
                <View style={styles.footerLine} />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerGradient: {
    height: height * 0.22,
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    position: "relative",
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  loginText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  waveImage: {
    width: "100%",
    height: 60,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
  },
  welcomeSection: {
    marginBottom: 25,
  },
  createAccount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#F8F8F8",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  signupButton: {
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
    marginBottom: 16,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  termsLink: {
    fontWeight: "500",
  },
  footer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 10,
  },
  footerLine: {
    width: 60,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
});

export default SignUpScreen;
