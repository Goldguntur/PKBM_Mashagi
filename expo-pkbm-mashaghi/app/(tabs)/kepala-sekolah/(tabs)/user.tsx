import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Image, Pressable, Alert } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { getUser, logout, User } from "@/lib/auth/authStorage";
import { useRouter } from "expo-router";



export default function ProfileScreen() {
 
  const router = useRouter();


  const [user, setUser] = useState<User | null>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

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
          <Text className="ml-3 text-gray-700 capitalize">Name:</Text>
          <TextInput
            value={user?.name}
            className="ml-1 flex-1 text-zinc-500 text-sm capitalize"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="at-outline" size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700 capitalize">Username:</Text>
          <TextInput
            value={user?.username || ""}
            className="ml-1 flex-1 text-zinc-500 text-sm capitalize"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700 capitalize">Tanggal lahir:</Text>
          <TextInput
            value={formatDate(user?.tanggal_lahir || "")}
            placeholder="Birthday"
            className="ml-1 flex-1 text-zinc-500 text-sm capitalize"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="call-outline" size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700 capitalize">Nomor Telp:</Text>
          <TextInput
            value={user?.no_wa || ""}
            className="ml-1 flex-1 text-zinc-500 text-sm capitalize"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <MaterialIcons name="email" size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700 capitalize">Email:</Text>
          <TextInput
            value={user?.email || ""}
            className="ml-1 flex-1 text-zinc-500 text-sm capitalize"
            editable={false}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Feather name="credit-card" size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700 capitalize">Nik:</Text>
          <TextInput
            value={user?.nik || ""}
            className="ml-1 capitalize flex-1 text-zinc-500 text-sm"
            editable={false}
          />
        </View>


        <View className="flex-row items-center border-b border-gray-200 pb-2">
          <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700 capitalize">Role:</Text>
          <TextInput
            value={user?.role || ""}
            className="ml-1 flex-1 text-zinc-500 text-sm capitalize"
            editable={false}
          />
        </View>
      </View>
      <View>
        <Pressable
          onPress={() => {
            Alert.alert("Logout", "Anda yakin ingin logout?", [
              {
                text: "Logout",
                onPress: () => {
                  logout();
                  router.replace("../../../auth/login");
                }
              },
              {
                text: "Batal",
                style: "cancel"
              }
            ]);
          }}
          className="flex-row items-center border-b border-gray-200 pb-2"
        >
          <Ionicons name="log-out-outline" size={30} color="#3B82F6" />
          <Text className="ml-3 text-gray-700 capitalize">Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}