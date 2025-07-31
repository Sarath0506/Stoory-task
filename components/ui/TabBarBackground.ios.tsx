import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function BlurTabBarBackground() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        intensity={80}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.border, { borderTopColor: 'rgba(0,0,0,0.1)' }]} />
    </View>
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}

const styles = StyleSheet.create({
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
});
