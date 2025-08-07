import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Link } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pesertaDidik");
  const roles = ["pesertaDidik", "guru", "tenagaPendidik", "kepalaSekolah"];

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Validasi Gagal", "Email dan password wajib diisi.");
    }

    try {
      const res = await axios.post(" https://6a263bf06c90.ngrok-free.app/api/login", {
        email,
        password,
        role, 
      });

      const { token, user } = res.data;

      Alert.alert("Login berhasil", `Selamat datang, ${user.username}! (${user.role})`);
      
      console.log("Role:", user.role);
    } catch (err) {
        if (axios.isAxiosError(err)) {
      console.log(err.response?.data || err.message);
      Alert.alert("Login Gagal", "Periksa kembali email dan password Anda.");
    }
  };
}

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <View className="bg-blue-500 p-6 rounded-lg shadow-lg w-full max-w-md">
        <Text className="text-xl mb-4 text-white font-bold text-center">Login</Text>

        <Text className="text-white mb-1">Email</Text>
        <TextInput
          className="bg-white p-2 rounded mb-3"
          placeholder="Masukkan email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text className="text-white mb-1">Password</Text>
        <TextInput
          className="bg-white p-2 rounded mb-3"
          placeholder="Masukkan password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text className="text-white mb-1">Role</Text>
        <View className="bg-white rounded mb-4 overflow-hidden">
          <Picker
            selectedValue={role}
            onValueChange={setRole}
            style={{
              backgroundColor: "#e3f2fd",
              color: "#1565c0",
              fontWeight: "bold",
            }}
          >
            {roles.map((r) => (
              <Picker.Item
                key={r}
                label={r.charAt(0) + r.slice(1)}
                value={r}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          className="bg-white rounded p-2"
          onPress={handleLogin}
        >
          <Text className="text-blue-500 text-center font-bold">Login</Text>
        </TouchableOpacity>
      </View>

        <View className="mt-4 flex flex-row">
        <Text className="text-gray-500 mx-1 text-center">
          Belum punya akun?
        </Text>
        <Link href={{ pathname: '/register', params: { name: 'Dan' } }}>
           Daftar sekarang
        </Link>
        </View>
    </View>
  );
}
