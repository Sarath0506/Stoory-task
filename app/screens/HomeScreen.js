// app/screens/HomeScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import Navbar from '../components/Navbar';

const HomeScreen = () => {
  return (
    <View className="flex-1">
      <Navbar />
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold">Welcome to the E-commerce App</Text>
      </View>
    </View>
  );
};

export default HomeScreen;
