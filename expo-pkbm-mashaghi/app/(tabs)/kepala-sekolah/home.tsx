import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { getUser } from "~/lib/auth/authStorage";
import { useRouter } from "expo-router";
import type { User } from "~/lib/auth/authStorage";
import Card from "@/components/CustomCard";
import { Button } from "react-native";

const KepalaSekolahHome = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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

  const cards = [
    { title: "Absensi", description: "Absensi Guru Dan Tenaga Pendidik", route: "/kepsek_pages/Absensi", imgUrl: () => require("@/assets/images/absen.jpeg") },
    { title: "Registrasi", description: "Registerasi Tenaga Pendidik, Guru, Dan Peserta", route: "../../auth/register", imgUrl: () => require("@/assets/images/register.jpg") },
    { title: "Pengumuman", description: "Pembuatan pengumuman", route: "/kepsek_pages/Notif", imgUrl: () => require("@/assets/images/anouncement.jpg") },
    { title: "Mutasi", description: "Pengolahan Mutasi Pendidik Dan Peserta didik", route: "/kepsek_pages/Mutasi", imgUrl: () => require("@/assets/images/mutasi.jpg") },
  ];

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6 mt-4">
        <Image
          source={require("../../../assets/pfp.png")}
          className="w-14 h-14 rounded-full mr-4"
        />
        <View>
          <Text className="text-xl font-bold">{user?.name ?? "Nama User"}</Text>
          <Text className="mx-[0.4px] text-sm text-gray-500 capitalize">
            {user?.role?.replace(/([A-Z])/g, " $1").toLowerCase() ?? "kepala sekolah"}
          </Text>
        </View>
      </View>
       
       
<View className="items-center pt-12">
  {cards.map((val) => (
    <Card
      key={val.title}
      title={val.title}
      description={val.description}
      link={val.route}
      imageUrl={val.imgUrl}
      onPress={() => router.push(val.route as any)} 
    />
  ))}
</View>     
    </ScrollView>
  );
};

export default KepalaSekolahHome;