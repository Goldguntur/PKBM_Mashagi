import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchNotif, Notification } from "~/lib/notif/notifService";
import { eventBus } from "~/utils/eventBus";

import {Svg, Path} from 'react-native-svg';


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
        <View key={item.id} className=" z-50 my-4 flex-row w-full h-24 overflow-hidden bg-white shadow-md">
          <Svg height="96" width="24">
            <Path
              d="M 8 0 Q 4 4.8, 8 9.6 T 8 19.2 Q 4 24, 8 28.8 T 8 38.4 Q 4 43.2, 8 48 T 8 57.6 Q 4 62.4, 8 67.2 T 8 76.8 Q 4 81.6, 8 86.4 T 8 96 L 0 96 L 0 0 Z"
              strokeLinecap="round"
              strokeWidth="2"
              stroke="blue"
              fill="blue"
            />
          </Svg>
          <View className="mx-3 flex-1">
            <Text className="mt-1.5 text-2xl font-bold text-blue-500 leading-6 h-6 overflow-hidden" numberOfLines={1}>
              {item.judul}
            </Text>
            <Text className="overflow-hidden text-sm leading-5 text-zinc-400 h-10">
              {item.tanggal}
            </Text>
            <Text className="overflow-hidden leading-5 text-zinc-400 h-10">
              {truncateText(item.deskripsi, 20)}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}