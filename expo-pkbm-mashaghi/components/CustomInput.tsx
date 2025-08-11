import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import Entypo from '@expo/vector-icons/Entypo';

interface CustomInputProps {
  title: string;
  value: string;
  placeholder: string;
  color?: string;
  handleChangeText: (text: string) => void;
  [props: string]: any;
}

const CustomInput = ({
  title,
  value,
  placeholder,
  color,
  handleChangeText,
  ...props
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="space-y-2 w-[90%]">
      <Text
        className={`text-base  font-medium text-${color} mb-1`}
      >
        {title}
      </Text>

      <View
        className={`w-full h-16 px-4 bg-${color} 
        } rounded-2xl border-2 border-black-200  flex flex-row items-center`}
      >
        <TextInput
          className={`flex-1 font-montserrat font-psemibold text-base text-black  border-${color} `}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Entypo
              name={showPassword ? "eye" : "eye-with-line"}
              size={24}
              color="#A9A9A9"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;