import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Modal,
  FlatList,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  SimpleLineIcons,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const { width } = Dimensions.get("window");

const UNITS = [
  "Kilogram (kg)",
  "Gram (g)",
  "Liter (L)",
  "Milliliter (ml)",
  "Piece (pc)",
  "Dozen",
  "Box",
  "Bag",
  "Bundle",
  "Meter (m)",
];

const CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Grains",
  "Spices",
  "Dairy",
  "Meat",
  "Fish",
  "Poultry",
  "Honey",
  "Other",
];

const ProductListingPage = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("details");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    unit: "",
    category: "",
    stock: "",
    location: {
      country: "",
      state: "",
      city: "",
    },
  });
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter product name");
      return false;
    }
    if (!formData.desc.trim()) {
      Alert.alert("Error", "Please enter product description");
      return false;
    }
    if (!formData.price.trim()) {
      Alert.alert("Error", "Please enter product price");
      return false;
    }
    if (!formData.unit.trim()) {
      Alert.alert("Error", "Please select unit");
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert("Error", "Please select category");
      return false;
    }
    if (!formData.stock.trim()) {
      Alert.alert("Error", "Please enter stock quantity");
      return false;
    }
    if (!formData.location.country.trim()) {
      Alert.alert("Error", "Please enter country");
      return false;
    }
    if (!formData.location.state.trim()) {
      Alert.alert("Error", "Please enter state");
      return false;
    }
    if (!formData.location.city.trim()) {
      Alert.alert("Error", "Please enter city");
      return false;
    }
    if (images.length === 0) {
      Alert.alert("Error", "Please add at least one product image");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Upload images to Cloudinary
      const uploadedImageUrls = await Promise.all(
        images.map(async (imageUri) => {
          try {
            // Convert image to base64
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
              reader.onloadend = async () => {
                const base64Img = reader.result as string;

                // Upload to Cloudinary
                const data = new FormData();
                data.append("file", base64Img);
                data.append(
                  "upload_preset",
                  process.env.EXPO_PUBLIC_PRESET_NAME!
                );
                data.append("cloud_name", process.env.EXPO_PUBLIC_CLOUD_NAME!);

                try {
                  const uploadResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`,
                    {
                      method: "post",
                      body: data,
                    }
                  );

                  const uploadResult = await uploadResponse.json();
                  resolve(uploadResult.secure_url);
                } catch (error) {
                  reject(error);
                }
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
          }
        })
      );

      // Create product in backend
      const productData = {
        name: formData.name,
        desc: formData.desc,
        price: parseFloat(formData.price),
        images: uploadedImageUrls,
        category: formData.category,
        stock: parseInt(formData.stock),
        location: formData.location,
        unit: formData.unit,
      };

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/product/create`,
        productData
      );

      if (response.status === 200) {
        const initialFormData = {
          name: "",
          desc: "",
          price: "",
          unit: "",
          category: "",
          stock: "",
          location: {
            country: "",
            state: "",
            city: "",
          },
        };
        setFormData(initialFormData);

        Alert.alert("Success", "Product listed successfully!", [
          { text: "OK", onPress: () => router.replace("/user/home") },
        ]);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (activeSection === "details") {
      setActiveSection("images");
    } else if (activeSection === "images") {
      setActiveSection("location");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const renderUnitDropdown = () => (
    <Modal
      visible={showUnitDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowUnitDropdown(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={() => setShowUnitDropdown(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#2C3E50" }}
            >
              Select Unit
            </Text>
            <TouchableOpacity onPress={() => setShowUnitDropdown(false)}>
              <Ionicons name="close" size={24} color="#4A5568" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={UNITS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E2E8F0",
                }}
                onPress={() => {
                  setFormData({ ...formData, unit: item });
                  setShowUnitDropdown(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: formData.unit === item ? "#292929" : "#4A5568",
                    fontWeight: formData.unit === item ? "600" : "400",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderCategoryDropdown = () => (
    <Modal
      visible={showCategoryDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCategoryDropdown(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={() => setShowCategoryDropdown(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#2C3E50" }}
            >
              Select Category
            </Text>
            <TouchableOpacity onPress={() => setShowCategoryDropdown(false)}>
              <Ionicons name="close" size={24} color="#4A5568" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E2E8F0",
                }}
                onPress={() => {
                  setFormData({ ...formData, category: item });
                  setShowCategoryDropdown(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: formData.category === item ? "#292929" : "#4A5568",
                    fontWeight: formData.category === item ? "600" : "400",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderDetails = () => (
    <View>
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          Product Name
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
          placeholder="Enter product name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          Description
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            height: 120,
            textAlignVertical: "top",
          }}
          placeholder="Enter product description"
          multiline
          value={formData.desc}
          onChangeText={(text) => setFormData({ ...formData, desc: text })}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          Price
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 20, color: "#4A5568", marginRight: 8 }}>
            ₹
          </Text>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
            placeholder="Enter price"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          Unit
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
          onPress={() => setShowUnitDropdown(true)}
        >
          <Text
            style={{
              fontSize: 16,
              color: formData.unit ? "#2C3E50" : "#A0AEC0",
            }}
          >
            {formData.unit || "Select unit"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          Category
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
          onPress={() => setShowCategoryDropdown(true)}
        >
          <Text
            style={{
              fontSize: 16,
              color: formData.category ? "#2C3E50" : "#A0AEC0",
            }}
          >
            {formData.category || "Select category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          Stock
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
          placeholder="Enter stock quantity"
          keyboardType="numeric"
          value={formData.stock}
          onChangeText={(text) => setFormData({ ...formData, stock: text })}
        />
      </View>
    </View>
  );

  const renderImages = () => (
    <View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {images.map((uri, index) => (
          <View key={index} style={{ position: "relative" }}>
            <Image
              source={{ uri }}
              style={{
                width: (width - 64) / 3,
                height: (width - 64) / 3,
                borderRadius: 12,
              }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                backgroundColor: "#E53E3E",
                borderRadius: 12,
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        {images.length < 9 && (
          <TouchableOpacity
            style={{
              width: (width - 64) / 3,
              height: (width - 64) / 3,
              borderRadius: 12,
              backgroundColor: "#E6EAF3",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={pickImage}
          >
            <Ionicons name="add" size={32} color="#4A5568" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderLocation = () => (
    <View>
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          Country
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
          placeholder="Enter country"
          value={formData.location.country}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              location: { ...formData.location, country: text },
            })
          }
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          State
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
          placeholder="Enter state"
          value={formData.location.state}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              location: { ...formData.location, state: text },
            })
          }
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2C3E50",
            marginBottom: 8,
          }}
        >
          City
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
          placeholder="Enter city"
          value={formData.location.city}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              location: { ...formData.location, city: text },
            })
          }
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F7F9FC" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      {/* Custom Header */}
      <View
        style={{
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          paddingTop: 24,
          paddingBottom: 16,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#E6EAF3",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#4A5568" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#2C3E50" }}>
            New Product
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={{ padding: 20, paddingTop: 24 }}>
          {/* Progress Steps */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveSection("details")}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                  backgroundColor:
                    activeSection === "details" ? "#292929" : "#E6EAF3",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Feather
                  name="file-text"
                  size={20}
                  color={activeSection === "details" ? "white" : "#6b7280"}
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeSection === "details" ? "600" : "400",
                  color: activeSection === "details" ? "#292929" : "#6b7280",
                }}
              >
                Details
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "#E6EAF3",
                marginHorizontal: 8,
              }}
            >
              <View
                style={{
                  height: "100%",
                  backgroundColor: "#292929",
                  width:
                    activeSection === "details"
                      ? "0%"
                      : activeSection === "images"
                      ? "50%"
                      : "100%",
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => setActiveSection("images")}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                  backgroundColor:
                    activeSection === "images" || activeSection === "location"
                      ? "#292929"
                      : "#E6EAF3",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Feather
                  name="image"
                  size={20}
                  color={
                    activeSection === "images" || activeSection === "location"
                      ? "white"
                      : "#6b7280"
                  }
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeSection === "images" ? "600" : "400",
                  color: activeSection === "images" ? "#292929" : "#6b7280",
                }}
              >
                Images
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "#E6EAF3",
                marginHorizontal: 8,
              }}
            >
              <View
                style={{
                  height: "100%",
                  backgroundColor: "#292929",
                  width: activeSection === "location" ? "100%" : "0%",
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => setActiveSection("location")}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                  backgroundColor:
                    activeSection === "location" ? "#292929" : "#E6EAF3",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Feather
                  name="map-pin"
                  size={20}
                  color={activeSection === "location" ? "white" : "#6b7280"}
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeSection === "location" ? "600" : "400",
                  color: activeSection === "location" ? "#292929" : "#6b7280",
                }}
              >
                Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section Title */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#2C3E50",
                marginBottom: 8,
              }}
            >
              {activeSection === "details"
                ? "Product Details"
                : activeSection === "images"
                ? "Product Images"
                : "Farm Location"}
            </Text>
            <Text style={{ fontSize: 14, color: "#718096" }}>
              {activeSection === "details"
                ? "Enter comprehensive information about your product"
                : activeSection === "images"
                ? "Showcase your product with high-quality visuals"
                : "Provide the precise location of your farm"}
            </Text>
          </View>

          {/* Content Sections */}
          {activeSection === "details" && renderDetails()}
          {activeSection === "images" && renderImages()}
          {activeSection === "location" && renderLocation()}

          {/* Navigation Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 32,
            }}
          >
            {activeSection !== "details" ? (
              <TouchableOpacity
                onPress={() => {
                  if (activeSection === "images") setActiveSection("details");
                  if (activeSection === "location") setActiveSection("images");
                }}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  backgroundColor: "#E6EAF3",
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontWeight: "600", color: "#4A5568" }}>
                  Previous
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            {activeSection !== "location" ? (
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  backgroundColor: "#292929",
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontWeight: "600", color: "white" }}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={{
                  paddingHorizontal: 40,
                  paddingVertical: 12,
                  backgroundColor: loading ? "#A0AEC0" : "#48BB78",
                  borderRadius: 12,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    List Product
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {renderUnitDropdown()}
      {renderCategoryDropdown()}
    </KeyboardAvoidingView>
  );
};

export default ProductListingPage;
