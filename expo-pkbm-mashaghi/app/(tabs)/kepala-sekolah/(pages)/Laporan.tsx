import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { SceneMap, TabView } from "react-native-tab-view";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios, { axiosUrl } from "~/utils/axios";
import { useRouter } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import { getUserToken } from "@/lib/auth/authStorage";

// 📌 Komponen list laporan
const LaporanList = ({ role }: { role: "guru" | "tenagaPendidik" }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getUserToken();
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }
      const res = await axios.get("/laporan-absensi", {
        params: { role },
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.log("❌ Error fetch laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const total = data.reduce(
    (acc, item) => {
      acc.hadir += item.hadir || 0;
      acc.sakit += item.sakit || 0;
      acc.izin += item.izin || 0;
      acc.alpha += item.alpha || 0;
      return acc;
    },
    { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
  );

  const screenWidth = Dimensions.get("window").width;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View className="bg-white px-4 py-6 border-b border-gray-200">
          <Text className="text-xl font-bold mb-3">Statistik Kehadiran</Text>
          <PieChart
            data={[
              { name: "Hadir", population: total.hadir, color: "#22c55e", legendFontColor: "#333", legendFontSize: 14 },
              { name: "Sakit", population: total.sakit, color: "#eab308", legendFontColor: "#333", legendFontSize: 14 },
              { name: "Izin", population: total.izin, color: "#3b82f6", legendFontColor: "#333", legendFontSize: 14 },
              { name: "Alpha", population: total.alpha, color: "#ef4444", legendFontColor: "#333", legendFontSize: 14 },
            ]}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
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
          (item.hadir || 0) + (item.sakit || 0) + (item.izin || 0) + (item.alpha || 0);
        const persentase = ((item.hadir / (totalUser || 1)) * 100).toFixed(1);

        return (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/kepala-sekolah/laporan-absensi/[id]",
                params: { id: String(item.id) },
              })
            }
            className="bg-white px-4 py-3 border-b border-gray-200"
          >
            <Text className="text-lg font-semibold">{item.name}</Text>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-green-600">Hadir: {item.hadir}</Text>
              <Text className="text-yellow-600">Sakit: {item.sakit}</Text>
              <Text className="text-blue-600">Izin: {item.izin}</Text>
              <Text className="text-red-600">Alpha: {item.alpha}</Text>
            </View>

            <Text className="mt-2 text-gray-700">
              Persentase Kehadiran Bulan Ini: {persentase}%
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const GuruRoute = () => <LaporanList role="guru" />;
const TenagaPendidikRoute = () => <LaporanList role="tenagaPendidik" />;

// 📌 Tab Custom
const CustomTabBar = ({ navigationState, jumpTo }: any) => {
  const width = Dimensions.get("window").width;
  const tabWidth = width / navigationState.routes.length;

  return (
    <View className="bg-white shadow-sm relative">
      <View className="flex-row">
        {navigationState.routes.map((route: any, i: number) => {
          const focused = navigationState.index === i;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => jumpTo(route.key)}
              className="flex-1 items-center justify-center py-3"
            >
              <Text
                style={{
                  color: focused ? "#2563eb" : "#64748b",
                  fontWeight: focused ? "700" : "500",
                  fontSize: 16,
                }}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="h-[2px] bg-gray-200" />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: navigationState.index * tabWidth,
          width: tabWidth,
          height: 3,
          backgroundColor: "#2563eb",
        }}
      />
    </View>
  );
};

export default function LaporanAbsensiScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "guru", title: "Laporan Guru" },
    { key: "tenaga", title: "Laporan Tendik" },
  ]);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"harian" | "bulanan">("harian");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const router = useRouter();

  // 📌 Fungsi download Excel
  const handleDownloadExcel = async (mode: "harian" | "bulanan", date: Date) => {
    try {
      const token = await getUserToken();
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      let url = "";
      let fileName = "";

      if (mode === "harian") {
  const tgl = date.toISOString().slice(0, 10);
  url = `${axiosUrl}/laporan-absensi/export-harian?tanggal=${tgl}`;
  fileName = `Absensi_Harian_${tgl}.xlsx`;
} else {
  const bulanParam = date.getMonth() + 1;
  const tahunParam = date.getFullYear();
  url = `${axiosUrl}/laporan-absensi/export-bulanan?bulan=${bulanParam}&tahun=${tahunParam}`;
  fileName = `Absensi_Bulanan_${bulanParam}_${tahunParam}.xlsx`;
}
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await downloadResumable.downloadAsync();

      if (result?.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri);
        } else {
          Alert.alert(`Sukses, File tersimpan di: ${result.uri}`);
        }
      } else {
        Alert.alert(`Gagal, Status: ${result?.status}`);
      }
    } catch (e: any) {
      console.error("❌ Download failed:", e);
      Alert.alert("Error", e.message);
    }
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      handleDownloadExcel(pickerMode, date);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center bg-blue-600 px-4 py-4 shadow-md">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Laporan Absensi</Text>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          guru: GuruRoute,
          tenaga: TenagaPendidikRoute,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <CustomTabBar {...props} />}
      />

      {/* Tombol aksi */}
      <View className="flex-row justify-center gap-4 px-4 py-8 border-t border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => {
            setPickerMode("bulanan");
            setShowPicker(true);
          }}
          className="flex-row items-center bg-green-600 px-4 py-3 rounded-xl"
        >
          <Feather name="file-text" size={18} color="white" />
          <Text className="text-white ml-2 font-semibold">Unduh Excel Bulanan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setPickerMode("harian");
            setShowPicker(true);
          }}
          className="flex-row items-center bg-blue-600 px-4 py-3 rounded-xl"
        >
          <Feather name="calendar" size={18} color="white" />
          <Text className="text-white ml-2 font-semibold">Unduh Excel Harian</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}