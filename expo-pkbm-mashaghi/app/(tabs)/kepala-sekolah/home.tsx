// app/kepala-sekolah/home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { getUser } from "~/lib/auth/authStorage";
import { useRouter } from "expo-router";
import type { User } from "~/lib/auth/authStorage";

const KepalaSekolahHome = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const u = await getUser();

      // Debug user data
      console.log("Loaded user from storage:", u);

      if (u && u.name && u.role) {
        setUser(u);
      } else {
        console.warn("User data incomplete or missing!");
      }
    };
    loadUser();
  }, []);

  const cards = [
    { title: "Absensi Guru", route: "/kepala-sekolah/absensi-guru" },
    { title: "Absensi Tenaga Pendidik", route: "/kepala-sekolah/absensi-tenaga" },
    { title: "Registrasi", route: "/kepala-sekolah/register" },
    { title: "Pengumuman", route: "/kepala-sekolah/pengumuman" },
    { title: "Mutasi", route: "/kepala-sekolah/mutasi" },
  ];

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6">
        <Image
          source={require("../../../assets/pfp.jpg")}
          className="w-14 h-14 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-semibold">{user?.name ?? "Nama User"}</Text>
          <Text className="text-sm text-gray-500 capitalize">
            {user?.role?.replace(/([A-Z])/g, " $1").toLowerCase() ?? "kepala sekolah"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {cards.map((card, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push('/')}
            className="w-[48%] bg-blue-100 p-4 rounded-xl mb-4"
          >
            <Text className="text-base font-semibold text-blue-900">{card.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default KepalaSekolahHome;