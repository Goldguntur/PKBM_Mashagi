import React, { useState, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchNotif, Notification } from "~/lib/notif/notifService";
import { eventBus } from "~/utils/eventBus";
import { Svg, Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function NotifScreen() {
  const [data, setData] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = useCallback(async () => {
    const { list } = await fetchNotif(true);
    setData(list);
    eventBus.emit("badgeUpdated");
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const truncateText = (text: string, limit: number) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    fetch(`/api/pengumuman/${id}`, { method: "DELETE" });
  };

  return (
    <ScrollView
      className="p-4 bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className=" text-2xl font-semibold text-center mt-8">Notifikasi</Text>
      <Text className="mb-4 text-xs text-center font-thin opacity-60">Notifikasi akan hilang setelah 14 hari</Text>
      {data.map((item) => (
        <Animated.View
          key={item.id}
          entering={ZoomIn.springify().damping(15)}
          exiting={ZoomOut}
          className="relative my-4 rounded-2xl overflow-hidden shadow-xl"
        >
          <LinearGradient
            colors={["#93c1f9", "#93c5fd", "#ffffff"]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.5, 1]} 
            className="rounded-2xl"
          >
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.05)" }}
              onPress={() =>
                router.push({
                  pathname: "/kepala-sekolah/notifikasi/[id]",
                  params: { id: String(item.id) },
                })
              }
              className="flex-row p-4"
            >
              <Svg height="96" width="24">
                <Path
                  d="M 8 0 Q 4 4.8, 8 9.6 T 8 19.2 Q 4 24, 8 28.8 T 8 38.4 Q 4 43.2, 8 48 T 8 57.6 Q 4 62.4, 8 67.2 T 8 76.8 Q 4 81.6, 8 86.4 T 8 96 L 0 96 L 0 0 Z"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                />
              </Svg>

              <View className="mx-3 flex-1">
                <Text
                  className="text-2xl font-bold text-blue-600"
                  numberOfLines={1}
                >
                  {item.judul}
                </Text>
                <Text className="text-sm font-bold text-white mt-1">
                  {item.tanggal}
                </Text>
                <Text className="text-lg text-gray-600 mt-1">
                  {truncateText(item.deskripsi, 40)}
                </Text>
              </View>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      ))}
    </ScrollView>
  );
}