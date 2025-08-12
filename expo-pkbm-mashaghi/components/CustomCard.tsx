import React from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image';
import Button from './Button';
import ExploreButton from './Button';
import { useRouter } from 'expo-router';


interface CustomCardProps {
  title: string;
  imageUrl?: () => any; 
  description: string;
  link?: string;
  onPress?: () => void; 
}

const Card = ({ title, imageUrl, description, link, onPress }: CustomCardProps) => {
const router = useRouter();

const submit = () => {
  if (link) {
    router.push(link as any);
  } else if (onPress) {
    onPress();
  }
} 
  return (
    <View className="bg-white w-[85%] overflow-hidden p-4 rounded-lg shadow-md mb-4">
      <View className="items-center">
        <Image
          source={imageUrl ? imageUrl() : require('@/assets/images/absen.jpeg')}
          style={{ width: 250, height: 120 }}
        />
      </View>
      <View className="p-2 flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-bold text-2xl">{title}</Text>
          <Text className="font-extralight text-sm flex-wrap opacity-60">
            {description}
          </Text>
        </View>
        <View>
          <ExploreButton handlePress={submit} /> 
        </View>
      </View>
    </View>
  );
};

export default Card;