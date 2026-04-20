import React, { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { Apple } from 'lucide-react-native';
import { useRouter, type Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/clerk-expo';

type Props = {
  onComplete?: () => void;
  testID?: string;
};

export default function AppleSignInButton({ onComplete, testID }: Props) {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePress = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not available', 'Sign in with Apple is only available on mobile.');
      return;
    }

    setIsLoading(true);
    try {
      await Haptics.selectionAsync().catch(() => {});
      const redirectUrl = Linking.createURL('/sso-callback');
      const result = await startSSOFlow({
        strategy: 'oauth_apple',
        redirectUrl,
      });

      const { createdSessionId, setActive: setActiveSession } = result;

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        console.log('[AppleSignIn] Session activated');
        if (onComplete) {
          onComplete();
        } else {
          router.replace('/' as Href);
        }
      } else {
        console.log('[AppleSignIn] No session created, additional steps may be required');
      }
    } catch (err) {
      console.error('[AppleSignIn] error', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      const message = err instanceof Error ? err.message : 'Unable to sign in with Apple.';
      Alert.alert('Sign in failed', message);
    } finally {
      setIsLoading(false);
    }
  }, [onComplete, router, startSSOFlow]);

  if (Platform.OS === 'web') return null;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, isLoading && styles.disabled]}
      testID={testID ?? 'apple-sign-in'}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <View style={styles.content}>
          <Apple size={18} color="#FFF" fill="#FFF" />
          <Text style={styles.text}>Sign in with Apple</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { color: '#FFF', fontSize: 17, fontWeight: '600' as const },
});
