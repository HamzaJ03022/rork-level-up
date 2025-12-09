import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  ScrollView,
  Image,
  Animated
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Heart, 
  Users, 
  Award,
  ArrowRight,
  Star
} from 'lucide-react-native';



interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const BenefitCard = ({ icon, title, description, color, delay }: BenefitCardProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.benefitCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.benefitIconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDescription}>{description}</Text>
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const heroFadeAnim = useRef(new Animated.Value(0)).current;
  const heroSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(heroSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroFadeAnim, heroSlideAnim]);

  const handleGetStarted = () => {
    router.push('/onboarding' as Href);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: heroFadeAnim,
              transform: [{ translateY: heroSlideAnim }],
            },
          ]}
        >
          <View style={styles.heroImageContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
              }}
              style={styles.heroImageLeft}
            />
            <Image
              source={{
                uri: 'https://r2-pub.rork.com/generated-images/b1dd7fe1-fa12-4bfe-a3ab-1fcc848d16e8.png',
              }}
              style={styles.heroImageCenter}
            />
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
              }}
              style={styles.heroImageRight}
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Level Up Your</Text>
            <Text style={styles.titleGradient}>Appearance</Text>
          </View>

          <Text style={styles.subtitle}>
            Transform your confidence with personalized routines, AI-powered insights, and proven strategies for looking your best
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10k+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color={Colors.dark.warning} fill={Colors.dark.warning} />
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>See Results</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why Level Up?</Text>
          
          <BenefitCard
            icon={<TrendingUp size={32} color={Colors.dark.primary} />}
            title="Improved Appearance"
            description="Track your transformation with personalized routines for skincare, fitness, grooming, and style"
            color={Colors.dark.primary}
            delay={200}
          />

          <BenefitCard
            icon={<Sparkles size={32} color={Colors.dark.secondary} />}
            title="Boosted Confidence"
            description="Feel more confident in social and professional situations as you see real progress"
            color={Colors.dark.secondary}
            delay={300}
          />

          <BenefitCard
            icon={<Zap size={32} color={Colors.dark.warning} />}
            title="AI-Powered Insights"
            description="Get personalized recommendations based on your unique features and goals"
            color={Colors.dark.warning}
            delay={400}
          />

          <BenefitCard
            icon={<Heart size={32} color={Colors.dark.error} />}
            title="Better First Impressions"
            description="Make lasting impressions in dating, interviews, and social settings"
            color={Colors.dark.error}
            delay={500}
          />

          <BenefitCard
            icon={<Users size={32} color={Colors.dark.success} />}
            title="Social Success"
            description="Enhance your attractiveness and social presence with proven strategies"
            color={Colors.dark.success}
            delay={600}
          />

          <BenefitCard
            icon={<Award size={32} color="#06B6D4" />}
            title="Professional Edge"
            description="Stand out in your career with a polished, professional appearance"
            color="#06B6D4"
            delay={700}
          />
        </View>

        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Upload Your Photos</Text>
              <Text style={styles.stepDescription}>
                Take clear photos of your face and body for AI analysis
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get AI Analysis</Text>
              <Text style={styles.stepDescription}>
                Receive personalized insights about your appearance and improvement areas
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Follow Your Routines</Text>
              <Text style={styles.stepDescription}>
                Complete daily routines tailored to your goals and lifestyle
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Track Progress</Text>
              <Text style={styles.stepDescription}>
                Watch your transformation with progress photos and insights
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.testimonialSection}>
          <Text style={styles.sectionTitle}>Success Stories</Text>

          <View style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' }}
                style={styles.testimonialAvatar}
              />
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>Michael R.</Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} color={Colors.dark.warning} fill={Colors.dark.warning} />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              &ldquo;Level Up changed my life. After 3 months, I feel more confident than ever. My dating life improved dramatically!&rdquo;
            </Text>
          </View>

          <View style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' }}
                style={styles.testimonialAvatar}
              />
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>David L.</Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} color={Colors.dark.warning} fill={Colors.dark.warning} />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              &ldquo;The AI insights were spot-on. I finally have a clear plan for improving my appearance. Highly recommend!&rdquo;
            </Text>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Transform?</Text>
          <Text style={styles.ctaDescription}>
            Join thousands of users who are already on their journey to looking and feeling their best
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          testID="get-started-button"
        >
          <LinearGradient
            colors={[Colors.dark.primary, Colors.dark.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started Free</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  heroImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    height: 200,
  },
  heroImageLeft: {
    width: 80,
    height: 120,
    borderRadius: 16,
    marginRight: -10,
    transform: [{ rotate: '-8deg' }],
    zIndex: 1,
  },
  heroImageCenter: {
    width: 100,
    height: 150,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.dark.primary,
    zIndex: 2,
  },
  heroImageRight: {
    width: 80,
    height: 120,
    borderRadius: 16,
    marginLeft: -10,
    transform: [{ rotate: '8deg' }],
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  titleGradient: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.dark.border,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  benefitsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  benefitCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  benefitIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  howItWorksSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
    lineHeight: 20,
  },
  testimonialSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  testimonialCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 4,
  },
  testimonialText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ctaSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  getStartedButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
