import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import axios from "axios";
import { PostInterface } from "@/src/types";
import timeAgo from "@/src/utils/timesAgo";

// Mock data for forum posts
const mockPosts = [
  {
    id: 1,
    title: "Best practices for organic tomato growing?",
    description:
      "I'm looking to improve my tomato yield this season. Has anyone tried companion planting with basil?",
    author: "Maria Garcia",
    authorAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
    category: "farmers",
    comments: 24,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    title: "Bulk purchase of seasonal vegetables",
    description:
      "Restaurant owner looking to connect with farmers for weekly deliveries of seasonal produce.",
    author: "James Wilson",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "buyers",
    comments: 18,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    title: "Sustainable packaging solutions",
    description:
      "What eco-friendly packaging are you using for your farm produce? Looking for biodegradable options.",
    author: "Emily Chen",
    authorAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    category: "farmers",
    comments: 31,
    timestamp: "Yesterday",
  },
  {
    id: 4,
    title: "Looking for heritage apple varieties",
    description:
      "Local bakery searching for farmers growing heritage apple varieties for our seasonal pies.",
    author: "David Kim",
    authorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    category: "buyers",
    comments: 12,
    timestamp: "2 days ago",
  },
  {
    id: 5,
    title: "Irrigation systems for small farms",
    description:
      "What irrigation systems are working best for small-scale vegetable farms in drought-prone areas?",
    author: "Thomas Jackson",
    authorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    category: "farmers",
    comments: 42,
    timestamp: "3 days ago",
  },
];

