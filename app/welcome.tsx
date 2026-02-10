import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Target,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const PAGES = [
  {
    icon: Sparkles,
    iconColor: '#F59E0B',
    accentColor: '#F59E0B',
    tagline: 'AI-Powered',
    title: 'Your Personal\nGlow Up Coach',
    description:
      'Get tailored advice for skincare, fitness, grooming, and style — all based on your unique features.',
  },
  {
    icon: Target,
    iconColor: '#10B981',
    accentColor: '#10B981',
    tagline: 'Personalized',
    title: 'Routines Built\nJust For You',
    description:
      'We create daily habits that fit your lifestyle and goals, so you can level up without the guesswork.',
  },
  {
    icon: TrendingUp,
    iconColor: '#6366F1',
    accentColor: '#6366F1',
    tagline: 'Track Progress',
    title: 'See Real\nResults Over Time',
    description:
      'Document your transformation with progress photos and watch your confidence grow week by week.',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const dotWidths = useRef(PAGES.map((_, i) => new Animated.Value(i === 0 ? 24 : 8))).current;

  const animateIn = () => {
    fadeAnim.setValue(0);
    contentSlide.setValue(20);
    iconScale.setValue(0.5);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animateIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    PAGES.forEach((_, i) => {
      Animated.timing(dotWidths[i], {
        toValue: i === currentPage ? 24 : 8,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  }, [currentPage, dotWidths]);

  const goToPage = (index: number) => {
    fadeAnim.setValue(0);
    contentSlide.setValue(30);
    iconScale.setValue(0.6);
    setCurrentPage(index);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      goToPage(currentPage + 1);
    } else {
      router.push('/onboarding' as Href);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding' as Href);
  };

  const page = PAGES[currentPage];
  const IconComponent = page.icon;
  const isLast = currentPage === PAGES.length - 1;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#121212', '#1a1a2e', '#121212']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.logo}>Level Up</Text>
        {!isLast && (
          <Pressable onPress={handleSkip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.body}>
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${page.accentColor}15` }]}>
            <View style={[styles.iconInner, { backgroundColor: `${page.accentColor}25` }]}>
              <IconComponent size={40} color={page.iconColor} />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: contentSlide }],
          }}
        >
          <View style={[styles.taglinePill, { backgroundColor: `${page.accentColor}18` }]}>
            <Text style={[styles.taglineText, { color: page.accentColor }]}>{page.tagline}</Text>
          </View>

          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.description}>{page.description}</Text>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.pagination}>
          {PAGES.map((_, i) => (
            <Pressable key={i} onPress={() => goToPage(i)} hitSlop={8}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: dotWidths[i],
                    backgroundColor: i === currentPage ? page.accentColor : '#333',
                  },
                ]}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: page.accentColor, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={handleNext}
          testID="welcome-next-button"
        >
          <Text style={styles.ctaText}>{isLast ? 'Get Started' : 'Continue'}</Text>
          {isLast ? (
            <ArrowRight size={20} color="#FFF" />
          ) : (
            <ChevronRight size={20} color="#FFF" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFF',
    letterSpacing: -0.5,
  },
  skipText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500' as const,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglinePill: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  taglineText: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  title: {
    fontSize: 34,
    fontWeight: '800' as const,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: -0.8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    alignSelf: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFF',
  },
});
