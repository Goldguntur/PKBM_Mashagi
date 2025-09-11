import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useRouter } from "expo-router";
import { fetchUsersByRole, RoleKey, User } from "~/lib/services/userService";
import { AntDesign } from "@expo/vector-icons";

function ListPerRole({ role }: { role: RoleKey }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchUsersByRole(role);
        setUsers(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [role]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600">Memuat {role}...</Text>
      </View>
    );

  if (!users.length)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Tidak ada data {role}</Text>
      </View>
    );

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={users}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Pressable
          className="p-4 mb-4 rounded-2xl bg-blue-500 shadow-md active:opacity-80"
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
          onPress={() =>
                   router.push({
                     pathname: "/kepala-sekolah/mutasi/[id]",
                     params: { id: String(item.id) },
                   })
          }  
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-white">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-100">{item.email}</Text>
              <Text className="text-xs text-blue-100 mt-1">
                Role: {item.role}
              </Text>
            </View>
            <AntDesign name="rightcircle" size={22} color="white" />
          </View>
        </Pressable>
      )}
    />
  );
}

export default function MutasiScreen() {
  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "murid", title: "Murid" },
    { key: "guru", title: "Guru" },
    { key: "tendik", title: "Tenaga Pendidik" },
  ]);
  const router = useRouter();

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "murid":
        return <ListPerRole role="pesertaDidik" />;
      case "guru":
        return <ListPerRole role="guru" />;
      case "tendik":
        return <ListPerRole role="tenagaPendidik" />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center bg-white px-4 py-3 shadow-md">
        <Pressable
          onPress={() => router.back()}
          android_ripple={{ color: "#e5e7eb", borderless: true }}
          className="p-2 mt-4"
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <View className="flex-1 items-center pr-8 mt-4">
          <Text className="text-xl font-bold text-gray-800">Mutasi</Text>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor="#2563eb"
            inactiveColor="#94a3b8"
            indicatorStyle={{
              backgroundColor: "#2563eb",
              height: 3,
              borderRadius: 999,
            }}
            style={{ backgroundColor: "#fff", elevation: 2 }}
          />
        )}
      />
    </View>
  );
}