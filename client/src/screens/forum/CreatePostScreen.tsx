import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const CreatePostScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");

  const [selectedTag, setSelectedTag] = useState<
    "general" | "farmers" | "buyers"
  >("general");
  const [contentFocused, setContentFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleTagSelect = (tag: "general" | "farmers" | "buyers") => {
    setSelectedTag(tag);
  };

  async function addPhoto() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
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
          setImg(res.secure_url);
          setImageLoading(false);
          Toast.show({
            type: "success",
            text1: "Image Uploaded",
            text2: "Image successfully added to your post",
            position: "top",
          });
        })
        .catch((err) => {
          console.log(err);
          setImageLoading(false);
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2: "Could not upload image",
            position: "top",
          });
        });
    }
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill out all fields",
        position: "top",
      });

      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/post/create-post`,
        {
          title,
          content,
          category: selectedTag,
          img,
        }
      );

      console.log("post submitted data:", res);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post submitted successfully",
        position: "top",
      });

      setTimeout(() => {
        router.back();
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      console.log("post submit error:", error.response.data);
      Toast.show({
        type: "error",
        text1: error.response.data.message,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header with Back Button */}
      <View className="bg-white pt-2 pb-4 px-6 border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-gray-50"
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Create Post</Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Main Content */}
          <View className="px-6 pt-6 pb-4">
            {/* Title Section */}
            <View className="mb-10">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                Share with the Community
              </Text>
              <Text className="text-base text-gray-500">
                Connect farmers and buyers across the country
              </Text>
            </View>

            {/* Title input */}
            <View className="mb-6s">
              <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
                TITLE
              </Text>
              <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <TextInput
                  className="px-4 py-3 text-base text-gray-800"
                  placeholder="What's your question about?"
                  multiline={true}
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="#9CA3AF"
                  maxLength={100}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-2 text-right">
                {title.length}/100
              </Text>
            </View>
          </View>

          {/* Tags Section with improved design */}
          <View className="mb-11 mx-6">
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              TAGS
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`flex-row items-center py-2 px-4 rounded-xl ${
                  selectedTag === "farmers"
                    ? "bg-green-100 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
                onPress={() => handleTagSelect("farmers")}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="agriculture"
                  size={18}
                  color={selectedTag === "farmers" ? "#059669" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    selectedTag === "farmers"
                      ? "text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  For Farmers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center py-2 px-4 rounded-xl ${
                  selectedTag === "buyers"
                    ? "bg-blue-100 border border-blue-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
                onPress={() => handleTagSelect("buyers")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="basket-outline"
                  size={18}
                  color={selectedTag === "buyers" ? "#2563EB" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    selectedTag === "buyers" ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  For Buyers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center py-2 px-4 rounded-xl ${
                  selectedTag === "general"
                    ? "bg-purple-100 border border-purple-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
                onPress={() => handleTagSelect("general")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="people-outline"
                  size={18}
                  color={selectedTag === "general" ? "#7C3AED" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    selectedTag === "general"
                      ? "text-purple-700"
                      : "text-gray-600"
                  }`}
                >
                  General
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Details input - enhanced text area */}
          <View className="mx-6 mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              DETAILS
            </Text>
            <View
              className={`bg-gray-50 border rounded-xl overflow-hidden ${
                contentFocused ? "border-black" : "border-gray-200"
              }`}
            >
              <TextInput
                className="p-4 text-base text-gray-800 h-32"
                placeholder="Share more details about your question or offer..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                onFocus={() => setContentFocused(true)}
                onBlur={() => setContentFocused(false)}
                maxLength={1000}
              />
            </View>
            <Text className="text-xs text-gray-500 mt-2 text-right">
              {content.length}/1000
            </Text>
          </View>

          {/* Attachment option for more interactivity */}
          <View className="mx-6 mb-6">
            <TouchableOpacity
              className="flex-row items-center p-4 bg-gray-50 border border-gray-200 rounded-xl"
              activeOpacity={0.7}
              onPress={addPhoto}
            >
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                {imageLoading ? (
                  <ActivityIndicator size="small" color="#4B5563" />
                ) : (
                  <Feather name="image" size={20} color="#4B5563" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">
                  {img ? "Image Uploaded" : "Add Photos"}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {img
                    ? "Image added to your post"
                    : "Share images related to your post"}
                </Text>
              </View>
              {img ? (
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              ) : (
                <Feather name="chevron-right" size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Additional interactive elements */}
          <View className="mx-6 mb-6">
            <TouchableOpacity
              className="flex-row items-center p-4 bg-gray-50 border border-gray-200 rounded-xl"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                <Feather name="map-pin" size={20} color="#4B5563" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Add Location</Text>
                <Text className="text-gray-500 text-sm">
                  Help others find your farm or market
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Enhanced Floating Submit Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`bg-black py-4 rounded-xl items-center flex-row justify-center ${
            imageLoading ? "opacity-50" : ""
          }`}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={loading || imageLoading}
        >
          {!loading ? (
            <View className="flex-row">
              <Ionicons name="send" size={17} color="white" />
              <Text className="text-white font-semibold ml-3">
                Post to Community
              </Text>
            </View>
          ) : (
            <ActivityIndicator size={19} color={"white"} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePostScreen;
