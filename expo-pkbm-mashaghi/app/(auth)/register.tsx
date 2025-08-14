import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import CustomInput from "~/components/CustomInput";
import { register } from "~/lib/auth/authService";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Register() {
  const router = useRouter();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("pesertaDidik");
  const [kelas, setKelas] = useState("");
  const [username, setUsername] = useState("");
  const [nisn, setNisn] = useState("");
  const [nik, setNik] = useState("");
  const [no_wa, setNoWa] = useState("");
  const [name, setName] = useState("");
  const [tanggal_lahir, setTanggalLahir] = useState(new Date());

  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "pesertaDidik", label: "Peserta Didik" },
    { value: "guru", label: "Guru" },
    { value: "tenagaPendidik", label: "Tenaga Pendidik" },
  ];

  const kelasList = [
    { value: "paketA_faseA", label: "Paket A Fase A" },
    { value: "paketA_faseB", label: "Paket A Fase B" },
    { value: "paketA_faseC", label: "Paket A Fase C" },
    { value: "paketB_kelas7", label: "Paket B Kelas 7" },
    { value: "paketB_kelas8", label: "Paket B Kelas 8" },
    { value: "paketB_kelas9", label: "Paket B Kelas 9" },
    { value: "paketC_kelas10", label: "Paket C Kelas 10" },
    { value: "paketC_kelas11", label: "Paket C Kelas 11" },
    { value: "paketC_kelas12", label: "Paket C Kelas 12" },
  ];

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan Password tidak boleh kosong");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    if (role === "pesertaDidik" && !kelas) {
      Alert.alert("Error", "Silakan pilih kelas");
      return;
    }

    setLoading(true);
    try {
      if (role === "pesertaDidik") {
        setNik("");
      } else {
        setNisn("");
      }
      await register(
        email,
        password,
        username,
        role,
        kelas,
        nisn,
        nik,
        no_wa,
        name,
        password_confirmation,
        tanggal_lahir.toISOString().split("T")[0]
      );
      setTanggalLahir(new Date());
      Alert.alert("Success", "Register berhasil");
    } catch (err: any) {
      Alert.alert("Error", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View
        className="absolute top-0 bg-fuchsia-50 left-0 right-0 z-10 pt-4"
        pointerEvents="none"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-16"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-blue-500 p-6 rounded-lg shadow-lg w-full max-w-md mb-4">
          <Text className="text-xl mb-4 text-white font-bold text-center">
            Register
          </Text>

          <CustomInput
            title="Email"
            placeholder="Masukkan email"
            value={email}
            color="white"
            handleChangeText={(e) => setEmail(e)}
          />
          <CustomInput
            title="Nomor"
            placeholder="Masukkan Nomor hp kamu"
            phoneNumber
            value={no_wa}
            color="white"
            handleChangeText={(e) => setNoWa(e)}
          />
          <CustomInput
            title="Username"
            placeholder="Masukkan Username"
            value={username}
            color="white"
            handleChangeText={(e) => setUsername(e)}
          />
          <CustomInput
            title="Nama"
            placeholder="Masukkan Nama Lengkap"
            value={name}
            color="white"
            handleChangeText={(e) => setName(e)}
          />

          <Text className="text-white">Tanggal Lahir</Text>
          <TouchableOpacity
            className="flex  justify-between bg-gray-100 border border-gray-300 rounded-lg p-3 mt-1"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-500">
              {tanggal_lahir.toDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={tanggal_lahir}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setTanggalLahir(selectedDate);
              }}
            />
          )}
          <CustomInput
            title="Password"
            placeholder="Masukkan password"
            value={password}
            color="white"
            handleChangeText={(e) => setPassword(e)}
          />

          <CustomInput
            title="Confirm Password"
            placeholder="Masukkan Konfirmasi password"
            value={password_confirmation}
            color="white"
            handleChangeText={(e) => setPasswordConfirmation(e)}
          />

          {role === "pesertaDidik" && (
            <CustomInput
              title="NISN"
              placeholder="Masukkan NISN"
              value={nisn}
              color="white"
              handleChangeText={(e) => setNisn(e)}
            />
          )}

          {role !== "pesertaDidik" && (
            <CustomInput
              title="NIK"
              placeholder="Masukkan NIK"
              value={nik}
              color="white"
              handleChangeText={(e) => setNik(e)}
            />
          )}

          <Text className="text-white mb-1">Role</Text>
          <View className="bg-white rounded mb-4 overflow-hidden">
            <Picker
              selectedValue={role}
              onValueChange={(val) => {
                setRole(val);
              }}
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

          {role === "pesertaDidik" && (
            <>
              <Text className="text-white mb-1">Kelas</Text>
              <View className="bg-white rounded mb-4 overflow-hidden">
                <Picker
                  selectedValue={kelas}
                  onValueChange={(val) => setKelas(val)}
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1565c0",
                    fontWeight: "bold",
                  }}
                >
                  <Picker.Item label="Pilih Kelas" value="" />
                  {kelasList.map((k) => (
                    <Picker.Item
                      key={k.value}
                      label={k.label}
                      value={k.value}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Button */}
          <TouchableOpacity
            className={`bg-white rounded p-2 ${loading ? "opacity-50" : ""}`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1565c0" />
            ) : (
              <Text className="text-blue-500 text-center font-bold">
                Register
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
