import React, { useState, useEffect } from "react";
import {
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

interface SignUpScreenProps {
  type?: "buyer" | "farmer";
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ type }) => {
  const router = useRouter();

  const userType = type || "buyer";
  const { onRegister, onVerifyOTP } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
    address: "",
    city: "",
    bio: "",
    // Farmer-specific fields
    farmName: "",
    farmLocation: "",
    productCategories: [] as string[],
    // OTP verification
    otp: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Only 2 steps now
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);

  const [imageLoading, setImageLoading] = useState(false);

  // Updated colors based on user type
  const themeColors = {
    buyer: {
      primary: "#3D7DE8", // Changed from purple to blue
      secondary: "#6D9DFF",
      light: "#E4EEFF",
      text: "#3D7DE8",
    },
    farmer: {
      primary: "#507a42", // Dark green as requested
      secondary: "#689456",
      light: "#E8F0E5",
      text: "#507a42",
    },
  };

  const colors = userType === "farmer" ? themeColors.farmer : themeColors.buyer;

  // Available product categories for farmers
  const availableCategories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Meat",
    "Poultry",
    "Grains",
    "Herbs",
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      const currentCategories = [...prev.productCategories];
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          productCategories: currentCategories.filter((c) => c !== category),
        };
      } else {
        return {
          ...prev,
          productCategories: [...currentCategories, category],
        };
      }
    });
  };

  const selectProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result?.canceled) {
      setImageLoading(true);

      // uploading img to cloudinary here..
      const base64Img = `data:image/jpeg;base64,${result?.assets[0].base64}`;

      const data = new FormData();
      data.append("file", base64Img);
      data.append("upload_preset", process.env.EXPO_PUBLIC_PRESET_NAME!);
      data.append("cloud_name", process.env.EXPO_PUBLIC_CLOUD_NAME!);

      fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then(async (res) => {
          console.log(res);
          setFormData((prev) => ({
            ...prev,
            img: res.secure_url,
          }));
          setImageLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageLoading(false);
        });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Form validation for step 1
    if (step === 1) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      // if (!formData.address) newErrors.address = "Address is required";
      // if (!formData.city) newErrors.city = "City is required";

      // Farmer specific validation
      if (userType === "farmer") {
        if (!formData.farmName) newErrors.farmName = "Farm name is required";
        // if (!formData.farmLocation)
        //   newErrors.farmLocation = "Farm location is required";
        // if (formData.productCategories.length === 0) {
        //   newErrors.productCategories = "Select at least one category";
        // }
      }
    }
    // OTP validation for step 2
    else if (step === 2) {
      if (!formData.otp) {
        newErrors.otp = "Please enter the verification code";
      } else if (formData.otp.length !== 6) {
        newErrors.otp = "Verification code must be 6 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      if (step === 1) {
        // Send OTP to email
        sendVerificationEmail();
      } else {
        // Verify OTP and complete registration
        verifyOtpAndSignUp();
      }
    }
  };

  const sendVerificationEmail = async () => {
    setIsLoading(true);

    try {
      const result = await onRegister!(
        formData.name,
        formData.email,
        formData.password,
        formData.img,
        userType,
        formData.farmName || ""
      );
      if (result) {
        console.log("login result: inside if", result);
        if (result.status == 200) {
          setOtpSent(true);
          setStep(2);

          Toast.show({
            type: "success",
            text1: `Verification code sent`,
            position: "top",
          });
        }

        if (result.error == true) {
          Toast.show({
            type: "error",
            // text1: "Error",
            text1: result.message,
            position: "bottom",
          });
        }
      }
    } catch (error) {
      console.log("@# login err:", error);
    } finally {
      setIsLoading(false);
    }

    // Simulate OTP sending
    // setTimeout(() => {
    //   setIsLoading(false);
    //   setOtpSent(true);
    //   setStep(2);
    //   // In a real app, this would make an API call to send OTP
    //   Alert.alert(
    //     "Verification Code Sent",
    //     `We've sent a verification code to ${formData.email}`
    //   );
    // }, 1500);
  };

  const verifyOtpAndSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await onVerifyOTP!(formData.email, parseInt(formData.otp));

      if (result) {
        if (result.status == 200) {
          router.replace("/user/home");
        }
        if (result.error == true) {
          Toast.show({
            type: "error",
            // text1: "Error",
            text1: result.message,
            position: "bottom",
          });
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert(
        "Registration Failed",
        error.message || "Could not create your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const resendOtp = () => {
    setIsLoading(true);
    // Simulate OTP resending
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Verification Code Resent",
        `We've sent a new verification code to ${formData.email}`
      );
    }, 1500);
  };

  // Render different form steps
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {userType === "farmer"
                ? "Join as a Farmer"
                : "Create Buyer Account"}
            </Text>
            <Text className="text-base text-gray-500 mb-8">
              {userType === "farmer"
                ? "Start selling your farm products directly to customers"
                : "Connect with local farmers and access fresh produce"}
            </Text>

            {/* Profile Image */}
            <View className="items-center mb-6">
              <TouchableOpacity
                onPress={selectProfileImage}
                className="relative"
                activeOpacity={0.8}
              >
                {formData.img ? (
                  <Image
                    source={{ uri: formData.img }}
                    className="w-28 h-28 rounded-full"
                  />
                ) : (
                  <View
                    className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center overflow-hidden"
                    style={{
                      borderWidth: 2,
                      borderColor: colors.primary,
                      borderStyle: "dashed",
                    }}
                  >
                    <Ionicons name="person" size={40} color={colors.primary} />
                  </View>
                )}
                <View
                  className="absolute bottom-0 right-0 rounded-full p-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>
              <Text className="text-sm text-gray-500 mt-2">
                Add profile picture
              </Text>
            </View>

            {/* Name Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <View
                className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: errors.name ? "#FF4D4F" : "#E5E7EB",
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.primary}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Your full name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.name}
                  onChangeText={(text) => updateFormData("name", text)}
                />
              </View>
              {errors.name && (
                <Text className="text-xs text-red-500 mt-1">{errors.name}</Text>
              )}
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <View
                className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: errors.email ? "#FF4D4F" : "#E5E7EB",
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.primary}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Your email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => updateFormData("email", text)}
                />
              </View>
              {errors.email && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <View
                className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: errors.password ? "#FF4D4F" : "#E5E7EB",
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.primary}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </Text>
              <View
                className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: errors.confirmPassword ? "#FF4D4F" : "#E5E7EB",
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.primary}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    updateFormData("confirmPassword", text)
                  }
                />
              </View>
              {errors.confirmPassword && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Address Field */}
            {/* <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Address
              </Text>
              <View
                className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: errors.address ? "#FF4D4F" : "#E5E7EB",
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.primary}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Your address"
                  placeholderTextColor="#9CA3AF"
                  value={formData.address}
                  onChangeText={(text) => updateFormData("address", text)}
                />
              </View>
              {errors.address && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.address}
                </Text>
              )}
            </View> */}

            {/* City Field */}
            {/* <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                City
              </Text>
              <View
                className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: errors.city ? "#FF4D4F" : "#E5E7EB",
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={colors.primary}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Your city"
                  placeholderTextColor="#9CA3AF"
                  value={formData.city}
                  onChangeText={(text) => updateFormData("city", text)}
                />
              </View>
              {errors.city && (
                <Text className="text-xs text-red-500 mt-1">{errors.city}</Text>
              )}
            </View> */}

            {/* Farmer-specific fields */}
            {userType === "farmer" && (
              <>
                {/* Farm Name Field */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Farm Name
                  </Text>
                  <View
                    className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                    style={{
                      borderWidth: 1,
                      borderColor: errors.farmName ? "#FF4D4F" : "#E5E7EB",
                    }}
                  >
                    <FontAwesome5
                      name="tractor"
                      size={18}
                      color={colors.primary}
                    />
                    <TextInput
                      className="flex-1 ml-3 text-base text-gray-800"
                      placeholder="Your farm name"
                      placeholderTextColor="#9CA3AF"
                      value={formData.farmName}
                      onChangeText={(text) => updateFormData("farmName", text)}
                    />
                  </View>
                  {errors.farmName && (
                    <Text className="text-xs text-red-500 mt-1">
                      {errors.farmName}
                    </Text>
                  )}
                </View>

                {/* Farm Location Field */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Farm Location
                  </Text>
                  <View
                    className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                    style={{
                      borderWidth: 1,
                      borderColor: errors.farmLocation ? "#FF4D4F" : "#E5E7EB",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <TextInput
                      className="flex-1 ml-3 text-base text-gray-800"
                      placeholder="Farm address"
                      placeholderTextColor="#9CA3AF"
                      value={formData.farmLocation}
                      onChangeText={(text) =>
                        updateFormData("farmLocation", text)
                      }
                    />
                  </View>
                  {errors.farmLocation && (
                    <Text className="text-xs text-red-500 mt-1">
                      {errors.farmLocation}
                    </Text>
                  )}
                </View>

                {/* Bio Field */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Bio{" "}
                    <Text className="text-xs text-gray-500">(optional)</Text>
                  </Text>
                  <View
                    className="px-4 py-3 bg-gray-50 rounded-xl"
                    style={{ borderWidth: 1, borderColor: "#E5E7EB" }}
                  >
                    <TextInput
                      className="text-base text-gray-800"
                      placeholder="Tell customers about your farm..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      value={formData.bio}
                      onChangeText={(text) => updateFormData("bio", text)}
                    />
                  </View>
                </View>

                {/* Product Categories */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Product Categories
                  </Text>
                  <Text className="text-xs text-gray-500 mb-3">
                    Select what you plan to sell
                  </Text>

                  <View
                    className="flex-row flex-wrap"
                    style={{
                      borderWidth: errors.productCategories ? 1 : 0,
                      borderColor: "#FF4D4F",
                      borderRadius: 8,
                      padding: errors.productCategories ? 8 : 0,
                    }}
                  >
                    {availableCategories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => toggleCategory(category)}
                        className="mr-2 mb-2 px-3 py-2 rounded-full"
                        style={{
                          backgroundColor: formData.productCategories.includes(
                            category
                          )
                            ? colors.primary
                            : colors.light,
                        }}
                      >
                        <Text
                          className="text-sm"
                          style={{
                            color: formData.productCategories.includes(category)
                              ? "white"
                              : colors.primary,
                          }}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.productCategories && (
                    <Text className="text-xs text-red-500 mt-1">
                      {errors.productCategories}
                    </Text>
                  )}
                </View>
              </>
            )}
          </>
        );

      case 2:
        return (
          <>
            <View className="items-center mb-6">
              <MaterialCommunityIcons
                name="email-check-outline"
                size={80}
                color={colors.primary}
              />
              <Text className="text-2xl font-bold text-gray-800 mt-4 mb-2">
                Verify Your Email
              </Text>
              <Text className="text-base text-gray-500 mb-2 text-center">
                We've sent a verification code to
              </Text>
              <Text className="text-base font-medium mb-6">
                {formData.email}
              </Text>
            </View>

            {/* OTP Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Enter Verification Code
              </Text>
              <View
                className="flex-row items-center px-4 py-3 bg-gray-50 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: errors.otp ? "#FF4D4F" : "#E5E7EB",
                }}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.primary}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800 tracking-widest"
                  placeholder="6-digit code"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={formData.otp}
                  onChangeText={(text) => updateFormData("otp", text)}
                />
              </View>
              {errors.otp && (
                <Text className="text-xs text-red-500 mt-1">{errors.otp}</Text>
              )}
            </View>

            {/* Resend Code option */}
            <TouchableOpacity
              className="mb-6 items-center"
              onPress={resendOtp}
              disabled={isLoading}
            >
              <Text className="text-base" style={{ color: colors.primary }}>
                Resend Verification Code
              </Text>
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-8 rounded-b-3xl overflow-hidden relative"
      >
        <SafeAreaView>
          <View className="flex-row justify-between items-center px-6">
            <TouchableOpacity className="p-1" onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/auth/login")}>
              <Text className="text-white font-medium text-base">Login</Text>
            </TouchableOpacity>
          </View>

          <View className="items-center mt-10 mb-5">
            <Text className="text-white font-bold text-3xl">AgriConnect</Text>
            {/* Progress indicator */}
            <View className="flex-row mt-4 mb-2">
              {[1, 2].map((i) => (
                <View
                  key={i}
                  className="mx-1 h-1 rounded-full"
                  style={{
                    width: i === step ? 24 : 12,
                    backgroundColor:
                      i === step ? "white" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>

        {/* Wave effect at bottom */}
        <View className="absolute bottom-0 left-0 w-full h-3 items-center">
          <View className="bg-white/30 h-full w-4/5 rounded-t-full"></View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1">{renderFormStep()}</View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Footer with Next/Submit Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pt-2 pb-6 px-6 shadow-xl">
        <TouchableOpacity
          className={`py-4 rounded-xl items-center justify-center ${
            imageLoading ? "opacity-50" : ""
          }`}
          style={{ backgroundColor: colors.primary }}
          onPress={handleNext}
          disabled={isLoading || imageLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {step === 1 ? "Send Verification Code" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>

        <View className="mt-4">
          <Text className="text-xs text-gray-500 text-center">
            By signing up, you agree to our{" "}
            <Text style={{ color: colors.primary }} className="font-medium">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ color: colors.primary }} className="font-medium">
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
