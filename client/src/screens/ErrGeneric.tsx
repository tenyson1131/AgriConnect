import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

interface ErrGenericProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onRetry?: () => void;
}

const ErrGeneric: React.FC<ErrGenericProps> = ({
  title = "Something went wrong",
  message = "We couldn't load the content you requested. Please try again.",
  buttonText = "Try Again",
  onRetry,
}) => {
  // Animation for the bouncing dots
  const bounceDot1 = useRef(new Animated.Value(0)).current;
  const bounceDot2 = useRef(new Animated.Value(0)).current;
  const bounceDot3 = useRef(new Animated.Value(0)).current;

  // Animation for the pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create bouncing animation for dots
    const createBounceAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Create pulsing animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start all animations
    createBounceAnimation(bounceDot1, 0).start();
    createBounceAnimation(bounceDot2, 100).start();
    createBounceAnimation(bounceDot3, 200).start();
    pulseAnimation.start();

    return () => {
      // Clean up animations
      bounceDot1.stopAnimation();
      bounceDot2.stopAnimation();
      bounceDot3.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6 min-h-[400px]">
      <StatusBar backgroundColor="transparent" />
      <View className="w-full max-w-md">
        {/* Visual Error Indicator */}
        <View className="mb-8 items-center">
          <Animated.View
            className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 items-center justify-center mb-2 shadow-md"
            style={{ transform: [{ scale: pulseAnim }] }}
          >
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
              <Text className="text-pink-500 text-4xl font-bold">!</Text>
            </View>
          </Animated.View>

          {/* Animated Dots */}
          <View className="flex-row justify-center -mt-2">
            <Animated.View
              className="w-1.5 h-1.5 rounded-full bg-indigo-300 mx-0.5"
              style={{
                transform: [
                  {
                    translateY: bounceDot1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -5],
                    }),
                  },
                ],
              }}
            />
            <Animated.View
              className="w-1.5 h-1.5 rounded-full bg-purple-400 mx-0.5"
              style={{
                transform: [
                  {
                    translateY: bounceDot2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -5],
                    }),
                  },
                ],
              }}
            />
            <Animated.View
              className="w-1.5 h-1.5 rounded-full bg-pink-300 mx-0.5"
              style={{
                transform: [
                  {
                    translateY: bounceDot3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -5],
                    }),
                  },
                ],
              }}
            />
          </View>
        </View>

        {/* Error Message Content */}
        <Text className="text-indigo-900 text-center text-2xl font-semibold mb-3">
          {title}
        </Text>
        <Text className="text-indigo-700 text-center mb-8 leading-6">
          {message}
        </Text>

        {/* Action Button */}
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-8 rounded-full self-center shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-medium">{buttonText}</Text>
          </TouchableOpacity>
        )}

        {/* Visual Footer Elements */}
        <View className="flex-row justify-center mt-10">
          <View className="w-16 h-1 rounded-full bg-indigo-200 mx-1" />
          <View className="w-8 h-1 rounded-full bg-purple-300 mx-1" />
          <View className="w-4 h-1 rounded-full bg-pink-200 mx-1" />
        </View>
      </View>
    </View>
  );
};

export default ErrGeneric;
