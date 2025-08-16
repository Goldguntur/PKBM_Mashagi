import { Tabs, useFocusEffect } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { fetchNotif } from "~/lib/notif/notifService";
import { eventBus } from "~/utils/eventBus";

const POLLING_MS = 15000; // 15 detik

export default function Layout() {
  const [badgeCount, setBadgeCount] = useState(0);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const updateBadge = useCallback(async () => {
    try {
      const { unread } = await fetchNotif(); 
      if (isMounted.current) setBadgeCount(unread);
    } catch (e) {
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      updateBadge();
    }, [updateBadge])
  );

  useEffect(() => {
    isMounted.current = true;
    updateBadge();

    pollingRef.current = setInterval(updateBadge, POLLING_MS);

    eventBus.on("badgeUpdated", updateBadge);

    const sub = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        updateBadge();
      }
      appState.current = nextState;
    });

    return () => {
      isMounted.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
      eventBus.off("badgeUpdated", updateBadge);
      sub.remove();
    };
  }, [updateBadge]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#42a5f5",
        tabBarInactiveTintColor: "#b0bec5",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notif"
        options={{
          title: "Notif",
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          tabBarIcon: ({ color }) => <FontAwesome name="bell" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "User",
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}