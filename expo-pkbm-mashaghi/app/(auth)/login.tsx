import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { login } from "~/lib/auth/authService";
import { router } from "expo-router";
import CustomInput from "~/components/CustomInput";
import { getUserToken, getUserRole } from "~/lib/auth/authStorage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pesertaDidik");
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "pesertaDidik", label: "Peserta Didik" },
    { value: "guru", label: "Guru" },
    { value: "tenagaPendidik", label: "Tenaga Pendidik" },
    { value: "kepalaSekolah", label: "Kepala Sekolah" },
  ];

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getUserToken();
        const role = await getUserRole();

        if (token && role) {
          if (role === "kepalaSekolah") {
            router.replace("../(tabs)/kepala-sekolah/(tabs)/home");
          } else if (role === "guru") {
            router.replace("../guru/home");
          } else if (role === "pesertaDidik") {
            router.replace("../murid/home");
          } else if (role === "tenagaPendidik") {
            router.replace("../tenaga-pendidik/home");
          }
        }
      } catch (error) {
        Alert.alert("Error", "Error checking login status");
      }
    };

    checkLoginStatus();
  }, []);

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan Password tidak boleh kosong");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password, role);
      console.log(email, password, role, user);
      if (user.role === "kepalaSekolah") {
        router.replace("../kepala-sekolah/home");
      } else if (user.role === "guru") {
        router.replace("../guru/home");
      } else if (user.role === "pesertaDidik") {
        router.replace("../murid/home");
      } else if (user.role === "tenagaPendidik") {
        router.replace("../tenaga-pendidik/home");
      }
    } catch (err: any) {
      Alert.alert("Login Gagal", err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <View className="bg-blue-500 p-6 rounded-lg shadow-lg w-full max-w-md">
        <Text className="text-xl mb-4 text-white font-bold text-center">Login</Text>

        <CustomInput
          title="Email"
          placeholder="Masukkan email"
          value={email}
          color="white"
          handleChangeText={setEmail}
        />

        <CustomInput
          title="Password"
          placeholder="Masukkan password"
          value={password}
          color="white"
          handleChangeText={setPassword}
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
              <Picker.Item key={r.value} label={r.label} value={r.value} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          className={`bg-white rounded p-2 ${loading ? "opacity-50" : ""}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1565c0" />
          ) : (
            <Text className="text-blue-500 text-center font-bold">Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

