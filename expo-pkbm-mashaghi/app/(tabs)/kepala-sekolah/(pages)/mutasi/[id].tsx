import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchUserDetail, fetchKelas, fetchMapels, buatMutasi, setujuiMutasi, MutasiJenis, Kelas, Mapel, User } from "~/lib/services/userService";
import { AntDesign } from "@expo/vector-icons";

export default function MutasiDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [mapels, setMapels] = useState<Mapel[]>([]);
  const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
  const [selectedMapelId, setSelectedMapelId] = useState<number | null>(null);
  const [alasan, setAlasan] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const detail = await fetchUserDetail(Number(id));
        setUser(detail);
        const [k, m] = await Promise.all([fetchKelas(), fetchMapels()]);
        setKelas(k);
        setMapels(m);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (jenis: MutasiJenis) => {
    if (!user) return;
    if ((jenis === "murid_pindah_kelas" || jenis === "murid_naik_kelas") && !selectedKelasId) return Alert.alert("Pilih kelas tujuan dulu");
    if (jenis === "guru_pindah_mapel" && !selectedMapelId) return Alert.alert("Pilih mapel tujuan dulu");

    try {
      const { mutasi } = await buatMutasi({
        user_id: user.id,
        jenis,
        kelas_tujuan_id: selectedKelasId,
        mapel_tujuan_id: selectedMapelId,
        alasan: alasan || null,
      });
      await setujuiMutasi(mutasi.id);
      Alert.alert("Berhasil", "Mutasi berhasil diproses", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Gagal", e?.response?.data?.message || "Terjadi kesalahan");
    }
  };

  if (loading) return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
      <Text>Memuat detail...</Text>
    </View>
  );

  if (!user) return (
    <View className="flex-1 items-center justify-center">
      <Text>User tidak ditemukan</Text>
    </View>
  );

  const muridActions: MutasiJenis[] = ["murid_pindah_kelas", "murid_naik_kelas", "murid_lulus", "murid_keluar"];
  const guruActions: MutasiJenis[] = ["guru_pindah_mapel", "guru_keluar"];

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center my-4">
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>   
            </View>
      <Text className="text-xl font-bold mb-4">Mutasi • {user.name}</Text>

      <View className="mb-4">
        <Text className="font-semibold">Alasan (opsional)</Text>
        <TextInput
          className="bg-gray-100 rounded-xl p-3 mt-2"
          placeholder="Tulis alasan..."
          value={alasan}
          onChangeText={setAlasan}
          multiline
        />
      </View>

      {user.role === "pesertaDidik" && (
        <>
          <Text className="font-semibold mb-2">Pilih Kelas Tujuan</Text>
          <View className="flex-row flex-wrap mb-3">
            {kelas.map(k => (
              <TouchableOpacity
                key={k.id}
                className={`px-3 py-2 mr-2 mb-2 rounded-xl ${selectedKelasId === k.id ? "bg-blue-600" : "bg-gray-200"}`}
                onPress={() => setSelectedKelasId(k.id)}
              >
                <Text className={selectedKelasId === k.id ? "text-white" : "text-black"}>{k.nama_kelas}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {muridActions.map(jenis => (
            <TouchableOpacity
              key={jenis}
              className={`rounded-2xl p-3 mb-2 items-center ${
                jenis.includes("keluar") ? "bg-red-600" : jenis.includes("lulus") ? "bg-green-600" : "bg-blue-600"
              }`}
              onPress={() => submit(jenis)}
            >
              <Text className="text-white">
                {jenis === "murid_pindah_kelas" ? "Pindah Kelas" :
                 jenis === "murid_naik_kelas" ? "Naik Kelas" :
                 jenis === "murid_lulus" ? "Luluskan" : "Keluarkan"}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {user.role === "guru" && (
        <>
          <Text className="font-semibold mb-2">Pilih Mapel Tujuan</Text>
          <View className="flex-row flex-wrap mb-3">
            {mapels.map(m => (
              <TouchableOpacity
                key={m.id}
                className={`px-3 py-2 mr-2 mb-2 rounded-xl ${selectedMapelId === m.id ? "bg-blue-600" : "bg-gray-200"}`}
                onPress={() => setSelectedMapelId(m.id)}
              >
                <Text className={selectedMapelId === m.id ? "text-white" : "text-black"}>{m.nama_mapel}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {guruActions.map(jenis => (
            <TouchableOpacity
              key={jenis}
              className={`rounded-2xl p-3 mb-2 items-center ${jenis.includes("keluar") ? "bg-red-600" : "bg-blue-600"}`}
              onPress={() => submit(jenis)}
            >
              <Text className="text-white">{jenis === "guru_pindah_mapel" ? "Pindah Mapel" : "Keluarkan"}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {user.role === "tenagaPendidik" && (
        <TouchableOpacity
          className="bg-red-600 rounded-2xl p-3 mb-2 items-center"
          onPress={() => submit("tendik_keluar")}
        >
          <Text className="text-white">Keluarkan</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}