import { Text, View } from "react-native";

export default function Legend({data, type}: {data: any, type: "week" | "month"}) {
  const items = [
    { label: "Hadir", val: data.hadir, color: "#22c55e" },
    { label: "Sakit", val: data.sakit, color: "#eab308" },
    { label: "Izin", val: data.izin, color: "#3b82f6" },
    { label: "Alpha", val: data.alpha, color: "#ef4444" },
  ];

  const total =
    (data.hadir?.reduce((a: number, b: number) => a + b, 0) ?? 0) +
    (data.sakit?.reduce((a: number, b: number) => a + b, 0) ?? 0) +
    (data.izin?.reduce((a: number, b: number) => a + b, 0) ?? 0) +
    (data.alpha?.reduce((a: number, b: number) => a + b, 0) ?? 0);

  return (
    <View className="flex-col mt-4">
      <View className="flex-row flex-wrap justify-center">
        {items.map((it, idx) => {
          const count = it.val?.reduce((a: number, b: number) => a + b, 0) ?? 0;
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
          return (
            <View key={idx} className="flex-row items-center mx-2 my-1">
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: it.color }} />
              <Text className="ml-2 text-gray-700 text-sm">
                {it.label}: {count} ({pct}%)
              </Text>
            </View>
          );
        })}
      </View>

      {type === "week" && (
        <Text className="text-center text-gray-500 mt-2 text-xs">
          Data mingguan diambil dari 4 minggu terakhir
        </Text>
      )}
      {type === "month" && (
        <Text className="text-center text-gray-500 mt-2 text-xs">
          Data bulanan diambil per tahun
        </Text>
      )}
    </View>
  );
}