// ForumHeader component
const ForumHeader = () => {
  const router = useRouter();
  return (
    <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
      <View className="flex-row items-center">
        <TouchableOpacity
          className="p-2"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 ml-2">
          <Text className="text-2xl font-bold text-slate-800">
            Community Forum
          </Text>
          <Text className="text-slate-500 text-sm">
            Connect & share with other farmers
          </Text>
        </View>
        <TouchableOpacity className="p-2" activeOpacity={0.7}>
          <Ionicons name="search-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// PostCard component
const PostCard = ({ post }: { post: PostInterface }) => {
  const isFarmer = post.category == "farmers";
  const isBuyer = post.category == "buyers";
  const router = useRouter();

  return (
    <TouchableOpacity
      className="mb-4 bg-white rounded-xl p-4 shadow-sm mx-4"
      activeOpacity={0.7}
      onPress={() =>
        router.push(
          `/user/forum/forumPost?postData=${encodeURIComponent(
            JSON.stringify(post)
          )}`
        )
      }
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text className="text-lg font-bold text-slate-800">{post.title}</Text>
          <Text numberOfLines={2} className="text-slate-500 mt-1 mb-3 text-sm">
            {post.content}
          </Text>
        </View>
        <View
          className={`rounded-full py-1 px-3 ${
            isFarmer
              ? "bg-emerald-100"
              : isBuyer
              ? "bg-amber-100"
              : "bg-blue-100"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              isFarmer
                ? "text-emerald-700"
                : isBuyer
                ? "text-amber-700"
                : "text-blue-700"
            }`}
          >
            {isFarmer ? "Farmers" : isBuyer ? "Buyers" : "General"}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <View className="flex-row items-center">
          {/* <Image
            source={{ uri: post.author.img }}
            className="h-6 w-6 rounded-full"
          /> */}

          {post.author.img && post.author.img.trim() !== "" ? (
            <Image
              source={{ uri: post.author.img }}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <View className="h-6 w-6 rounded-full bg-green-100 items-center justify-center">
              <Text className="text-[#28a745] text-center">
                {post.author.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <Text className="text-slate-600 text-xs ml-2">
            {post.author.name}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="flex-row items-center mr-3">
            <MaterialIcons
              name="chat-bubble-outline"
              size={14}
              color="#94a3b8"
            />
            <Text className="ml-1 text-slate-500 text-xs">
              {post.commentCount}
            </Text>
          </View>
          <Text className="text-slate-400 text-xs">
            {timeAgo(post.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// FilterTabs component
const FilterTabs = ({ activeTab, setActiveTab }) => {
  return (
    <View className="flex-row bg-white px-4 pt-4 pb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${
            activeTab === "all" ? "bg-blue-500" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("all")}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "all" ? "text-white" : "text-slate-600"
            }`}
          >
            All Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${
            activeTab === "farmers" ? "bg-emerald-500" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("farmers")}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "farmers" ? "text-white" : "text-slate-600"
            }`}
          >
            For Farmers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${
            activeTab === "buyers" ? "bg-amber-500" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("buyers")}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "buyers" ? "text-white" : "text-slate-600"
            }`}
          >
            For Buyers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${
            activeTab === "trending" ? "bg-purple-500" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("trending")}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "trending" ? "text-white" : "text-slate-600"
            }`}
          >
            Trending
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// SortDropdown component
const SortDropdown = ({ sortOption, setSortOption, isOpen, setIsOpen }) => {
  return (
    <View className="relative px-4 pt-2 pb-4 bg-white border-b border-gray-100">
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-50 rounded-lg py-2 px-3"
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <MaterialIcons name="sort" size={18} color="#64748b" />
          <Text className="ml-2 text-slate-600 text-sm">
            Sort by: {sortOption}
          </Text>
        </View>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color="#64748b"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute top-14 left-4 right-4 bg-white rounded-lg shadow-md border border-gray-100 z-10">
          <TouchableOpacity
            className="py-3 px-4 border-b border-gray-100 flex-row items-center"
            onPress={() => {
              setSortOption("Latest");
              setIsOpen(false);
            }}
          >
            <MaterialIcons name="access-time" size={16} color="#64748b" />
            <Text className="text-slate-700 ml-2">Latest</Text>
            {sortOption === "Latest" && (
              <MaterialIcons
                name="check"
                size={16}
                color="#3b82f6"
                style={{ marginLeft: "auto" }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-4 border-b border-gray-100 flex-row items-center"
            onPress={() => {
              setSortOption("Popular");
              setIsOpen(false);
            }}
          >
            <MaterialIcons name="trending-up" size={16} color="#64748b" />
            <Text className="text-slate-700 ml-2">Most Popular</Text>
            {sortOption === "Popular" && (
              <MaterialIcons
                name="check"
                size={16}
                color="#3b82f6"
                style={{ marginLeft: "auto" }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-4 flex-row items-center"
            onPress={() => {
              setSortOption("Comments");
              setIsOpen(false);
            }}
          >
            <MaterialIcons name="chat" size={16} color="#64748b" />
            <Text className="text-slate-700 ml-2">Most Comments</Text>
            {sortOption === "Comments" && (
              <MaterialIcons
                name="check"
                size={16}
                color="#3b82f6"
                style={{ marginLeft: "auto" }}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// EmptyState component for when no posts match filter
const EmptyState = ({ router }: any) => {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <MaterialCommunityIcons name="forum-outline" size={64} color="#cbd5e1" />
      <Text className="text-slate-600 text-lg font-medium mt-4">
        No posts found
      </Text>
      <Text className="text-slate-500 text-center mt-2">
        There are no posts matching your current filter. Try adjusting your
        filters or be the first to post!
      </Text>
      <TouchableOpacity
        className="mt-6 bg-blue-500 rounded-full py-3 px-6"
        activeOpacity={0.7}
        onPress={() => router.push("/user/forum/createPost")}
      >
        <Text className="text-white font-semibold">Create New Post</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main Forum Component
const ForumScreen = () => {
  const router = useRouter();

  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostInterface[]>([]);

  const [activeTab, setActiveTab] = useState<
    "all" | "farmers" | "buyers" | "trending"
  >("all");
  const [sortOption, setSortOption] = useState("Latest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter posts based on selected category
  useEffect(() => {
    const _filteredPosts =
      activeTab == "all"
        ? posts
        : activeTab == "trending"
        ? [...posts].sort((a, b) => b.commentCount - a.commentCount).slice(0, 3)
        : posts.filter(
            (post) => post.category.toLowerCase() == activeTab.toLowerCase()
          );

    setFilteredPosts(_filteredPosts);

    console.log("filtered posts", _filteredPosts);
  }, [activeTab, posts]);

  useFocusEffect(
    useCallback(() => {
      console.log("in use effect of post screen");

      async function fetchPost() {
        try {
          const result = await axios.get(
            `${process.env.EXPO_PUBLIC_SERVER_URL}/api/post/get-post`
          );

          if (result) {
            console.log("result in post screen", result.data);
            setPosts(result.data.posts);
          }
        } catch (error) {
          console.log("error in post screen", error);
        }
      }

      fetchPost();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ForumHeader />
      <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <SortDropdown
        sortOption={sortOption}
        setSortOption={setSortOption}
        isOpen={isDropdownOpen}
        setIsOpen={setIsDropdownOpen}
      />

      {filteredPosts.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 pt-4"
        >
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          <View className="h-20" />
        </ScrollView>
      ) : (
        <EmptyState router={router} />
      )}

      {/* new post btn */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 rounded-full h-14 w-14 items-center justify-center shadow-lg z-20"
        activeOpacity={0.8}
        onPress={() => router.push("/user/forum/createPost")}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export default ForumScreen;
