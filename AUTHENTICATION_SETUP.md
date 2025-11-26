# Authentication Setup Guide

## Overview
This app uses Clerk for authentication, providing:
- Email/Password authentication
- Social login (Google, Apple, Facebook, etc.)
- JWT tokens for secure API calls
- User sessions managed in the backend
- Secure, production-ready authentication

## Setup Instructions

### 1. Create a Clerk Account
1. Go to [https://clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose your application name

### 2. Configure Authentication Methods
In your Clerk Dashboard:
1. Go to **User & Authentication** → **Email, Phone, Username**
   - Enable **Email address**
   - Enable **Password** 
2. Go to **User & Authentication** → **Social Connections**
   - Enable **Google** (works on web and mobile)
   - Enable **Apple** (required for iOS App Store)
   - Enable any other providers you want

### 3. Get Your API Keys
1. In Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

### 4. Add Keys to Environment Variables
Open the `env` file in the project root and add:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

**IMPORTANT**: 
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is safe to expose (used in frontend)
- `CLERK_SECRET_KEY` is secret and only used in backend - NEVER expose this!

### 5. Configure Clerk for Mobile
1. In Clerk Dashboard, go to **Paths**
2. Set up your OAuth redirect URLs for development:
   - For Expo Go: `exp://localhost:8081`
   - For production: Your app's deep link URL

## How It Works

### Frontend Authentication
- Uses `@clerk/clerk-expo` package
- Provides `<ClerkProvider>` wrapper for the app
- Exports `useAuth()` hook for checking auth state
- Exports `useUser()` hook for accessing user data
- Built-in UI components for sign-in/sign-up

### Backend Authentication
- Uses `@clerk/backend` package
- Middleware validates JWT tokens from requests
- Adds `userId` to tRPC context
- Protected procedures require authentication

### User Data Flow
1. User signs up/logs in via Clerk
2. JWT token stored securely on device
3. All API requests include JWT in Authorization header
4. Backend validates token and extracts userId
5. Backend operations are tied to authenticated userId
6. User profile data synced with backend database

## Security Features

✅ **Secure API Keys**: Secret keys only in backend, never exposed  
✅ **JWT Tokens**: Industry-standard authentication  
✅ **Session Management**: Automatic token refresh  
✅ **Password Hashing**: Handled by Clerk (bcrypt)  
✅ **Rate Limiting**: Built into Clerk  
✅ **2FA Support**: Can be enabled in Clerk Dashboard  
✅ **Protected Routes**: Backend validates all requests  

## Testing Authentication

### Development Mode
1. Run `npm start` or `bun start`
2. On first launch, you'll see the sign-in screen
3. Create a test account
4. User data will be persisted securely

### Production Mode
- Same flow, but uses production Clerk keys
- Real user accounts stored in Clerk's database
- Full OAuth support for social logins

## Troubleshooting

**Problem**: "Missing Publishable Key" error  
**Solution**: Make sure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is in your env file

**Problem**: Social login not working  
**Solution**: Configure OAuth redirect URLs in Clerk Dashboard

**Problem**: "Unauthorized" errors in API  
**Solution**: Check that `CLERK_SECRET_KEY` is set in backend

**Problem**: Token expired errors  
**Solution**: Clerk handles refresh automatically - restart app if persistent

## Next Steps

After authentication is set up:
1. User profiles are automatically created
2. All backend calls are authenticated
3. User data is private and secure
4. You can add role-based permissions if needed
5. Analytics and usage tracking tied to userId

## Links

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React Native Guide](https://clerk.com/docs/quickstarts/expo)
- [Clerk Dashboard](https://dashboard.clerk.com)
