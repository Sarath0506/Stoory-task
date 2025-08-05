import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { useUser } from '@/contexts/UserContext';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  //icon: string;
  action: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, isLoggedIn, logout } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.push('/auth/login');
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: 'View your order history',
      action: () => {
        Alert.alert('My Orders', 
          'Order History:\n\n' +
          '1. iPhone 15 Pro - ₹999 (Delivered)\n' +
          '2. Nike Air Max 270 - ₹300 (In Transit)\n' +
          '3. MacBook Air M3 - ₹2,398 (Processing)\n\n' +
          'Total Orders: 12\n' +
          'Total Spent: ₹45,678'
        );
      },
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      subtitle: 'Your saved items',
      action: () => {
        Alert.alert('Wishlist', 
          'Saved Items:\n\n' +
          '1. Samsung Galaxy S24 - ₹899\n' +
          '2. Sony WH-1000XM5 - ₹1,299\n' +
          '3. Apple Watch Series 9 - ₹799\n' +
          '4. iPad Pro 12.9" - ₹1,599\n\n' +
          'Total Items: 8'
        );
      },
    },
    {
      id: 'addresses',
      title: 'Shipping Addresses',
      subtitle: 'Manage your addresses',
      action: () => {
        Alert.alert('Shipping Addresses', 
          'Saved Addresses:\n\n' +
          'Home:\n' +
          '123 Main Street, Apartment 4B\n' +
          'velachery, chennai 400001\n\n' +
          'Office:\n' +
          '456 Business Park, Floor 12\n' +
          'Bangalore, Karnataka 560001\n\n' +
          'Total Addresses: 2'
        );
      },
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      action: () => {
        Alert.alert('Payment Methods', 
          'Saved Cards:\n\n' +
          'Visa ending in 1234\n' +
          'Expires: 12/25\n\n' +
          'Mastercard ending in 5678\n' +
          'Expires: 08/26\n\n' +
          'UPI: user@upi\n\n' +
          'Total Methods: 3'
        );
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      action: () => {},
      showSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      action: () => {
        Alert.alert('Help & Support', 
          'Contact Information:\n\n' +
          'Customer Care: +91 1800-123-4567\n' +
          'Email: support@animall.com\n' +
          'Live Chat: Available 24/7\n\n' +
          'FAQ Categories:\n' +
          '• Order & Delivery\n' +
          '• Returns & Refunds\n' +
          '• Payment Issues\n' +
          '• Account Problems'
        );
      },
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      action: () => {
        Alert.alert('About ANIMALL', 
          'App Version: 1.0.0\n' +
          'Build: 2024.01.15\n\n' +
          'ANIMALL - Premium E-commerce\n' +
          'Built with React Native & Expo\n\n' +
          '© 2024 ANIMALL. All rights reserved.\n\n' +
          'Terms of Service | Privacy Policy'
        );
      },
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
      onPress={item.action}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuText}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
          {item.subtitle && (
            <Text style={[styles.menuSubtitle, { color: colors.tabIconDefault }]}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {item.showSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: '#767577', true: colors.tint }}
          thumbColor={item.switchValue ? '#f4f3f4' : '#f4f3f4'}
        />
      ) : (
        <Text style={[styles.menuArrow, { color: colors.tabIconDefault }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.loginPrompt}>
          <Text style={[styles.loginTitle, { color: colors.text }]}>Welcome!</Text>
          <Text style={[styles.loginSubtitle, { color: colors.tabIconDefault }]}>
            Sign in to access your profile and orders
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.signupButton, { borderColor: colors.tint }]}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={[styles.signupButtonText, { color: colors.tint }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header />

        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'User'}</Text>
            <Text style={[styles.userEmail, { color: colors.tabIconDefault }]}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <Text style={[styles.statNumber, { color: colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Wishlist</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <Text style={[styles.statNumber, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Reviews</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: '#FF4444' }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: '#FF4444' }]}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  userCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    marginBottom: 8,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  menuArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
}); 