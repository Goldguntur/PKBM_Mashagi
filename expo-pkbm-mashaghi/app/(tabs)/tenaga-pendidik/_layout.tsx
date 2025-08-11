import { Tabs } from "expo-router"
import { View } from "react-native"

const _Layout = () => {
  return (
   <Tabs>
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="notif" options={{ title: "Notifications" }} />
        <Tabs.Screen name="user" options={{ title: "User Profile" }} />
   </Tabs>   
  )
}

export default _Layout
