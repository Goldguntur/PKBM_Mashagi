import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import CustomInput from "~/components/CustomInput";
import { register } from "~/lib/auth/authService"; 

export default function Register() {
  const [formData, setForm] = useState({
    email: "",
    password: "",
    role: "pesertaDidik",
    kelas: "",
    username: "",
    nisn: "",
    nik: "",
    number: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "pesertaDidik", label: "Peserta Didik" },
    { value: "guru", label: "Guru" },
    { value: "tenagaPendidik", label: "Tenaga Pendidik" },
  ];

  const [kelasList, setKelasList] = useState([
    { value: "paketA_faseA", label: "Paket A Fase A" },
    { value: "paketA_faseB", label: "Paket A Fase B" },
    { value: "paketA_faseC", label: "Paket A Fase C" },
    { value: "paketB_kelas7", label: "Paket B Kelas 7" },
    { value: "paketB_kelas8", label: "Paket B Kelas 8" },
    { value: "paketB_kelas9", label: "Paket B Kelas 9" },
    { value: "paketC_kelas10", label: "Paket C Kelas 10" },
    { value: "paketC_kelas11", label: "Paket C Kelas 11" },
    { value: "paketC_kelas12", label: "Paket C Kelas 12" },
  ]);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Email dan Password tidak boleh kosong");
      return;
    }

    if (!isValidEmail(formData.email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    if (formData.role === "pesertaDidik" && !formData.kelas) {
      Alert.alert("Error", "Silakan pilih kelas");
      return;
    }

    setLoading(true);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <View className="bg-blue-500 p-6 rounded-lg shadow-lg w-full max-w-md">
        <Text className="text-xl mb-4 text-white font-bold text-center">Register</Text>

        <CustomInput
          title="Email"
          placeholder="Masukkan email"
          value={formData.email}
          color="white"
          handleChangeText={(e) => setForm({ ...formData, email: e })}
        />
        <CustomInput
          title="Number"
          placeholder="Masukkan Number"
          value={formData.number}
          color="white"
          handleChangeText={(e) => setForm({ ...formData, number: e })}
        />
        <CustomInput
          title="Username"
          placeholder="Masukkan Username"
          value={formData.username}
          color="white"
          handleChangeText={(e) => setForm({ ...formData, username: e })}
        />

        <CustomInput
          title="Nama"
          placeholder="Masukkan Nama Lengkap"
          value={formData.name}
          color="white"
          handleChangeText={(e) => setForm({ ...formData, name: e })}

        />

        <CustomInput
          title="Password"
          placeholder="Masukkan password"
          value={formData.password}
          color="white"
          handleChangeText={(e) => setForm({ ...formData, password: e })}

        />

{formData.role === "pesertaDidik" && (
          <CustomInput
            title="NISN"
            placeholder="Masukkan NISN"
            value={formData.nisn}
            color="white"
            handleChangeText={(e) => setForm({ ...formData, nisn: e })}
          />
        )}

        {formData.role !== "pesertaDidik" && (
          <CustomInput
            title="NIK"
            placeholder="Masukkan NIK"
            value={formData.nik}
            color="white"
            handleChangeText={(e) => setForm({ ...formData, nik: e })}
          />
        )}

        <Text className="text-white mb-1">Role</Text>
        <View className="bg-white rounded mb-4 overflow-hidden">
          <Picker
            selectedValue={formData.role}
            onValueChange={(val) => {
              setForm({ ...formData, role: val });
              if (val !== "pesertaDidik") setKelasList([]); 
            }}
            style={{ backgroundColor: "#e3f2fd", color: "#1565c0", fontWeight: "bold" }}
          >
            {roles.map((r) => (
              <Picker.Item key={r.value} label={r.label} value={r.value} />
            ))}
          </Picker>
        </View>

        

        {formData.role === "pesertaDidik" && (
          <>
            <Text className="text-white mb-1">Kelas</Text>
            <View className="bg-white rounded mb-4 overflow-hidden">
              <Picker
                selectedValue={kelasList}
                onValueChange={setKelasList}
                style={{ backgroundColor: "#e3f2fd", color: "#1565c0", fontWeight: "bold" }}
              >
                <Picker.Item label="Pilih Kelas" value="" />
                {kelasList.map((k) => (
                  <Picker.Item key={k.value} label={k.label} value={k.value} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <TouchableOpacity
          className={`bg-white rounded p-2 ${loading ? "opacity-50" : ""}`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1565c0" />
          ) : (
            <Text className="text-blue-500 text-center font-bold">Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}