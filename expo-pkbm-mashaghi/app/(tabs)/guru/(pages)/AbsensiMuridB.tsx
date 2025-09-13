import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import axios from "~/utils/axios";
import { getUserToken } from "~/lib/auth/authStorage";

interface Fase {
  label: string;
  kelas_id: number;
}

interface Mapel {
  id: number;
  nama_mapel: string;
  kode_mapel?: string;
}

const faseMap: Fase[] = [
  { label: "Kelas 7", kelas_id: 4 },
  { label: "Kelas 8", kelas_id: 5 },
  { label: "Kelas 9", kelas_id: 6 },
];

export default function AbsensiMuridB() {
  const router = useRouter();
  const [mapels, setMapels] = useState<Mapel[]>([]);
  const [selectedMapel, setSelectedMapel] = useState<number | null>(null);
  const [selectedMapelData, setSelectedMapelData] = useState<Mapel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        setLoading(true);
        const token = await getUserToken();
        if (!token) {
          Alert.alert("Error", "Token tidak ditemukan. Silakan login kembali.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const meRes = await axios.get("/me", { headers });
        const userData = meRes.data?.user || meRes.data;

        if (!mounted) return;

        if (userData?.mapels && Array.isArray(userData.mapels)) {
          setMapels(userData.mapels);
          if (userData.mapels.length > 0) {
            setSelectedMapel(userData.mapels[0].id);
            setSelectedMapelData(userData.mapels[0]);
          }
        } else {
          const mapelRes = await axios.get("/mapels", { headers });
          const allMapels: Mapel[] = mapelRes.data || [];
          setMapels(allMapels);
          if (allMapels.length > 0) {
            setSelectedMapel(allMapels[0].id);
            setSelectedMapelData(allMapels[0]);
          }
        }
      } catch (err: any) {
        console.log("❌ fetch init error:", err);
        const errorMsg = err.response?.data?.message || "Gagal mengambil data mapel. Cek koneksi atau login ulang.";
        Alert.alert("Error", errorMsg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const handleMapelChange = (mapelId: number) => {
    setSelectedMapel(mapelId);
    const mapelData = mapels.find((m) => m.id === mapelId) || null;
    setSelectedMapelData(mapelData);
  };

  const handleFasePress = async (fase: Fase) => {
    if (!selectedMapel) {
      Alert.alert("Pilih Mapel", "Silakan pilih mapel terlebih dahulu.");
      return;
    }

    try {
      const token = await getUserToken();
      const headers = { Authorization: `Bearer ${token}` };

      const kelasMapelRes = await axios.get(`/mapel/${selectedMapel}/kelas`, { headers });
      const kelasData = kelasMapelRes.data;

      router.push({
        pathname: "/guru/AbsensiMurid/[id]",
        params: {
          id: String(fase.kelas_id),
          kelas_id: String(fase.kelas_id),
          mapel_id: String(selectedMapel),
          mapel_nama: selectedMapelData?.nama_mapel || "Unknown",
          fase_label: fase.label,
        },
      });
    } catch (error: any) {
      console.log("❌ Error checking mapel-kelas:", error);
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan. Pastikan Anda mengajar mapel ini di kelas tersebut.";
      Alert.alert("Error", errorMsg);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="bg-white flex-1">
      <View className="flex-row items-center bg-blue-600 px-4 py-4 shadow-md elevation-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-2xl font-bold capitalize mt-2">Pilih Fase</Text>
          <Text className="text-white text-sm">Pilih mapel lalu pilih fase kelas</Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-sm text-gray-600 mb-2">Pilih Mapel</Text>
        {mapels.length === 0 ? (
          <View className="p-3 rounded bg-yellow-100">
            <Text className="text-yellow-800">Kamu belum terdaftar di mapel manapun. Hubungi admin.</Text>
          </View>
        ) : (
          <View className="bg-white border rounded border-gray-300">
            <Picker
              selectedValue={selectedMapel}
              onValueChange={(value) => handleMapelChange(Number(value))}
              style={{ height: 50 }}
            >
              <Picker.Item label="Pilih Mapel..." value={null} />
              {mapels.map((m) => (
                <Picker.Item
                  key={m.id}
                  label={`${m.nama_mapel}${m.kode_mapel ? ` (${m.kode_mapel})` : ""}`}
                  value={m.id}
                />
              ))}
            </Picker>
          </View>
        )}

        {selectedMapelData && (
          <View className="mt-3 p-3 bg-blue-50 rounded">
            <Text className="text-blue-800 font-medium">
              Mapel Terpilih: {selectedMapelData.nama_mapel}
            </Text>
            {selectedMapelData.kode_mapel && (
              <Text className="text-blue-600 text-sm">
                Kode: {selectedMapelData.kode_mapel}
              </Text>
            )}
          </View>
        )}
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={faseMap}
        keyExtractor={(item) => String(item.kelas_id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-6 mb-4 rounded-xl ${selectedMapel ? "bg-blue-500" : "bg-gray-400"}`}
            disabled={!selectedMapel}
            onPress={() => handleFasePress(item)}
          >
            <Text className="text-white text-xl font-semibold">{item.label}</Text>
            <Text className="text-white text-sm mt-1">
              {selectedMapel ? `Klik untuk absensi ${item.label}` : "Pilih mapel dulu"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}