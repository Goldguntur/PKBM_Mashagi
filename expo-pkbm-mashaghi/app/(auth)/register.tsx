import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import CustomInput from "~/components/CustomInput";
import { register } from "~/lib/auth/authService";
import axios from "~/utils/axios";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MultiSelect } from "react-native-element-dropdown";

export default function Register() {
  const router = useRouter();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("pesertaDidik");

  const [kelas, setKelas] = useState(""); 
  const [mapel, setMapel] = useState<any[]>([]); // multi select array

  const [username, setUsername] = useState("");
  const [nisn, setNisn] = useState("");
  const [nik, setNik] = useState("");
  const [noWa, setNoWa] = useState("");
  const [name, setName] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [mapelList, setMapelList] = useState<{ value: any; label: any }[]>([]);

  const roles = [
    { value: "pesertaDidik", label: "Peserta Didik" },
    { value: "guru", label: "Guru" },
    { value: "tenagaPendidik", label: "Tenaga Pendidik" },
    { value: "kepalaSekolah", label: "Kepala Sekolah" },
  ];

  const kelasList = [
    { value: "1", label: "Paket A Fase A" },
    { value: "2", label: "Paket A Fase B" },
    { value: "3", label: "Paket A Fase C" },
    { value: "4", label: "Paket B Kelas 7" },
    { value: "5", label: "Paket B Kelas 8" },
    { value: "6", label: "Paket B Kelas 9" },
    { value: "7", label: "Paket C Kelas 10" },
    { value: "8", label: "Paket C Kelas 11" },
    { value: "9", label: "Paket C Kelas 12" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/mapel");
        const items = Array.isArray(res.data) ? res.data : [];
        setMapelList(
          items.map((m: any) => ({
            value: m.id,
            label: m.nama_mapel,
          }))
        );
      } catch (e: any) {
        console.log("Fetch mapel gagal:", e?.response?.data || e?.message);
        Alert.alert("Gagal memuat Mapel", "Silakan coba lagi.");
      }
    })();
  }, []);

  const isValidEmail = (x: string) => /\S+@\S+\.\S+/.test(x);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan Password wajib diisi");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Password dan konfirmasi tidak sama");
      return;
    }
    if (role === "pesertaDidik" && !kelas) {
      Alert.alert("Error", "Silakan pilih kelas");
      return;
    }
    if (role === "guru" && (!mapel || mapel.length === 0)) {
      Alert.alert("Error", "Silakan pilih mata pelajaran");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        email,
        password,
        password_confirmation: passwordConfirmation,
        username,
        role,
        kelas_id: role === "pesertaDidik" ? kelas : null,
        mapel_ids: role === "guru" ? mapel : null, // array mapel
        nisn: role === "pesertaDidik" ? nisn : null,
        nik: role !== "pesertaDidik" ? nik : null,
        no_wa: noWa,
        name,
        tanggal_lahir: tanggalLahir.toISOString().split("T")[0],
      };

      console.log("Register payload:", payload);

      await register(payload);

      Alert.alert("Berhasil", "Registrasi berhasil.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const data = err?.response?.data || {};
      const msg =
        data?.message ||
        (typeof err?.message === "string" ? err.message : "Gagal registrasi");
      const details = data?.errors
        ? Object.entries(data.errors)
            .map(([k, v]) => `${k}: ${(Array.isArray(v) ? v.join(", ") : v)}`)
            .join("\n")
        : "";
      Alert.alert("Error", [msg, details].filter(Boolean).join("\n"));
      console.log("Register error raw:", data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="absolute top-0 left-0 right-0 z-10 pt-4 px-4">
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
            handleChangeText={setEmail}
          />
          <CustomInput
            title="Nomor WA"
            placeholder="Masukkan nomor WhatsApp"
            value={noWa}
            color="white"
            handleChangeText={setNoWa}
            phoneNumber
          />
          <CustomInput
            title="Username"
            placeholder="Masukkan Username"
            value={username}
            color="white"
            handleChangeText={setUsername}
          />
          <CustomInput
            title="Nama Lengkap"
            placeholder="Masukkan Nama"
            value={name}
            color="white"
            handleChangeText={setName}
          />

          <Text className="text-white">Tanggal Lahir</Text>
          <TouchableOpacity
            className="bg-gray-100 border border-gray-300 rounded-lg p-3 mt-1"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-500">{tanggalLahir.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={tanggalLahir}
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
            handleChangeText={setPassword}
          />
          <CustomInput
            title="Konfirmasi Password"
            placeholder="Ulangi password"
            value={passwordConfirmation}
            color="white"
            handleChangeText={setPasswordConfirmation}
          />

          <Text className="text-white mb-1">Role</Text>
          <View className="bg-white rounded mb-4 overflow-hidden">
            <Picker
              selectedValue={role}
              onValueChange={(v) => {
                setRole(v);
                if (v !== "guru") setMapel([]); // reset mapel saat ganti role
              }}
            >
              {roles.map((r) => (
                <Picker.Item key={r.value} label={r.label} value={r.value} />
              ))}
            </Picker>
          </View>

          {role === "pesertaDidik" ? (
            <CustomInput
              title="NISN"
              placeholder="Masukkan NISN"
              value={nisn}
              color="white"
              handleChangeText={setNisn}
            />
          ) : (
            <CustomInput
              title="NIK"
              placeholder="Masukkan NIK"
              value={nik}
              color="white"
              handleChangeText={setNik}
            />
          )}


          {role === "pesertaDidik" && (
            <>
              <Text className="text-white mb-1">Kelas</Text>
              <View className="bg-white rounded mb-4 overflow-hidden">
                <Picker selectedValue={kelas} onValueChange={setKelas}>
                  <Picker.Item label="Pilih Kelas" value="" />
                  {kelasList.map((k) => (
                    <Picker.Item key={k.value} label={k.label} value={k.value} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {role === "guru" && (
            <>
              <Text className="text-white mb-1">Mata Pelajaran</Text>
              <MultiSelect
                style={{
                  borderWidth: 1,
                  borderColor: "white",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "white",
                  marginBottom: 16,
                }}
                data={mapelList}
                labelField="label"
                valueField="value"
                placeholder="Pilih Mata Pelajaran"
                value={mapel}
                onChange={(items) => setMapel(items)}
                selectedStyle={{ backgroundColor: "#ffffff",  borderRadius: 8 }}
              />
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