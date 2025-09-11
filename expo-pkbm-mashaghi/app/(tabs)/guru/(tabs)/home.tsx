import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { getUser } from "~/lib/auth/authStorage";
import { useRouter } from "expo-router";
import type { User } from "~/lib/auth/authStorage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const GuruHome = () => {
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

  const cards_X = [
    { id: 1, title: "Absensi Guru Dan Tenaga Pendidik", description: "Absensi Khusus Guru Dan Tenaga Pendidik", route: "../(pages)/AbsensiGuruTendik", icon: <MaterialIcons name="school" size={28} color="#2563eb" /> },
    { id: 2, title: "Laporan Absensi Guru Dan Tenaga Pendidik", description: "Laporan Absensi Khusus Guru Dan Tenaga Pendidik", route: "../(pages)/LaporanAbsensiGuruTendik", icon: <Ionicons name="document-text" size={28} color="#16a34a" /> },
    { id: 3, title: "Absensi Murid A", description: "Absensi Murid Paket A", route: "../(pages)/AbsensiMuridA", icon: <Ionicons name="checkmark-done" size={28} color="#2563eb" /> },
    { id: 4, title: "Laporan Absensi Murid A", description: "Laporan Absensi Murid Paket A", route: "../(pages)/LaporanAbsensiMuridA", icon: <Ionicons name="document-text" size={28} color="#16a34a" /> },
    { id: 5, title: "Absensi Murid B", description: "Absensi Murid Paket B", route: "../(pages)/AbsensiMurid", icon: <Ionicons name="checkmark-circle" size={28} color="#9333ea" /> },
    { id: 6, title: "Laporan Absensi Murid B", description: "Laporan Absensi Murid Paket B", route: "../(pages)/LaporanAbsensiMurid", icon: <Ionicons name="document" size={28} color="#f97316" /> },
    { id: 7, title: "Absensi Murid C", description: "Absensi Murid Paket C", route: "../(pages)/AbsensiMurid", icon: <Ionicons name="people" size={28} color="#06b6d4" /> },
    { id: 8, title: "Laporan Absensi Murid C", description: "Laporan Absensi Murid Paket C", route: "../(pages)/LaporanAbsensiMurid", icon: <Ionicons name="document-attach" size={28} color="#ef4444" /> },
  ];

  const cards_C = [
    { id: 1, title: "Absensi Murid A", description: "Absensi Murid Paket A", route: "../(pages)/AbsensiMuridA", icon: <Ionicons name="checkmark-done" size={28} color="#2563eb" /> },
    { id: 2, title: "Laporan Absensi Murid", description: "Laporan Absensi Murid Paket A", route: "../(pages)/LaporanAbsensiMuridA", icon: <Ionicons name="document-text" size={28} color="#16a34a" /> },
    { id: 3, title: "Absensi Murid B", description: "Absensi Murid Paket B", route: "../(pages)/AbsensiMuridB", icon: <Ionicons name="checkmark-circle" size={28} color="#9333ea" /> },
    { id: 4, title: "Laporan Absensi Murid B", description: "Laporan Absensi Murid Paket B", route: "../(pages)/LaporanAbsensiMuridB", icon: <Ionicons name="document" size={28} color="#f97316" /> },
    { id: 5, title: "Absensi Murid C", description: "Absensi Murid Paket C", route: "../(pages)/AbsensiMuridC", icon: <Ionicons name="people" size={28} color="#06b6d4" /> },
    { id: 6, title: "Laporan Absensi Murid C", description: "Laporan Absensi Murid Paket C", route: "../(pages)/LaporanAbsensiMuridC", icon: <Ionicons name="document-attach" size={28} color="#ef4444" /> },
  ];

  const renderGrid = (cards: any[]) => (
    <View className="flex-row flex-wrap justify-between">
      {cards.map((val) => (
        <TouchableOpacity
          key={val.id}
          className="w-[48%] bg-gray-100 rounded-2xl p-4 mb-4 flex-col items-center justify-center"
          onPress={() => router.push(val.route as any)}
        >
          <View className="mb-2">{val.icon}</View>
          <Text className="text-sm font-semibold text-center">{val.title}</Text>
          <Text className="text-xs text-gray-500 text-center">{val.description}</Text>
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

      {user?.absensi_guruTendik && renderGrid(cards_X)}
      {user?.absensi_guruTendik === null && renderGrid(cards_C)}
    </ScrollView>
  );
};

export default GuruHome;