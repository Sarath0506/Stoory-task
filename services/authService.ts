// Authentication service for OTP and Google OAuth
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface OTPResponse {
  success: boolean;
  otp?: string;
  message: string;
}

class AuthService {
  // Simulate OTP generation
  async generateOTP(contactInfo: string, contactType: 'email' | 'phone'): Promise<OTPResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        console.log(`OTP sent to ${contactType}: ${contactInfo} - Code: ${otp}`);
        
        resolve({
          success: true,
          otp,
          message: `OTP sent to your ${contactType}`,
        });
      }, 1000);
    });
  }

  // Simulate OTP verification
  async verifyOTP(otp: string, expectedOTP: string): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === expectedOTP) {
          resolve({
            success: true,
            message: 'OTP verified successfully',
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid OTP. Please try again.',
          });
        }
      }, 1000);
    });
  }

  // Simulate Google OAuth
  async googleSignIn(): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Google sign-in successful',
          data: {
            id: Date.now().toString(),
            name: 'Google User',
            email: 'user@gmail.com',
            picture: 'https://via.placeholder.com/150',
          },
        });
      }, 1500);
    });
  }

  // Check if user exists (simulate database check)
  async checkUserExists(contactInfo: string, contactType: 'email' | 'phone'): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate checking if user exists
        // In real app, this would query your database
        const exists = Math.random() > 0.5; // 50% chance user exists
        resolve(exists);
      }, 500);
    });
  }

  // Create new user account
  async createUser(userData: {
    name: string;
    email?: string;
    phone?: string;
  }): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Account created successfully',
          data: {
            id: Date.now().toString(),
            ...userData,
          },
        });
      }, 1000);
    });
  }

  // Login existing user
  async loginUser(contactInfo: string, contactType: 'email' | 'phone'): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Login successful',
          data: {
            id: Date.now().toString(),
            name: contactInfo.split('@')[0] || contactInfo,
            email: contactType === 'email' ? contactInfo : undefined,
            phone: contactType === 'phone' ? contactInfo : undefined,
          },
        });
      }, 1000);
    });
  }
}

export const authService = new AuthService(); 