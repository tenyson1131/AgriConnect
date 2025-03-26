import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CommentInterface, PostInterface } from "@/src/types";
import timeAgo from "@/src/utils/timesAgo";
import { UserContext } from "@/context/UserContext";
import axios from "axios";

// Mock comments data
const mockComments = [
  {
    id: 1,
    author: "Alex Johnson",
    authorAvatar: "https://randomuser.me/api/portraits/men/11.jpg",
    content:
      "I've had great success with companion planting! Basil not only improves tomato flavor but also helps repel certain pests. I plant them about 12 inches apart.",
    timestamp: "1 hour ago",
    likes: 14,
    replies: [
      {
        id: 101,
        author: "Sophia Martinez",
        authorAvatar: "https://randomuser.me/api/portraits/women/23.jpg",
        content:
          "What other herbs do you recommend planting with tomatoes? I've heard about marigolds too.",
        timestamp: "45 mins ago",
        likes: 3,
      },
      {
        id: 102,
        author: "Maria Garcia",
        authorAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
        content:
          "Thank you for sharing! I'll definitely try this with my tomatoes this season.",
        timestamp: "20 mins ago",
        likes: 2,
      },
    ],
  },
  {
    id: 2,
    author: "Linda Thompson",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "Has anyone experienced issues with blossom end rot when companion planting? I'm trying to determine if my watering schedule needs adjustment.",
    timestamp: "3 hours ago",
    likes: 7,
    replies: [],
  },
  {
    id: 3,
    author: "Michael Chen",
    authorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    content:
      "I've found that adding crushed eggshells to the soil before planting helps provide calcium and prevents blossom end rot. Also helps with soil drainage.",
    timestamp: "5 hours ago",
    likes: 21,
    replies: [
      {
        id: 301,
        author: "David Kim",
        authorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
        content: "Great tip! How finely do you crush the eggshells?",
        timestamp: "4 hours ago",
        likes: 3,
      },
    ],
  },
];

