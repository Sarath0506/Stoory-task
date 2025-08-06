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
import OTPVerificationModal from '@/components/OTPVerificationModal';
import { authService } from '@/services/authService';

export default function LoginScreen() {
  const [contactInfo, setContactInfo] = useState('');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [expectedOTP, setExpectedOTP] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login } = useUser();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async () => {
    if (!contactInfo.trim()) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }

    if (contactType === 'email' && !validateEmail(contactInfo)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (contactType === 'phone' && !validatePhone(contactInfo)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.generateOTP(contactInfo, contactType);
      
      if (response.success) {
        setExpectedOTP(response.otp || '');
        setShowOTPModal(true);
        Alert.alert(
          'OTP Sent',
          `A 6-digit verification code has been sent to your ${contactType === 'email' ? 'email' : 'phone number'}`
        );
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsVerifyingOTP(true);
    
    try {
      const response = await authService.verifyOTP(otp, expectedOTP);
      
      if (response.success) {
        // Check if user exists
        const userExists = await authService.checkUserExists(contactInfo, contactType);
        
        if (userExists) {
          // Login existing user
          const loginResponse = await authService.loginUser(contactInfo, contactType);
          if (loginResponse.success && loginResponse.data) {
            login(loginResponse.data);
            router.replace('/(tabs)');
          }
        } else {
          // Create new user
          const createResponse = await authService.createUser({
            name: contactInfo.split('@')[0] || contactInfo,
            email: contactType === 'email' ? contactInfo : undefined,
            phone: contactType === 'phone' ? contactInfo : undefined,
          });
          
          if (createResponse.success && createResponse.data) {
            login(createResponse.data);
            router.replace('/(tabs)');
          }
        }
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifyingOTP(false);
      setShowOTPModal(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const response = await authService.googleSignIn();
      
      if (response.success && response.data) {
        login(response.data);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactTypeToggle = () => {
    setContactType(contactType === 'email' ? 'phone' : 'email');
    setContactInfo('');
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
          {/* Contact Type Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor: contactType === 'email' ? colors.tint : 'transparent',
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setContactType('email')}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: contactType === 'email' ? 'white' : colors.tint },
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor: contactType === 'phone' ? colors.tint : 'transparent',
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setContactType('phone')}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: contactType === 'phone' ? 'white' : colors.tint },
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, { borderColor: colors.tabIconDefault }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              {contactType === 'email' ? 'Email Address' : 'Phone Number'}
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
              placeholder={contactType === 'email' ? 'Enter your email' : 'Enter your phone number'}
              placeholderTextColor={colors.tabIconDefault}
              value={contactInfo}
              onChangeText={setContactInfo}
              keyboardType={contactType === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.sendOTPButton, { backgroundColor: colors.tint }]}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <Text style={styles.sendOTPButtonText}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
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
              disabled={isLoading}
            >
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-google" size={18} color="#DB4437" style={styles.socialIcon} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                  Continue with Google
                </Text>
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

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        visible={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleVerifyOTP}
        contactInfo={contactInfo}
        contactType={contactType}
        isLoading={isVerifyingOTP}
      />
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 16,
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
    paddingHorizontal: 16,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
  },
  sendOTPButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendOTPButtonText: {
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
    marginBottom: 24,
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
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});