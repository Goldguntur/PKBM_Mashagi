import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchNotif, Notification } from "~/lib/notif/notifService";
import { eventBus } from "~/utils/eventBus";

export default function NotifScreen() {
  const [data, setData] = useState<Notification[]>([]);

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

  const truncateText = (text: string, limit: number) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  return (
    <ScrollView className="p-4 bg-white">
      {data.map((item) => (
        <View key={item.id} className="bg-gray-100 p-4 mb-3 rounded-xl">
          <Text className="text-lg font-bold">{item.judul}</Text>
          <Text className="text-sm text-gray-500">{item.tanggal}</Text>
          <Text className="mt-2">{truncateText(item.deskripsi, 50)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}