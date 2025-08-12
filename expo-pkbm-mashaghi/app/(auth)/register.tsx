import { Text, View } from "react-native";

export default function Register() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Register Screen</Text>
        <Text className="text-gray-500 mt-2">This is where you can register a new account.</Text>
        <Text className="text-gray-500 mt-2">Please fill in your details to create an account.</Text>
        <Text className="text-gray-500 mt-2">Make sure to remember your credentials for future logins.</Text>
     </View>
  );
}   