// Comment component
const Comment = ({
  comment,
  isReply = false,
  fetchComment,
}: {
  comment: CommentInterface;
  isReply: boolean;
  fetchComment: () => void;
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [liked, setLiked] = useState(false);

  const [newReply, setNewReply] = useState("");
  const [disableReply, setDisableReply] = useState(false);

  async function addReply() {
    setDisableReply(true);
    try {
      const result = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/comment/add-reply`,
        {
          commentId: comment._id,
          content: newReply,
        }
      );

      setNewReply("");
      setShowReplyInput(false);
      setShowReplies(true);

      fetchComment();
      // if (result) {
      //   console.log("result in post screen", result.data);
      // }
    } catch (error) {
      console.log("error while adding reply", error);
    } finally {
      setDisableReply(false);
    }
  }

  return (
    <View
      style={{
        marginBottom: 16,
        marginLeft: isReply ? 48 : 0,
        marginTop: isReply ? 12 : 0,
        paddingBottom: !isReply ? 16 : 0,
        borderBottomWidth: !isReply ? 1 : 0,
        borderBottomColor: "#F1F5F9",
        backgroundColor: isReply ? "#F8FAFC" : "white",
        borderRadius: isReply ? 12 : 0,
        padding: isReply ? 12 : 0,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ marginRight: 12 }}>
          <Image
            source={{ uri: comment.author.img }}
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "#E5DEFF",
            }}
          />
          {!isReply && (
            <View
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                backgroundColor: "#9b87f5",
                borderRadius: 10,
                width: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="check" size={14} color="white" />
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", color: "#1E293B" }}>
                {comment.author.name}
              </Text>
              <View
                style={{
                  backgroundColor: "#F1F5F9",
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 8,
                }}
              >
                <Text style={{ fontSize: 10, color: "#64748B" }}>
                  {timeAgo(comment.createdAt)}
                </Text>
              </View>
            </View>
            {!isReply && (
              <TouchableOpacity style={{ padding: 4 }}>
                <Feather name="more-horizontal" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={{ color: "#334155", marginTop: 4, lineHeight: 20 }}>
            {comment.content}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                backgroundColor: liked ? "#F0F9FF" : "transparent",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
              activeOpacity={0.7}
              onPress={() => setLiked(!liked)}
            >
              <AntDesign
                name={liked ? "like1" : "like2"}
                size={14}
                color={liked ? "#3B82F6" : "#64748B"}
              />
              <Text
                style={{
                  marginLeft: 4,
                  color: liked ? "#3B82F6" : "#64748B",
                  fontSize: 12,
                }}
              >
                {liked ? comment.likes.length + 1 : comment.likes}
              </Text>
            </TouchableOpacity>

            {!isReply && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 20,
                  backgroundColor: showReplyInput ? "#F0F9FF" : "transparent",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
                activeOpacity={0.7}
                onPress={() => setShowReplyInput(!showReplyInput)}
              >
                <MaterialIcons
                  name="reply"
                  size={14}
                  color={showReplyInput ? "#3B82F6" : "#64748B"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: showReplyInput ? "#3B82F6" : "#64748B",
                    fontSize: 12,
                  }}
                >
                  Reply
                </Text>
              </TouchableOpacity>
            )}

            {!isReply && comment.replies && comment.replies.length > 0 && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
                activeOpacity={0.7}
                onPress={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <MaterialIcons
                      name="expand-less"
                      size={14}
                      color="#64748B"
                    />
                    <Text
                      style={{ marginLeft: 4, color: "#64748B", fontSize: 12 }}
                    >
                      Hide Replies
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons
                      name="expand-more"
                      size={14}
                      color="#64748B"
                    />
                    <Text
                      style={{ marginLeft: 4, color: "#64748B", fontSize: 12 }}
                    >
                      Show {comment.replies.length} Replies
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {showReplyInput && (
            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F8FAFC",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  color: "#334155",
                  fontSize: 14,
                  paddingVertical: 4,
                }}
                placeholder="Write a reply..."
                value={newReply}
                onChangeText={(text) => setNewReply(text)}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  backgroundColor: "#9b87f5",
                  padding: 8,
                  borderRadius: 20,
                  shadowColor: "#9b87f5",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                className={`${disableReply ? "opacity-50" : ""}`}
                activeOpacity={0.7}
                onPress={addReply}
                disabled={disableReply}
              >
                {disableReply ? (
                  <ActivityIndicator size={18} color={"white"} />
                ) : (
                  <Ionicons name="send" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          )}

          {!isReply &&
            showReplies &&
            comment.replies &&
            comment.replies.length > 0 && (
              <View style={{ marginTop: 16 }}>
                {comment.replies.map((reply, index) => (
                  <Comment key={index} comment={reply} isReply={true} />
                ))}
              </View>
            )}
        </View>
      </View>
    </View>
  );
};

const ForumPostScreen = () => {
  const router = useRouter();
  const { postData } = useLocalSearchParams<{ postData: string }>();

  const { USER } = useContext(UserContext);

  const [post, setPost] = useState<PostInterface>();

  const [newComment, setNewComment] = useState("");
  const [disableComment, setDisableComment] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  // fetched comments
  const [comments, setComments] = useState<CommentInterface>();

  useEffect(() => {
    setPost(JSON.parse(decodeURIComponent(postData)));
    console.log("postData:", JSON.parse(decodeURIComponent(postData)));
  }, []);

  const fetchComment = async () => {
    setLoadingComment(true);
    try {
      const result = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/comment/get-comment/${post?._id}`
      );

      if (result) {
        console.log("fetched comments: ", result.data);

        setComments(result.data.comments);
      }
    } catch (error) {
      console.log("error while fetching comments", error);
    } finally {
      setLoadingComment(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!post || post.commentCount === 0) return;

      fetchComment();
    }, [post?._id])
  );

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={36} color={"black"} />
      </View>
    );
  }

  async function addComment() {
    setDisableComment(true);
    try {
      const result = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/comment/create-comment`,
        {
          postId: post?._id,
          content: newComment,
        }
      );

      setNewComment("");
      setPost((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );
      fetchComment();
      // if (result) {
      //   console.log("result in post screen", result.data);
      // }
    } catch (error) {
      console.log("error while adding comment", error);
    } finally {
      setDisableComment(false);
    }
  }

  // Find the post from the mock data (in a real app, you would fetch this from an API)
  // const post =
  //   mockPosts.find((p) => p.id === parseInt(postData)) || mockPosts[0];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F1F5F9",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 1,
          elevation: 1,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              padding: 8,
              backgroundColor: "#F8FAFC",
              borderRadius: 8,
            }}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#0F172A",
              marginLeft: 12,
            }}
          >
            Discussion
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={{ padding: 8, marginRight: 8 }}>
            <Feather name="bookmark" size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8 }}>
            <Feather name="search" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Category Badge */}
          <View
            style={{
              alignSelf: "flex-start",
              borderRadius: 9999,
              paddingVertical: 4,
              paddingHorizontal: 12,
              marginBottom: 12,
              backgroundColor:
                post.category === "farmers" ? "#E0F2F1" : "#FFF8E1",
              borderWidth: 1,
              borderColor: post.category === "farmers" ? "#B2DFDB" : "#FFECB3",
            }}
          >
            {post.category === "farmers" ? (
              <Text
                style={{ fontSize: 12, color: "#00897B", fontWeight: "500" }}
              >
                Farmers
              </Text>
            ) : (
              <Text
                style={{ fontSize: 12, color: "#FFB300", fontWeight: "500" }}
              >
                Buyers
              </Text>
            )}
          </View>

          {/* Post Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#0F172A",
              lineHeight: 32,
            }}
          >
            {post.title}
          </Text>

          {/* Author Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
              marginBottom: 24,
              backgroundColor: "#F8FAFC",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Image
              source={{ uri: post.author.img }}
              style={{
                height: 48,
                width: 48,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: "#9b87f5",
              }}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: "bold", color: "#1E293B" }}>
                {post.author.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                {timeAgo(post.createdAt)}
              </Text>
            </View>
            {/* follow btn */}
            <TouchableOpacity
              style={{
                backgroundColor: "#9b87f5",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#9b87f5",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
              }}
            >
              <Feather name="user-plus" size={14} color="white" />
              <Text
                style={{
                  color: "white",
                  marginLeft: 6,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Follow
              </Text>
            </TouchableOpacity>
          </View>

          {/* Post Image (if exists) */}
          {post.img && post.img.trim() != "" && (
            <View className="mb-6 w-full h-40">
              <Image
                source={{ uri: post.img }}
                className="w-full rounded-xl h-full max-h-80"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Post Content - with decorative patterns */}
          <View
            style={{
              marginBottom: 24,
              backgroundColor: "#FAFAFA",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#F1F5F9",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative patterns */}
            <View
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#E5DEFF",
                opacity: 0.3,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#FDE1D3",
                opacity: 0.4,
              }}
            />

            <Text
              style={{
                color: "#334155",
                lineHeight: 24,
                zIndex: 1,
                position: "relative",
              }}
            >
              {post.content}
            </Text>
          </View>

          {/* Post Stats */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              marginBottom: 24,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#F1F5F9",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F0F9FF",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
                activeOpacity={0.7}
              >
                <AntDesign name="like2" size={16} color="#3B82F6" />
                <Text
                  style={{ marginLeft: 6, color: "#3B82F6", fontWeight: "500" }}
                >
                  42 Likes
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 12,
                }}
              >
                <MaterialIcons name="comment" size={16} color="#64748B" />
                <Text style={{ marginLeft: 4, color: "#64748B" }}>
                  {post.commentCount} Comments
                </Text>
              </View>
            </View>

            <TouchableOpacity style={{ padding: 4 }}>
              <Feather name="bookmark" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#0F172A" }}
              >
                Comments ({post.commentCount})
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F1F5F9",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="filter" size={14} color="#64748B" />
                <Text style={{ marginLeft: 4, color: "#64748B", fontSize: 12 }}>
                  Filter
                </Text>
              </TouchableOpacity>
            </View>

            {/* Add Comment Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
                backgroundColor: "#F8FAFC",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "#E5DEFF",
              }}
            >
              <Image
                source={{
                  uri: USER?.img,
                }}
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 18,
                  marginRight: 12,
                }}
              />
              <TextInput
                style={{
                  flex: 1,
                  color: "#334155",
                  paddingVertical: 8,
                  fontSize: 14,
                }}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={(text) => setNewComment(text)}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#9b87f5",
                  padding: 10,
                  borderRadius: 12,
                  shadowColor: "#9b87f5",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 2,
                }}
                className={`${disableComment ? "opacity-50" : ""}`}
                activeOpacity={0.7}
                onPress={addComment}
                disabled={disableComment}
              >
                {disableComment ? (
                  <ActivityIndicator size={18} color={"white"} />
                ) : (
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
                elevation: 1,
                borderWidth: 1,
                borderColor: "#F8FAFC",
              }}
            >
              {/* {comment.map((comment) => (
                <Comment key={comment.} comment={comment} />
              ))} */}

              {post.commentCount !== 0 &&
              !loadingComment &&
              comments &&
              Array.isArray(comments) &&
              comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    fetchComment={fetchComment}
                  />
                ))
              ) : (
                <View className="items-center justify-center py-12">
                  <MaterialIcons
                    name="chat-bubble-outline"
                    size={64}
                    color="#CBD5E1"
                  />
                  <Text className="text-slate-400 mt-4 text-center">
                    {loadingComment
                      ? "Loading comments..."
                      : post.commentCount === 0
                      ? "No comments yet"
                      : "Unable to load comments"}
                  </Text>
                  {post.commentCount === 0 && (
                    <Text className="text-slate-400 text-sm text-center">
                      Be the first to start the discussion!
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Mock data for forum posts (this should match what's in the ForumScreen)
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

export default ForumPostScreen;
