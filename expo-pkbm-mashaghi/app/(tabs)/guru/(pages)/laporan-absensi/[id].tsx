import { View, Text, ActivityIndicator, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "~/utils/axios";
import { LineChart } from "react-native-chart-kit";
import { AntDesign } from "@expo/vector-icons";
import Legend from "@/components/Legend";

export default function LaporanUserDetailScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/laporan-absensi/user/${id}`);

      const weekLabels = res.data.week.labels.slice(-4);
      const weekValues = {
        hadir: res.data.week.values.hadir.slice(-4),
        sakit: res.data.week.values.sakit.slice(-4),
        izin: res.data.week.values.izin.slice(-4),
        alpha: res.data.week.values.alpha.slice(-4),
      };

      const currentYear = new Date().getFullYear();
      const monthLabels = res.data.month.labels;
      const monthValues = res.data.month.values;

      setData({
        user: res.data.user,
        week: { labels: weekLabels, values: weekValues },
        month: { labels: monthLabels, values: monthValues },
        year: currentYear,
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const screenWidth = Dimensions.get("window").width;

  if (loading || !data) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center bg-blue-600 px-4 py-4 shadow-md">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 mt-4">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold mt-4">
          Laporan Absensi User
        </Text>
      </View>

      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-2xl font-bold mb-4 mt-8 text-center">
          Statistik Absensi {data?.user?.name ?? ""}
        </Text>

        <View className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <Text className="text-lg font-semibold mb-2">Per 4 Minggu Terakhir</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
              } as any}
              width={Math.max(screenWidth, data.week.labels.length * 80)}
              height={240}
              bezier
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: () => "#000",
                labelColor: () => "#6b7280",
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
                propsForBackgroundLines: { stroke: "#e5e7eb" },
              }}
              style={{ borderRadius: 12 }}
            />
          </ScrollView>
          <Legend data={data.week.values} type="week" />
        </View>

        <View className="bg-white rounded-2xl shadow-md p-4">
          <Text className="text-lg font-semibold mb-2">
            Per Bulan (Tahun {data.year})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
              } as any}
              width={Math.max(screenWidth, data.month.labels.length * 80)}
              height={240}
              bezier
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: () => "#000",
                labelColor: () => "#6b7280",
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
                propsForBackgroundLines: { stroke: "#e5e7eb" },
              }}
              style={{ borderRadius: 12 }}
            />
          </ScrollView>
          <Legend data={data.month.values} type="month" />
        </View>
      </ScrollView>
    </View>
  );
}