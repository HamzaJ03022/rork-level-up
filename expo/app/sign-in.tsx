import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter, Href, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleSignIn = useCallback(async () => {
    if (!isLoaded) return;

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        console.log('Sign in successful');
        router.replace('/' as Href);
      } else {
        console.log('Sign in incomplete:', JSON.stringify(result, null, 2));
        setError('Sign in could not be completed. Please try again.');
        triggerShake();
      }
    } catch (err: unknown) {
      console.error('Sign in error:', JSON.stringify(err, null, 2));
      const clerkError = err as { errors?: { message?: string; longMessage?: string }[] };
      const message = clerkError.errors?.[0]?.longMessage || clerkError.errors?.[0]?.message || 'Something went wrong. Please try again.';
      setError(message);
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, email, password, signIn, setActive, router, triggerShake]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#121212', '#1a1a2e', '#16213e', '#121212']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.headerSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Sparkles size={28} color="#FFF" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your glow up journey</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateX: shakeAnim }, { translateY: slideAnim }],
              },
            ]}
          >
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Mail size={18} color={Colors.dark.inactive} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.dark.inactive}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                testID="sign-in-email"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={18} color={Colors.dark.inactive} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.dark.inactive}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                testID="sign-in-password"
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
              >
                {showPassword ? (
                  <EyeOff size={18} color={Colors.dark.inactive} />
                ) : (
                  <Eye size={18} color={Colors.dark.inactive} />
                )}
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.signInButton,
                pressed && styles.signInButtonPressed,
                isLoading && styles.signInButtonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={isLoading}
              testID="sign-in-submit"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Text style={styles.signInButtonText}>Sign In</Text>
                  <ArrowRight size={18} color="#FFF" />
                </>
              )}
            </Pressable>
          </Animated.View>

          <Animated.View
            style={[styles.footerSection, { opacity: fadeAnim }]}
          >
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
              <Link href={'/sign-up' as Href} asChild>
                <Pressable testID="sign-in-to-sign-up">
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFF',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  errorText: {
    color: '#F87171',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    height: 56,
    gap: 8,
    marginTop: 8,
  },
  signInButtonPressed: {
    opacity: 0.85,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  footerSection: {
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    color: Colors.dark.inactive,
    fontSize: 13,
    marginHorizontal: 16,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    color: Colors.dark.subtext,
    fontSize: 15,
  },
  signUpLink: {
    color: Colors.dark.primary,
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
