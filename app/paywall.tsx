import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Check, Crown, Zap, Star, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useRevenueCat } from '@/store/revenuecat-store';
import { PurchasesPackage } from 'react-native-purchases';

const FEATURES = [
  { icon: Crown, text: 'Unlimited AI-powered appearance analysis' },
  { icon: Sparkles, text: 'Personalized grooming recommendations' },
  { icon: Zap, text: 'Advanced progress tracking with insights' },
  { icon: Star, text: 'Priority customer support' },
  { icon: Check, text: 'Access to all premium content' },
  { icon: Check, text: 'Ad-free experience' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const {
    offerings,
    isLoading,
    purchasePackage,
    restorePurchases,
    isPro,
  } = useRevenueCat();

  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const currentOffering = offerings?.current;
  const availablePackages = currentOffering?.availablePackages || [];

  const getPackageDetails = (pkg: PurchasesPackage) => {
    const identifier = pkg.identifier.toLowerCase();
    
    if (identifier.includes('monthly') || identifier.includes('month')) {
      return {
        title: 'Monthly',
        badge: null,
        savings: null,
      };
    }
    
    if (identifier.includes('annual') || identifier.includes('year')) {
      return {
        title: 'Yearly',
        badge: 'MOST POPULAR',
        savings: 'Save 50%',
      };
    }
    
    if (identifier.includes('lifetime')) {
      return {
        title: 'Lifetime',
        badge: 'BEST VALUE',
        savings: 'One-time payment',
      };
    }
    
    return {
      title: pkg.identifier,
      badge: null,
      savings: null,
    };
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    setPurchasing(true);
    try {
      const result = await purchasePackage(selectedPackage);
      
      if (result.success) {
        Alert.alert(
          'Success! 🎉',
          'Welcome to Level Up Pro! Enjoy unlimited access to all premium features.',
          [
            {
              text: 'Get Started',
              onPress: () => router.back(),
            },
          ]
        );
      } else if (!result.userCancelled) {
        Alert.alert('Purchase Failed', result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('[Paywall] Purchase error:', err);
      Alert.alert('Error', 'Unable to complete purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      
      if (result.success) {
        const hasActiveEntitlement = result.customerInfo?.entitlements.active['Level up Pro'];
        
        if (hasActiveEntitlement) {
          Alert.alert(
            'Restored! 🎉',
            'Your purchases have been restored successfully.',
            [
              {
                text: 'Continue',
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert(
            'No Purchases Found',
            'We could not find any active subscriptions for this account.'
          );
        }
      } else {
        Alert.alert('Restore Failed', result.error || 'Unable to restore purchases.');
      }
    } catch (err) {
      console.error('[Paywall] Restore error:', err);
      Alert.alert('Error', 'Unable to restore purchases. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeText}>
            Subscriptions are not available on web. Please use the mobile app.
          </Text>
          <TouchableOpacity
            style={styles.webCloseButton}
            onPress={() => router.back()}
          >
            <Text style={styles.webCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isPro) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[Colors.dark.background, '#1a1a2e', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />
      
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <X size={24} color={Colors.dark.text} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#FF6B6B', '#FFD93D']}
              style={styles.iconGradient}
            >
              <Crown size={40} color="#fff" />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Unlock Level Up Pro</Text>
          <Text style={styles.subtitle}>
            Get unlimited access to AI-powered features and premium content
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Icon size={20} color={Colors.dark.primary} />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            );
          })}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
            <Text style={styles.loadingText}>Loading plans...</Text>
          </View>
        ) : availablePackages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.errorText}>
              No subscription plans available at the moment.
            </Text>
            <Text style={styles.errorSubtext}>
              Please check your internet connection and try again.
            </Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {availablePackages.map((pkg) => {
              const details = getPackageDetails(pkg);
              const isSelected = selectedPackage?.identifier === pkg.identifier;

              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                  ]}
                  onPress={() => setSelectedPackage(pkg)}
                  activeOpacity={0.7}
                >
                  {details.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{details.badge}</Text>
                    </View>
                  )}
                  
                  <View style={styles.planHeader}>
                    <Text style={styles.planTitle}>{details.title}</Text>
                    {details.savings && (
                      <Text style={styles.savings}>{details.savings}</Text>
                    )}
                  </View>
                  
                  <Text style={styles.planPrice}>
                    {pkg.product.priceString}
                  </Text>
                  
                  <Text style={styles.planPeriod}>
                    {pkg.product.subscriptionPeriod || 'One-time purchase'}
                  </Text>

                  <View style={[
                    styles.radioButton,
                    isSelected && styles.radioButtonSelected,
                  ]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.purchaseButton,
            (!selectedPackage || purchasing) && styles.purchaseButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={!selectedPackage || purchasing}
        >
          <LinearGradient
            colors={
              selectedPackage && !purchasing
                ? ['#FF6B6B', '#FFD93D']
                : ['#666', '#888']
            }
            style={styles.purchaseButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.purchaseButtonText}>
                {selectedPackage ? 'Continue' : 'Select a Plan'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={Colors.dark.primary} />
          ) : (
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Subscriptions auto-renew unless cancelled 24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  errorText: {
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  savings: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  radioButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.subtext,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.dark.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.primary,
  },
  purchaseButton: {
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerText: {
    fontSize: 12,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
  webNotice: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  webNoticeText: {
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  webCloseButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  webCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
