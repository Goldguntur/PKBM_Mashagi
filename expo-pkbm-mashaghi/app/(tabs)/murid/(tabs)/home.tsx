import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { getUser } from "~/lib/auth/authStorage";
import { useRouter } from "expo-router";
import type { User } from "~/lib/auth/authStorage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const MuridHome = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const u = await getUser();
      if (u && u.name && u.role) {
        console.log("User:", u?.absensi_guruTendik);
        setUser(u);
      }
    };
    loadUser();
  }, []);


  const cards_C = [
    { id: 2, title: "Laporan Absensi Murid", description: "Laporan Absensi Murid Paket A", route: "../(pages)/LaporanAbsensiMuridA", icon: <Ionicons name="document-text" size={36} color="#16a34a" /> },
    { id: 4, title: "Laporan Absensi Murid B", description: "Laporan Absensi Murid Paket B", route: "../(pages)/LaporanAbsensiMuridB", icon: <Ionicons name="document" size={36} color="#f97316" /> },
    { id: 6, title: "Laporan Absensi Murid C", description: "Laporan Absensi Murid Paket C", route: "../(pages)/LaporanAbsensiMuridC", icon: <Ionicons name="document-attach" size={36} color="#ef4444" /> },
  ];

  const renderGrid = (cards: any[]) => (
    <View className="w-full items-center justify-between">
      {cards.map((val) => (
        <TouchableOpacity
          key={val.id}
          className="w-[80%] bg-gray-100 rounded-2xl p-4 mb-4 flex-col items-center justify-center"
          onPress={() => router.push(val.route as any)}
        >
          <View className="mb-2">{val.icon}</View>
          <Text className="text-lg font-semibold text-center">{val.title}</Text>
          <Text className="text-gray-500 text-center">{val.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6 mt-4">
        <Image
          source={require("@/assets/pfp.png")}
          className="w-14 h-14 rounded-full mr-4"
        />
        <View>
          <Text className="text-xl font-bold">{user?.name ?? "Nama User"}</Text>
          <Text className="text-sm text-gray-500 capitalize">
            {user?.role?.replace(/([A-Z])/g, " $1").toLowerCase() ?? "kepala sekolah"}
          </Text>
        </View>
      </View>

      {renderGrid(cards_C)}
    </ScrollView>
  );
};

export default MuridHome;