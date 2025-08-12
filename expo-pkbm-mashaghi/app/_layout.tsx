import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { Stack } from 'expo-router';
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return ( 
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
  </Stack>
  </SafeAreaProvider>
  </GestureHandlerRootView>
  )
}
