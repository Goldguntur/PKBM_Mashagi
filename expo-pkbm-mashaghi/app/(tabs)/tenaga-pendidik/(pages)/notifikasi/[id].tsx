import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import axios from "~/utils/axios";



const Notifikasi = () => {
 
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter()

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/pengumuman/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

  return (
    <View>
            <View className="flex-row items-center bg-blue-600 px-4 py-4 shadow-md">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3 mt-4">
                      <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold mt-4">
                      Pengumuman 
                    </Text>
                  </View>
            <ScrollView>
                    <View className='items-center '>
                       <Text className='text-center font-semibold text-3xl mt-8'>
                        {data?.judul}
                       </Text>
                       <Text className='text-center font-light opacity-75 text-sm mt-1'>
                        untuk tanggal: {data?.tanggal}
                       </Text>
                    </View>
                       <Text className='m-4 text-lg'>
                        {data?.deskripsi}
                       </Text>
            </ScrollView>
    </View>
  )
}

export default Notifikasi
