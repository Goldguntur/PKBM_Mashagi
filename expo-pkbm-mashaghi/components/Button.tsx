import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Button.tsx
interface ExploreButtonProps {
  handlePress?: (event: any) => void; // fungsi, bukan string
}

export default function ExploreButton({ handlePress }: ExploreButtonProps) {
  return (
    <View className="flex mt-3 justify-center items-center">
      <Pressable
        onPress={handlePress} 
        className="flex-row items-center gap-2 px-2 py-2 rounded-xl border-1 bg-blue-400"
      >
        <Text className="text-base font-semibold text-white">Explore</Text>
        <Ionicons
          name="arrow-up"
          size={18}
          color="#fff"
          style={{ transform: [{ rotate: "45deg" }] }}
        />
      </Pressable>
    </View>
  );
}