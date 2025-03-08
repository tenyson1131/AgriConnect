import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function onBoarding() {
  const router = useRouter();
  return (
    <>
      <View className="flex-1 justify-center items-center">
        <View className="items-center">
          <Text className="text-3xl text-[#26885f] font-medium">
            Agri Connect
          </Text>
          <Text className="text-[#19a974] text-lg mt-2">
            Smart Shopping in easy steps
          </Text>
        </View>
        <View className="my-20">
          <Image
            source={require("@/assets/images/onBoarding.webp")}
            className="w-96 h-96"
          />
        </View>
        <View className="w-full">
          <Pressable
            className="bg-[#19a974] active:bg-[#26885f] px-10 py-3 rounded-full mx-14"
            onPress={() => router.push("/auth/authOptions")}
          >
            <Text className="text-white text-center text-xl font-semibold">
              Get Started
            </Text>
          </Pressable>
          {/* <Pressable className="bg-white px-10 py-3 rounded-full mx-14 border-2 border-[#19a974] my-5">
            <Text className="text-[#19a974] active:text-[#26885f] text-center text-xl font-semibold">
              Already have an account?
            </Text>
          </Pressable>
          <Pressable className="my-4">
            <Text className="text-[#19a974] text-center font-semibold text-lg">
              Continue as Guest
            </Text>
          </Pressable> */}
        </View>
      </View>
    </>
  );
}
