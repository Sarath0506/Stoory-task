// app/components/Navbar.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View className="bg-blue-500 p-4 flex-row justify-between items-center">
      <Text className="text-white text-lg font-bold">ShopNow</Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-white">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;
