import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { getUser, User } from "@/lib/auth/authStorage";

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const loadUser = async () => {
        const u = await getUser();
  
        console.log("Loaded user from storage:", u);
  
        if (u && u.name && u.role) {
          setUser(u);
        } else {
          console.warn("User data incomplete or missing!");
        }
      };
      loadUser();
    }, []);
  
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-blue-500 pb-14 relative rounded-b-[80px]">

        <View className="items-center mt-12">
          <Text className="text-white text-lg font-semibold">{user?.name}</Text>
        </View>

        <View className="absolute left-1/2 -translate-x-10 -bottom-10">
          <Image
            source={require("@/assets/pfp.png")}
            className="w-20 h-20 rounded-full border-4 border-white"
          />
        </View>
      </View>

      <View className="mt-14 px-6 space-y-4">
        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="person-outline" size={20} color="#3B82F6" />
          <TextInput
            value={user?.name}
            className="ml-3 flex-1 text-gray-700"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          <TextInput
            placeholder="Birthday"
            className="ml-3 flex-1 text-gray-400"
            editable={false}
          />
        </View>
        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="call-outline" size={20} color="#3B82F6" />
          <TextInput
            value="818 123 4567"
            className="ml-3 flex-1 text-gray-700"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="logo-instagram" size={20} color="#3B82F6" />
          <TextInput
            placeholder="Instagram account"
            className="ml-3 flex-1 text-gray-400"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <MaterialIcons name="email" size={20} color="#3B82F6" />
          <TextInput
            value="info@aplusdesign.co"
            className="ml-3 flex-1 text-gray-700"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Feather name="eye" size={20} color="#3B82F6" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="ml-3 flex-1 text-gray-400"
            editable={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}