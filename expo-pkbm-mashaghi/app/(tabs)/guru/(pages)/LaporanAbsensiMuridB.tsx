import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { TabView } from "react-native-tab-view";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "~/utils/axios";
import { useRouter } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import { getUserToken } from "@/lib/auth/authStorage";

type Kelas = { id: number; nama?: string; nama_kelas?: string };
type Mapel = { id: number; nama?: string; nama_mapel?: string };
type MuridRekap = {
  id: number;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      bytes.subarray(i, i + chunk) as any
    );
  }
  return btoa(binary);
}

const LaporanList = ({
  kelasId,
  mapelId,
}: {
  kelasId?: string;
  mapelId?: string | null;
}) => {
  const [data, setData] = useState<MuridRekap[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasInfo, setKelasInfo] = useState<any>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getUserToken();
      if (!token) return Alert.alert("Error", "Token tidak ditemukan");

      const params: Record<string, string> = {};
      if (kelasId) params.kelas_id = kelasId;
      if (mapelId) params.mapel_id = mapelId;

      const res = await axios.get("/laporan-murid", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.rekap || []);
      setKelasInfo(res.data.kelas || null);
    } catch (err: any) {
      console.log("❌ Error fetch laporan murid:", err);
      Alert.alert("Gagal", err?.message || "Tidak dapat mengambil data laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kelasId, mapelId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const totals = data.reduce(
    (acc, item) => {
      acc.hadir += item.hadir || 0;
      acc.sakit += item.sakit || 0;
      acc.izin += item.izin || 0;
      acc.alpha += item.alpha || 0;
      return acc;
    },
    { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, idx) => String(item.id ?? idx)}
      ListHeaderComponent={
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          {kelasInfo && (
            <Text className="text-base font-bold text-blue-600">
              Kelas: {kelasInfo.nama ?? kelasInfo.nama_kelas ?? "—"}
            </Text>
          )}
          <Text className="text-lg font-extrabold mt-2">
            Statistik Kehadiran Murid
          </Text>

          <PieChart
            data={[
              {
                name: "Hadir",
                population: totals.hadir,
                color: "#22c55e",
                legendFontColor: "#333",
                legendFontSize: 12,
              },
              {
                name: "Sakit",
                population: totals.sakit,
                color: "#eab308",
                legendFontColor: "#333",
                legendFontSize: 12,
              },
              {
                name: "Izin",
                population: totals.izin,
                color: "#3b82f6",
                legendFontColor: "#333",
                legendFontSize: 12,
              },
              {
                name: "Alpha",
                population: totals.alpha,
                color: "#ef4444",
                legendFontColor: "#333",
                legendFontSize: 12,
              },
            ]}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
              labelColor: () => "#374151",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            absolute
          />
        </View>
      }
      renderItem={({ item }) => {
        const totalUser =
          (item.hadir ?? 0) +
          (item.sakit ?? 0) +
          (item.izin ?? 0) +
          (item.alpha ?? 0);
        const persentase =
          totalUser > 0 ? ((item.hadir ?? 0) / totalUser) * 100 : 0;

        return (
          <TouchableOpacity
                     className="bg-white border-b border-gray-100 px-4 py-3"
  onPress={() =>
    router.push({
      pathname: "/guru/LaporanMurid/[id]",
      params: {
        id: String(item.id),
        kelas_id: kelasId ?? "",
        mapel_id: mapelId ?? "",
      },
    })
  } 
          >
            <Text className="text-base font-bold mb-2">{item.name}</Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-green-600">Hadir: {item.hadir ?? 0}</Text>
              <Text className="text-yellow-600">
                Sakit: {item.sakit ?? 0}
              </Text>
              <Text className="text-blue-600">Izin: {item.izin ?? 0}</Text>
              <Text className="text-red-600">Alpha: {item.alpha ?? 0}</Text>
            </View>

            <Text className="text-gray-600">
              Persentase Kehadiran: {persentase.toFixed(1)}%
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default function LaporanAbsensiMuridScreen() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [selectedMapel, setSelectedMapel] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([{ key: "all", title: "Semua Murid" }]);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"harian" | "bulanan">("harian");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const router = useRouter();

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    try {
      const token = await getUserToken();
      if (!token) return;

      const [kelasRes, mapelRes] = await Promise.all([
        axios.get("/kelas", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/mapel", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const kelasData: Kelas[] = kelasRes.data || [];
      const mapelData: Mapel[] = mapelRes.data || [];

      const paketB = kelasData.filter((k) =>
        (k.nama ?? k.nama_kelas ?? "").includes("Paket B")
      );

      setKelasList(paketB);
      setMapelList(mapelData);

      setRoutes([
        { key: "all", title: "Semua Murid" },
        ...paketB.map((k) => ({
          key: String(k.id),
          title: k.nama ?? k.nama_kelas ?? `Kelas ${k.id}`,
        })),
      ]);
    } catch (err) {
      console.log("fetchInitial error:", err);
    }
  };

  const handleExport = (mode: "harian" | "bulanan") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onDateChange = async (_: any, date?: Date) => {
    if (!date) {
      setShowPicker(false);
      return;
    }
    setShowPicker(Platform.OS === "ios");
    setSelectedDate(date);

    const token = await getUserToken();
    if (!token) return;

    const currentRoute = routes[index];
    const kelasId = currentRoute.key === "all" ? undefined : currentRoute.key;
    const mapelId = selectedMapel ?? undefined;

    let url = "";
    if (pickerMode === "harian") {
      url = `/laporan-murid/export-harian?tanggal=${date
        .toISOString()
        .slice(0, 10)}${kelasId ? `&kelas_id=${kelasId}` : ""}${
        mapelId ? `&mapel_id=${mapelId}` : ""
      }`;
    } else {
      const bulan = date.getMonth() + 1;
      const tahun = date.getFullYear();
      url = `/laporan-murid/export-bulanan?bulan=${bulan}&tahun=${tahun}${
        kelasId ? `&kelas_id=${kelasId}` : ""
      }${mapelId ? `&mapel_id=${mapelId}` : ""}`;
    }

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
        timeout: 15000,
      });

      const fileUri =
        FileSystem.documentDirectory +
        (pickerMode === "harian"
          ? "Absensi_Harian.xlsx"
          : "Absensi_Bulanan.xlsx");

      const base64Data = arrayBufferToBase64(response.data);

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (err: any) {
      console.log("Export error:", err);
      Alert.alert("Gagal", err?.message || "Tidak bisa export file");
    }
  };

  const renderScene = ({ route }: any) => {
    const kelasId = route.key === "all" ? undefined : route.key;
    return (
      <LaporanList kelasId={kelasId} mapelId={selectedMapel ?? undefined} />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center bg-blue-600 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">
          Laporan Absensi Murid
        </Text>
      </View>

      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="mb-2 text-gray-700 font-medium">Filter Mapel</Text>
        <View className="border border-gray-300 rounded-lg overflow-hidden">
          <Picker
            selectedValue={selectedMapel}
            onValueChange={(val) => setSelectedMapel(val)}
          >
            <Picker.Item label="Semua Mapel" value={null} />
            {mapelList.map((m) => (
              <Picker.Item
                key={m.id}
                label={m.nama ?? m.nama_mapel ?? String(m.id)}
                value={String(m.id)}
              />
            ))}
          </Picker>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <View className="flex-row bg-white border-b border-gray-200">
            {props.navigationState.routes.map((r: any, i: number) => {
              const focused = props.navigationState.index === i;
              return (
                <TouchableOpacity
                  key={r.key}
                  onPress={() => setIndex(i)}
                  className="flex-1 items-center py-3"
                >
                  <Text
                    className={
                      focused
                        ? "text-blue-600 text-sm font-bold"
                        : "text-gray-500 text-sm"
                    }
                  >
                    {r.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <View className="flex-row justify-center gap-4 px-4 py-8 border-t border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => handleExport("harian")}
          className="flex-row items-center bg-green-500 px-4 py-3 rounded-xl"
        >
          <Feather name="file-text" size={18} color="white" />
          <Text className="text-white ml-2 font-semibold">Export Harian</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleExport("bulanan")}
          className="flex-row items-center bg-blue-500 px-4 py-3 rounded-xl"
        >
          <Feather name="calendar" size={18} color="white" />
          <Text className="text-white ml-2 font-semibold">Export Bulanan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}