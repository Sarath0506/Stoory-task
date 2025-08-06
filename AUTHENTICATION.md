# Authentication System Documentation

## Overview

This e-commerce app implements a comprehensive authentication system with OTP (One-Time Password) verification and Google OAuth integration. The system supports both email and phone number authentication methods.

## Features

### 1. OTP-Based Authentication
- **Email OTP**: Send verification codes to user's email address
- **Phone OTP**: Send verification codes to user's phone number
- **6-digit OTP**: Secure 6-digit verification codes
- **Auto-focus**: Automatic input field focus for better UX
- **Resend functionality**: Users can resend OTP after 30 seconds
- **Timer**: Countdown timer showing when resend is available

### 2. Google OAuth Integration
- **Google Sign-In**: One-click authentication using Google account
- **Automatic account creation**: New users are automatically registered
- **Seamless login**: Existing users are logged in automatically

### 3. User Management
- **User Context**: Global state management for user data
- **Authentication Guard**: Route protection for authenticated users
- **Profile Management**: User profile with logout functionality

## File Structure

```
├── app/
│   ├── auth/
│   │   ├── login.tsx          # Login screen with OTP/Google auth
│   │   └── signup.tsx         # Signup screen with OTP/Google auth
│   └── (tabs)/
│       └── _layout.tsx        # Protected tab layout with AuthGuard
├── components/
│   ├── OTPVerificationModal.tsx  # OTP input and verification modal
│   └── AuthGuard.tsx             # Route protection component
├── contexts/
│   └── UserContext.tsx           # User state management
├── services/
│   └── authService.ts            # Authentication service logic
└── AUTHENTICATION.md             # This documentation
```

## Authentication Flow

### Login Flow
1. User enters email or phone number
2. System validates input format
3. OTP is generated and sent to user
4. User enters 6-digit OTP in modal
5. System verifies OTP and checks if user exists
6. If user exists: Login and redirect to main app
7. If new user: Create account and redirect to main app

### Signup Flow
1. User enters full name and contact info
2. User accepts terms and conditions
3. OTP is generated and sent to user
4. User enters 6-digit OTP in modal
5. System verifies OTP and creates new account
6. User is logged in and redirected to main app

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Google OAuth process (simulated)
3. User data is retrieved from Google
4. Account is created or user is logged in
5. User is redirected to main app

## Components

### OTPVerificationModal
- **Purpose**: Handles OTP input and verification
- **Features**:
  - 6-digit OTP input with auto-focus
  - 30-second resend timer
  - Visual feedback for input states
  - Error handling and validation

### AuthGuard
- **Purpose**: Protects routes from unauthenticated access
- **Features**:
  - Checks user authentication status
  - Redirects to login if not authenticated
  - Shows loading indicator during check

### UserContext
- **Purpose**: Global user state management
- **Features**:
  - User data storage
  - Login/logout functions
  - Authentication status tracking

## Service Layer

### authService
- **generateOTP()**: Creates and sends OTP codes
- **verifyOTP()**: Validates OTP input
- **googleSignIn()**: Handles Google OAuth
- **checkUserExists()**: Checks if user account exists
- **createUser()**: Creates new user accounts
- **loginUser()**: Authenticates existing users

## Security Features

1. **OTP Validation**: Server-side OTP verification
2. **Input Validation**: Email and phone number format validation
3. **Rate Limiting**: Resend timer prevents spam
4. **Session Management**: User context maintains authentication state
5. **Route Protection**: AuthGuard prevents unauthorized access

## Usage Examples

### Login with Email
```typescript
// User enters email and clicks "Send OTP"
const response = await authService.generateOTP(email, 'email');
if (response.success) {
  setShowOTPModal(true);
}
```

### Login with Phone
```typescript
// User enters phone and clicks "Send OTP"
const response = await authService.generateOTP(phone, 'phone');
if (response.success) {
  setShowOTPModal(true);
}
```

### Google OAuth
```typescript
// User clicks "Continue with Google"
const response = await authService.googleSignIn();
if (response.success) {
  login(response.data);
  router.replace('/(tabs)');
}
```

## Configuration

### Environment Variables
For production, you would need to configure:
- Email service (SendGrid, AWS SES, etc.)
- SMS service (Twilio, AWS SNS, etc.)
- Google OAuth credentials
- Database connection for user storage

### Real Implementation
Replace the simulated authService with:
- Real API calls to your backend
- Actual email/SMS sending
- Google OAuth SDK integration
- Database user management

## Testing

The current implementation includes:
- Simulated OTP generation (logs to console)
- Simulated Google OAuth
- Mock user database (random user existence)
- Error handling and validation

To test:
1. Enter any valid email/phone
2. Check console for OTP code
3. Enter the OTP in the modal
4. Test Google OAuth button
5. Verify profile shows user data
6. Test logout functionality

## Future Enhancements

1. **Biometric Authentication**: Face ID, Touch ID
2. **Two-Factor Authentication**: Additional security layer
3. **Social Login**: Facebook, Apple, Twitter
4. **Password Recovery**: Forgot password flow
5. **Account Linking**: Link multiple auth methods
6. **Session Management**: Token-based authentication
7. **Offline Support**: Cached authentication state 