import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
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

  if (loading) return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
      <Text>Memuat {role}...</Text>
    </View>
  );

  if (!users.length) return (
    <View className="flex-1 items-center justify-center">
      <Text>Tidak ada data {role}</Text>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={users}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="p-4 mb-3 rounded-xl bg-blue-500"
          onPress={() =>
            router.push({
            pathname: "/kepala-sekolah/mutasi/[id]",
            params: { id: String(item.id) },
     })
     }
    >
      <Text className="text-lg font-semibold text-white">{item.name}</Text>
       <Text className="text-white">{item.email}</Text>
     <Text className="text-xs text-white mt-1">Role: {item.role}</Text>
</TouchableOpacity>
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
      case "murid": return <ListPerRole role="pesertaDidik" />;
      case "guru": return <ListPerRole role="guru" />;
      case "tendik": return <ListPerRole role="tenagaPendidik" />;
      default: return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center bg-white px-4 py-3 shadow-md elevation-sm">
        <TouchableOpacity onPress={() => router.back()} className="mt-3">
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-2xl mt-3 pr-4 font-bold">Mutasi</Text>
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
          inactiveColor="#64748b"
          indicatorStyle={{ backgroundColor: "#2563eb",  height: 3, borderRadius: 999 }}
          style={{ backgroundColor: "#fff" }}
        />
      )}
      />
      </View>
    );
}