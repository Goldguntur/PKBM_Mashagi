import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, Alert } from "react-native";
import axios from "~/utils/axios";
import { getUser } from "~/lib/auth/authStorage";

export default function Home() {

  

  const [guru, setGuru] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        if (user?.id) {
          const res = await axios.get(`/guru/${user.id}`);
          setGuru(res.data);
        }
      } catch (err) {
        console.log("Fetch guru gagal:", err);
        Alert.alert("Error", "Gagal memuat data guru");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!guru) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Tidak ada data guru</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-4">
        Selamat Datang, {guru.name} 👋
      </Text>

      <Text className="text-lg mb-2">Mata Pelajaran yang diajar:</Text>
      <FlatList
        data={guru.mapels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text className="text-base mb-1">• {item.nama_mapel}</Text>
        )}
      />
    </View>
  );
}