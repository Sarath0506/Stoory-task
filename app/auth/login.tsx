import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Create user data from email
      const userData = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Use email prefix as name
        email: email,
      };
      
      // Store user data in context
      login(userData);
      
      // Navigate to main app
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login functionality would be implemented here');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook login functionality would be implemented here');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.brandName, { color: colors.tint }]}>ANIMALL</Text>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            Sign in to your account to continue shopping
          </Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, { borderColor: colors.tabIconDefault }]}>
            <Text style={[styles.label, { color: colors.text }]}>Email / Username</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.tabIconDefault}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { borderColor: colors.tabIconDefault }]}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.tabIconDefault}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.tint }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.tabIconDefault }]} />
            <Text style={[styles.dividerText, { color: colors.tabIconDefault }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.tabIconDefault }]} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { borderColor: colors.tabIconDefault }]}
              onPress={handleGoogleLogin}
            >
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-google" size={18} color="#DB4437" style={styles.socialIcon} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { borderColor: colors.tabIconDefault }]}
              onPress={handleFacebookLogin}
            >
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-facebook" size={18} color="#1877F2" style={styles.socialIcon} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Facebook</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={[styles.footerLink, { color: colors.tint }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between', // Better distribution of content
  },
  header: {
    alignItems: 'center',
    marginBottom: 40, // Adjusted spacing
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 16, // Increased spacing
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16, // Added horizontal padding for better text wrapping
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: '100%', // Ensure form doesn't exceed screen width
  },
  inputContainer: {
    marginBottom: 20, // Optimized spacing
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14, // Slightly increased padding
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48, // Ensure consistent height
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24, // Optimized spacing
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24, // Optimized spacing
    minHeight: 50, // Slightly larger for primary action
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsContainer: {
    marginBottom: 24, // Optimized spacing
  },
  socialButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 48,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16, // Reduced margin for better balance
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});