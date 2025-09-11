import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "~/utils/axios";
import { getUserToken } from "~/lib/auth/authStorage";

interface Student {
  id: number;
  name: string;
  username: string;
  email: string;
  status: string;
  jam_masuk?: string;
}

export default function AbsensiKelas() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const kelas_id = params.kelas_id as string;
  const mapel_id = params.mapel_id as string;
  const mapel_nama = params.mapel_nama as string;
  const fase_label = params.fase_label as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [postingId, setPostingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getUserToken();
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get<Student[]>("/absensi-murid", {
        headers,
        params: { kelas_id, mapel_id },
      });
      setStudents(res.data);
      setFiltered(res.data);
    } catch (err: any) {
      console.log("❌ Fetch murid error:", err.response?.data || err);
      Alert.alert("Error", "Gagal memuat data murid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kelas_id, mapel_id]);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(students);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        students.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.username.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        )
      );
    }
  }, [search, students]);

  const handleAbsen = async (id: number, status: string) => {
    try {
      setPostingId(id);
      const token = await getUserToken();
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post("/absensi-murid", {
        murid_id: id,
        kelas_id,
        mapel_id,
        status,
      }, { headers });

      Alert.alert("✅ Berhasil", `Murid diabsen: ${status}`);
      fetchData();
    } catch (err: any) {
      console.log("❌ Absen error:", err.response?.data || err);
      Alert.alert("Error", "Gagal menyimpan absensi.");
    } finally {
      setPostingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hadir": return "text-green-600";
      case "izin": return "text-blue-600";
      case "sakit": return "text-yellow-600";
      case "alpha": return "text-red-600";
      default: return "text-gray-500";
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
      {/* Header */}
      <View className="flex-row items-center bg-blue-600 px-4 py-4 shadow-md elevation-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-xl font-bold">Absensi {fase_label}</Text>
          <Text className="text-white text-sm">{mapel_nama} • Kelas ID: {kelas_id}</Text>
        </View>
      </View>

      <View className="px-4 py-2 bg-gray-100">
        <TextInput
          placeholder="Cari murid berdasarkan nama/username..."
          value={search}
          onChangeText={setSearch}
          className="bg-white px-4 py-2 rounded-xl border border-gray-300"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const hasAttendance = item.status !== "belum absen";

          return (
            <View className="p-4 mb-3 rounded-2xl bg-white shadow border border-gray-200">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-semibold">{item.name}</Text>
                    <Text className="text-gray-600">{item.username}</Text>
                    <Text className="text-gray-600 text-xs">{item.email}</Text>
                </View>
                {hasAttendance && (
                  <View className="items-end">
                    <Text className={`font-bold ${getStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </Text>
                    {item.jam_masuk && (
                      <Text className="text-gray-500 text-xs mt-1">{item.jam_masuk}</Text>
                    )}
                  </View>
                )}
              </View>

              {/* Tombol absen kalau belum absen */}
              {!hasAttendance && (
                <View className="flex-row mt-3">
                  {["hadir", "izin", "sakit", "alpha"].map((status, idx) => {
                    const colors = ["bg-green-500", "bg-blue-600", "bg-yellow-400", "bg-red-600"];
                    const labels = ["H", "I", "S", "A"];
                    return (
                      <TouchableOpacity
                        key={status}
                        onPress={() =>
                          Alert.alert("Konfirmasi", `Absen ${status}?`, [
                            { text: "Ya", onPress: () => handleAbsen(item.id, status) },
                            { text: "Tidak", style: "cancel" },
                          ])
                        }
                        className={`${colors[idx]} px-4 py-2 rounded-xl mr-2 ${postingId === item.id ? "opacity-50" : ""}`}
                        disabled={postingId === item.id}
                      >
                        <Text className="text-white font-semibold">{labels[idx]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View className="items-center mt-8">
            <Text className="text-gray-500">Tidak ada murid ditemukan.</Text>
          </View>
        )}
      />
    </View>
  );
}