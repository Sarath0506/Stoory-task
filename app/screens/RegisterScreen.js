import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert('Please fill all fields');
    } else {
      Alert.alert('Registered Successfully');
      // you can also use navigation.navigate('Login');
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">Register</Text>

      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        className="border border-gray-300 p-3 mb-6 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-blue-600 py-3 rounded"
        onPress={handleRegister}
      >
        <Text className="text-white text-center text-lg">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
