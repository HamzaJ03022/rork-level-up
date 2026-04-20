import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Linking, Pressable } from 'react-native';
import Colors from '@/constants/colors';
import { LEGAL_URLS } from '@/constants/legal';

type Props = {
  variant?: 'compact' | 'default';
  align?: 'center' | 'left';
};

export default function LegalLinks({ variant = 'default', align = 'center' }: Props) {
  const openUrl = useCallback((url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('[LegalLinks] Failed to open URL', url, err);
    });
  }, []);

  const textSize = variant === 'compact' ? 11 : 12;

  return (
    <View style={[styles.row, { justifyContent: align === 'center' ? 'center' : 'flex-start' }]} testID="legal-links">
      <Pressable onPress={() => openUrl(LEGAL_URLS.termsOfService)} hitSlop={8} testID="legal-tos">
        <Text style={[styles.link, { fontSize: textSize }]}>Terms of Service</Text>
      </Pressable>
      <Text style={[styles.separator, { fontSize: textSize }]}>•</Text>
      <Pressable onPress={() => openUrl(LEGAL_URLS.privacyPolicy)} hitSlop={8} testID="legal-privacy">
        <Text style={[styles.link, { fontSize: textSize }]}>Privacy Policy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  link: {
    color: Colors.dark.subtext,
    textDecorationLine: 'underline',
  },
  separator: {
    color: Colors.dark.inactive,
  },
});
