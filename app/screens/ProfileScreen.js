import React from 'react';
import { View, Text, Image } from 'react-native';

const ProfileScreen = () => {
  const user = {
    name: 'Anil G',
    email: 'anil@example.com',
    avatar: 'https://i.pravatar.cc/300', // use any avatar URL or local image
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Image
        source={{ uri: user.avatar }}
        className="w-32 h-32 rounded-full mb-4"
      />
      <Text className="text-2xl font-bold mb-2">{user.name}</Text>
      <Text className="text-gray-600">{user.email}</Text>
    </View>
  );
};

export default ProfileScreen;
