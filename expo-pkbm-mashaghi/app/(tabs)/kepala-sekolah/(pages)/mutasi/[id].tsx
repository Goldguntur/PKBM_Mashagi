import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  fetchUserDetail,
  fetchKelas,
  fetchMapels,
  buatMutasi,
  setujuiMutasi,
  MutasiJenis,
  Kelas,
  Mapel,
  User,
} from "~/lib/services/userService";
import { AntDesign } from "@expo/vector-icons";

export default function MutasiDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [mapels, setMapels] = useState<Mapel[]>([]);
  const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
  const [selectedMapelIds, setSelectedMapelIds] = useState<number[]>([]);
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

    if (
      (jenis === "murid_pindah_kelas" || jenis === "murid_naik_kelas") &&
      !selectedKelasId
    ) {
      return Alert.alert("Pilih kelas tujuan dulu");
    }

    if (jenis === "guru_pindah_mapel" && selectedMapelIds.length === 0) {
      return Alert.alert("Pilih minimal satu mapel tujuan dulu");
    }

    try {
      const payload = {
        user_id: user.id,
        jenis,
        kelas_tujuan_id: selectedKelasId ?? null,
        mapel_tujuan_id: jenis === "guru_pindah_mapel" ? selectedMapelIds : null,
        alasan: alasan || null,
      };

      const { mutasi } = await buatMutasi(payload);
      await setujuiMutasi(mutasi.id);

      Alert.alert("Berhasil", "Mutasi berhasil diproses", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message || e?.response?.data || "Terjadi kesalahan";
      Alert.alert("Gagal", String(msg));
    }
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600">Memuat detail...</Text>
      </View>
    );

  if (!user)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">User tidak ditemukan</Text>
      </View>
    );

  const muridActions: MutasiJenis[] = [
    "murid_pindah_kelas",
    "murid_naik_kelas",
    "murid_lulus",
    "murid_keluar",
  ];
  const guruActions: MutasiJenis[] = ["guru_pindah_mapel", "guru_keluar"];

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-blue-50 to-white px-5 pt-6">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-white shadow"
        >
          <AntDesign name="arrowleft" size={22} color="#2563eb" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-3 text-blue-700">
          Mutasi • {user.name}
        </Text>
      </View>

      {user.role === "guru" && user.mapels && (
        <View className="mb-4 bg-white rounded-2xl p-4 shadow">
          <Text className="text-gray-500 text-sm">Mapel Asal</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {user.mapels.map((m) => m.nama_mapel).join(", ")}
          </Text>
        </View>
      )}
      {user.role === "pesertaDidik" && user.kelas && (
        <View className="mb-4 bg-white rounded-2xl p-4 shadow">
          <Text className="text-gray-500 text-sm">Kelas Asal</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {user.kelas.nama_kelas}
          </Text>
        </View>
      )}

      <View className="mb-6">
        <Text className="font-semibold text-gray-700 mb-2">Alasan (opsional)</Text>
        <TextInput
          className="bg-white rounded-2xl p-4 shadow text-gray-800"
          placeholder="Tulis alasan..."
          value={alasan}
          onChangeText={setAlasan}
          multiline
        />
      </View>

      {/* Murid Section */}
      {user.role === "pesertaDidik" && (
        <>
          <Text className="font-semibold text-gray-700 mb-3">
            Pilih Kelas Tujuan
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {kelas.map((k) => (
              <TouchableOpacity
                key={k.id}
                className={`px-4 py-3 mr-2 mb-2 rounded-2xl shadow ${
                  selectedKelasId === k.id
                    ? "bg-blue-600"
                    : "bg-gray-100"
                }`}
                onPress={() => setSelectedKelasId(k.id)}
              >
                <Text
                  className={
                    selectedKelasId === k.id ? "text-white font-medium" : "text-gray-700"
                  }
                >
                  {k.nama_kelas}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {muridActions.map((jenis) => (
            <TouchableOpacity
              key={jenis}
              className={`rounded-2xl p-4 mb-3 items-center shadow ${
                jenis.includes("keluar")
                  ? "bg-red-500"
                  : jenis.includes("lulus")
                  ? "bg-green-500"
                  : "bg-blue-600"
              }`}
              onPress={() => submit(jenis)}
            >
              <Text className="text-white font-semibold">
                {jenis === "murid_pindah_kelas"
                  ? "Pindah Kelas"
                  : jenis === "murid_naik_kelas"
                  ? "Naik Kelas"
                  : jenis === "murid_lulus"
                  ? "Luluskan"
                  : "Keluarkan"}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Guru Section */}
      {user.role === "guru" && (
        <>
          <Text className="font-semibold text-gray-700 mb-3">
            Pilih Mapel Tujuan (multi-select)
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {mapels.map((m) => {
              const selected = selectedMapelIds.includes(m.id);
              return (
                <TouchableOpacity
                  key={m.id}
                  className={`px-4 py-3 mr-2 mb-2 rounded-2xl shadow ${
                    selected ? "bg-blue-600" : "bg-gray-100"
                  }`}
                  onPress={() =>
                    setSelectedMapelIds((prev) =>
                      selected ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                    )
                  }
                >
                  <Text
                    className={
                      selected ? "text-white font-medium" : "text-gray-700"
                    }
                  >
                    {m.nama_mapel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {guruActions.map((jenis) => (
            <TouchableOpacity
              key={jenis}
              className={`rounded-2xl p-4 mb-3 items-center shadow ${
                jenis.includes("keluar") ? "bg-red-500" : "bg-blue-600"
              }`}
              onPress={() => submit(jenis)}
            >
              <Text className="text-white font-semibold">
                {jenis === "guru_pindah_mapel" ? "Pindah Mapel" : "Keluarkan"}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {user.role === "tenagaPendidik" && (
        <TouchableOpacity
          className="bg-red-500 rounded-2xl p-4 mb-3 items-center shadow"
          onPress={() => submit("tendik_keluar")}
        >
          <Text className="text-white font-semibold">Keluarkan</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}