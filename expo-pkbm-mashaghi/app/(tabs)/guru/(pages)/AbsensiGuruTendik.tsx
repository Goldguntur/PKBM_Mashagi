import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
  Dimensions,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import axios from "~/utils/axios";
import { SceneMap, TabView } from "react-native-tab-view";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const AbsensiList = ({ role }: { role: "guru" | "tenagaPendidik" }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/absensi-guru-tendik", {
        params: { role },
      });
      setData(res.data);
    } catch (err) {
      console.log("❌ Error fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAbsen = async (id: number, status: string) => {
    try {
      await axios.post("/absensi-guru-tendik", { user_id: id, status });
      alert(`✅ Absen (${status}) berhasil`);
      fetchData();
    } catch (err: any) {
      console.log("❌ Error absen:", err.response?.data || err);
      alert("Gagal absen");
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

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-lg font-semibold">{item.name}</Text>

          {item.status !== "belum absen" ? (
            <View className="mt-1 flex-row">
              <View className="">
              <Text className="text-gray-600 text-sm">{item.email}</Text>
              {item.jam_masuk && (
                <Text className="text-gray-600 text-sm">
                  Waktu Absensi: {item.jam_masuk}
                </Text>
              )}
              {item.jam_pulang && (
                <Text className="text-gray-600 text-sm">
                  Pulang: {item.jam_pulang}
                </Text>
              )}
              </View>
           <View className="flex-row  items-center justify-end flex-1">
             {item.status == "hadir" && (
                <Text className="text-green-600 text-lg font-bold">Hadir</Text>
              )}
              {item.status == "sakit" && (
                <Text className="text-yellow-600 text-lg font-bold">Sakit</Text>
              )}
              {item.status == "izin" && (
                <Text className="text-blue-600 text-lg font-bold">Izin</Text>
              )}
              {item.status == "alpha" && (
                <Text className="text-red-600 text-lg font-bold">Alpha</Text>
              )}
              </View>
              
            </View>
                 
          ) : (
            <View className="mt-1 flex-row justify-between">
              <View className="">
              <Text className="text-gray-600 text-sm">{item.email}</Text>
              </View>
            <View className="flex-row items-center justify-end mt-2">
              {["hadir", "izin", "sakit", "alpha"].map((status, idx) => {
                const colors = ["bg-green-500", "bg-blue-600", "bg-yellow-400", "bg-red-600"];
                const labels = ["H", "I", "S", "A"];
                return (
                  
                  <TouchableOpacity
                    key={status}
                    onPress={() =>
                      Alert.alert("Konfirmasi", `Apakah Anda yakin ingin absen ${status}?`, [
                        { text: "Ya", onPress: () => handleAbsen(item.id, status) },
                        { text: "Tidak", style: "cancel" },
                      ])
                    }
                    className={`${colors[idx]} px-4 py-2 rounded-lg mr-2`}
                  >
                    <Text className="text-white font-semibold">{labels[idx]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          )}
        </View>
      )}
    />
  );
};


const GuruRoute = () => <AbsensiList role="guru" />;

const TenagaPendidikRoute = () => <AbsensiList role="tenagaPendidik" />;

type Route = { key: string; title: string };
type CustomTabBarProps = {
  navigationState: { index: number; routes: Route[] };
  jumpTo: (key: string) => void;
  activeColor: string;
  inactiveColor: string;
};

const CustomTabBar = ({
  navigationState,
  jumpTo,
  activeColor,
  inactiveColor,
}: CustomTabBarProps) => {
  const width = Dimensions.get("window").width;
  const tabWidth = width / navigationState.routes.length;

  return (
    <View className="bg-white shadow-sm relative">
      <View className="flex-row">
        {navigationState.routes.map((route, i) => {
          const focused = navigationState.index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => jumpTo(route.key)}
              className="flex-1 items-center justify-center py-3"
            >
              <Text
                style={{
                  color: focused ? activeColor : inactiveColor,
                  fontWeight: focused ? "700" : "500",
                  fontSize: 16,
                }}
              >
                {route.title}
              </Text>
            </Pressable>
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
          backgroundColor: activeColor,
        }}
      />
    </View>
  );
};

export default function AbsensiGuruTendikScreen() {
  const layout = useWindowDimensions();

  const ACTIVE_COLOR = "#2563eb";
  const INACTIVE_COLOR = "#64748b";

  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: "guru", title: "Absensi Guru" },
    { key: "tenaga", title: "Tenaga Pendidik" },
  ]);

  const renderScene = SceneMap({
    guru: GuruRoute,
    tenaga: TenagaPendidikRoute,
  });

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center bg-blue-600 px-4 py-4 shadow-md elevation-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-2xl font-bold mt-2">Absensi</Text>
          <Text className="text-white text-sm">{today}</Text>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <CustomTabBar
            navigationState={props.navigationState}
            jumpTo={props.jumpTo}
            activeColor={ACTIVE_COLOR}
            inactiveColor={INACTIVE_COLOR}
          />
        )}
      />
    </View>
  );
}