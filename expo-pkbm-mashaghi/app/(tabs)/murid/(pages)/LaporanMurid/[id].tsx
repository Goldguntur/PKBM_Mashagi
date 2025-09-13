import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "~/utils/axios";
import { LineChart } from "react-native-chart-kit";
import { AntDesign } from "@expo/vector-icons";
import Legend from "@/components/Legend";
import { getUserToken } from "@/lib/auth/authStorage";

// ---- Types ----
type Murid = {
  id: number;
  name: string;
};

type Kelas = {
  id: number;
  nama?: string;
  nama_kelas?: string;
};

type Mapel = {
  id: number;
  nama?: string;
  nama_mapel?: string;
};

type WeekData = {
  labels: string[];
  values: {
    hadir: number[];
    sakit: number[];
    izin: number[];
    alpha: number[];
  };
};

type MonthData = {
  labels: string[];
  values: {
    hadir: number[];
    sakit: number[];
    izin: number[];
    alpha: number[];
  };
};

type LaporanMuridResponse = {
  murid: Murid;
  kelas: Kelas | null;
  mapel: Mapel | null;
  week: WeekData;
  month: MonthData;
  tahun: string;
};

export default function LaporanMuridDetailScreen() {
  const { id, kelasId, mapelId } = useLocalSearchParams<{
    id: string;
    kelasId?: string;
    mapelId?: string;
  }>();
  const [data, setData] = useState<LaporanMuridResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getUserToken();
      if (!token) return;

      const res = await axios.get(`/laporan-murid/${id}`, {
        params: {
          ...(kelasId ? { kelas_id: kelasId } : {}),
          ...(mapelId ? { mapel_id: mapelId } : {}),
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const weekLabels = res.data.week.labels.slice(-4);
      const weekValues = {
        hadir: res.data.week.values.hadir.slice(-4),
        sakit: res.data.week.values.sakit.slice(-4),
        izin: res.data.week.values.izin.slice(-4),
        alpha: res.data.week.values.alpha.slice(-4),
      };

      const formattedData: LaporanMuridResponse = {
        murid: res.data.murid,
        kelas: res.data.kelas,
        mapel: res.data.mapel,
        week: { labels: weekLabels, values: weekValues },
        month: {
          labels: res.data.month.labels,
          values: res.data.month.values,
        },
        tahun: res.data.tahun,
      };

      setData(formattedData);
    } catch (err) {
      console.error("❌ Fetch laporan murid error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, kelasId, mapelId]);

  const screenWidth = Dimensions.get("window").width;

  if (loading || !data) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center bg-blue-600 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">
          Detail Laporan Murid
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-lg font-bold text-gray-800 mb-1">
          {data.murid.name}
        </Text>
        {data.kelas && (
          <Text className="text-gray-600">
            Kelas: {data.kelas.nama ?? data.kelas.nama_kelas}
          </Text>
        )}
        {data.mapel && (
          <Text className="text-gray-600">
            Mapel: {data.mapel.nama ?? data.mapel.nama_mapel}
          </Text>
        )}
        <Text className="text-gray-600 mb-4">Tahun: {data.tahun}</Text>

        {/* Statistik Mingguan */}
        <Text className="font-semibold text-base mb-2">
          Statistik Mingguan (4 Minggu Terakhir)
        </Text>
        <LineChart
          data={{
            labels: data.week.labels,
            datasets: [
              { data: data.week.values.hadir, color: () => "#22c55e" },
              { data: data.week.values.sakit, color: () => "#eab308" },
              { data: data.week.values.izin, color: () => "#3b82f6" },
              { data: data.week.values.alpha, color: () => "#ef4444" },
            ],
            legend: ["Hadir", "Sakit", "Izin", "Alpha"],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
            labelColor: () => "#374151",
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
        <Legend
          data={[
            { label: "Hadir", color: "#22c55e" },
            { label: "Sakit", color: "#eab308" },
            { label: "Izin", color: "#3b82f6" },
            { label: "Alpha", color: "#ef4444" },
          ]}
          type="week"
        />

        {/* Statistik Bulanan */}
        <Text className="font-semibold text-base mt-6 mb-2">
          Statistik Bulanan
        </Text>
        <LineChart
          data={{
            labels: data.month.labels,
            datasets: [
              { data: data.month.values.hadir, color: () => "#22c55e" },
              { data: data.month.values.sakit, color: () => "#eab308" },
              { data: data.month.values.izin, color: () => "#3b82f6" },
              { data: data.month.values.alpha, color: () => "#ef4444" },
            ],
            legend: ["Hadir", "Sakit", "Izin", "Alpha"],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
            labelColor: () => "#374151",
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
        <Legend
          data={[
            { label: "Hadir", color: "#22c55e" },
            { label: "Sakit", color: "#eab308" },
            { label: "Izin", color: "#3b82f6" },
            { label: "Alpha", color: "#ef4444" },
          ]}
          type="month"
        />
      </ScrollView>
    </View>
  );
}