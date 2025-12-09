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
import {
  X,
  Crown,
  Calendar,
  CreditCard,
  RefreshCw,
  ExternalLink,
  AlertCircle,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useRevenueCat } from '@/store/revenuecat-store';

export default function CustomerCenterScreen() {
  const router = useRouter();
  const {
    activeSubscription,
    isPro,
    restorePurchases,
    fetchCustomerInfo,
    isLoading,
  } = useRevenueCat();

  const [refreshing, setRefreshing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCustomerInfo();
    setRefreshing(false);
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
            'Your purchases have been restored successfully.'
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
      console.error('[CustomerCenter] Restore error:', err);
      Alert.alert('Error', 'Unable to restore purchases. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  const handleManageSubscription = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Manage Subscription',
        'To manage your subscription, please visit Settings > [Your Name] > Subscriptions on your device.'
      );
    } else if (Platform.OS === 'android') {
      Alert.alert(
        'Manage Subscription',
        'To manage your subscription, please visit the Google Play Store app.'
      );
    }
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeText}>
            Subscription management is not available on web. Please use the mobile app.
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[Colors.dark.background, '#1a1a2e', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
            <Text style={styles.loadingText}>Loading subscription info...</Text>
          </View>
        ) : isPro && activeSubscription ? (
          <>
            <View style={styles.statusCard}>
              <LinearGradient
                colors={['#FF6B6B', '#FFD93D']}
                style={styles.statusIconGradient}
              >
                <Crown size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.statusTitle}>Level Up Pro</Text>
              <Text style={styles.statusSubtitle}>Active Subscription</Text>
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <CreditCard size={20} color={Colors.dark.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Plan</Text>
                  <Text style={styles.detailValue}>
                    {activeSubscription.productIdentifier}
                  </Text>
                </View>
              </View>

              {activeSubscription.expirationDate && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Calendar size={20} color={Colors.dark.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>
                      {activeSubscription.willRenew ? 'Renews on' : 'Expires on'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {new Date(activeSubscription.expirationDate).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </Text>
                  </View>
                </View>
              )}

              {activeSubscription.periodType && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <AlertCircle size={20} color={Colors.dark.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={styles.detailValue}>
                      {activeSubscription.willRenew
                        ? 'Auto-renewing'
                        : 'Cancelled (access until expiration)'}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleManageSubscription}
            >
              <ExternalLink size={20} color={Colors.dark.primary} />
              <Text style={styles.actionButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.noSubscriptionCard}>
              <Crown size={48} color={Colors.dark.inactive} />
              <Text style={styles.noSubscriptionTitle}>No Active Subscription</Text>
              <Text style={styles.noSubscriptionText}>
                Subscribe to Level Up Pro to access all premium features
              </Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => router.push('/paywall')}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FFD93D']}
                  style={styles.upgradeButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.upgradeButtonText}>View Plans</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRestore}
            disabled={restoring}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={Colors.dark.primary} />
            ) : (
              <>
                <RefreshCw size={20} color={Colors.dark.primary} />
                <Text style={styles.secondaryButtonText}>Restore Purchases</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={Colors.dark.primary} />
            ) : (
              <>
                <RefreshCw size={20} color={Colors.dark.primary} />
                <Text style={styles.secondaryButtonText}>Refresh Status</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            For support or questions about your subscription, please contact our support team.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: Colors.dark.success,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  noSubscriptionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  noSubscriptionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noSubscriptionText: {
    fontSize: 15,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 20,
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
