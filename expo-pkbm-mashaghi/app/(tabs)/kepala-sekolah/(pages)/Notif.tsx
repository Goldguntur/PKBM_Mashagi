import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "~/utils/axios";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FormPengumuman() {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();


  const handleSubmit = async () => {
    if (!judul || !deskripsi) {
      Alert.alert("Error", "Judul dan Deskripsi wajib diisi!");
      return;
    }

    try {
      await axios.post("/pengumuman", {
        judul,
        deskripsi,
        tanggal: tanggal.toISOString().split("T")[0],
      });

      Alert.alert("Sukses", "Pengumuman berhasil dibuat!");
      setJudul("");
      setDeskripsi("");
      setTanggal(new Date());
    } catch (error: unknown) {
      const err = error as {
        message: string | undefined; response?: { data: { message: string } } 
};
      console.log("Pengumuman error:", err?.response?.data?.message || err?.message);
      Alert.alert(
        "Gagal",
        err?.response?.data?.message || "Terjadi kesalahan"
      );
    }
  };

  return (
    <View className="bg-white h-full">
      <View className="flex-row items-center mt-4 p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity> 
        <View className="flex-1 justify-center">
          <Text className="text-xl text-center font-bold mr-4 text-black">Buat Pengumuman</Text>  
        </View>
      </View>
    <View className=" bg-white p-4">
      <Text className="text-lg font-bold mt-2">Judul Pengumuman</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mt-1"
        placeholder="Masukkan judul"
        value={judul}
        onChangeText={setJudul}
      />

      <Text className="text-lg font-bold mt-3">Deskripsi</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mt-1 h-24 text-top"
        placeholder="Tulis deskripsi..."
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
      />

      <Text className="text-lg font-bold mt-3">Tanggal</Text>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-3 mt-1 bg-gray-100"
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{tanggal.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={tanggal}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setTanggal(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mt-5"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold text-center">
          Kirim Pengumuman
        </Text>
      </TouchableOpacity>
    </View>
    </View>

  );
}