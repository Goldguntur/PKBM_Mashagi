import React, { useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Pressable, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const GuruRoute = () => (
  <View className="flex-1 bg-white justify-center items-center">
    <Text className="text-lg font-bold">Konten Absensi Guru</Text>
  </View>
);

const TenagaPendidikRoute = () => (
  <View className="flex-1 bg-white justify-center items-center">
    <Text className="text-lg font-bold">Konten Tenaga Pendidik</Text>
  </View>
);

type Route = { key: string; title: string };
type CustomTabBarProps = {
  navigationState: { index: number; routes: Route[] };
  jumpTo: (key: string) => void;
  activeColor: string;
  inactiveColor: string;
};

const CustomTabBar = ({ navigationState, jumpTo, activeColor, inactiveColor }: CustomTabBarProps) => {
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
                  color: focused ? activeColor : inactiveColor, // << ganti warna judul tab di sini
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

export default function AbsensiScreen() {
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

  return (
    <View className="flex-1 bg-white">

      <View className="flex-row items-center bg-blue-600 px-4 py-3 shadow-md elevation-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Absensi</Text>
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