import { useEffect, useState } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Types only (no runtime import) - safe in Expo Go
type CustomerInfo = any;
type PurchasesOfferings = any;
type PurchasesPackage = any;

const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || '';
const ENTITLEMENT_ID = 'Level up Pro';
const IS_EXPO_GO = Constants.appOwnership === 'expo';

/**
 * Lazily load react-native-purchases. It's a native module that throws on
 * import inside Expo Go, so we only require it on supported platforms.
 */
const loadPurchases = (): any | null => {
  if (Platform.OS === 'web' || IS_EXPO_GO) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-purchases');
    return mod?.default ?? mod;
  } catch (err) {
    console.warn('[RevenueCat] Native module unavailable:', err);
    return null;
  }
};

export const [RevenueCatProvider, useRevenueCat] = createContextHook(() => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    configurePurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const configurePurchases = async () => {
    try {
      console.log('[RevenueCat] Configuring SDK...');

      if (Platform.OS === 'web') {
        console.log('[RevenueCat] Web platform, skipping');
        setIsConfigured(false);
        setIsLoading(false);
        return;
      }

      if (IS_EXPO_GO) {
        console.log('[RevenueCat] Running in Expo Go, skipping native init');
        setIsConfigured(false);
        setIsLoading(false);
        return;
      }

      if (!REVENUECAT_API_KEY) {
        console.warn('[RevenueCat] API key not configured, skipping initialization');
        setIsConfigured(false);
        setIsLoading(false);
        return;
      }

      const Purchases = loadPurchases();
      if (!Purchases) {
        setIsConfigured(false);
        setIsLoading(false);
        return;
      }

      Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.INFO);
      Purchases.configure({ apiKey: REVENUECAT_API_KEY });

      console.log('[RevenueCat] SDK configured successfully');
      setIsConfigured(true);

      await fetchCustomerInfo();
      await fetchOfferings();
    } catch (err) {
      console.error('[RevenueCat] Configuration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to configure RevenueCat');
      setIsConfigured(false);
      setIsLoading(false);
    }
  };

  const fetchCustomerInfo = async () => {
    const Purchases = loadPurchases();
    if (!Purchases) {
      setIsLoading(false);
      return null;
    }
    try {
      console.log('[RevenueCat] Fetching customer info...');
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      setIsLoading(false);
      return info;
    } catch (err) {
      console.error('[RevenueCat] Error fetching customer info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer info');
      setIsLoading(false);
      return null;
    }
  };

  const fetchOfferings = async () => {
    const Purchases = loadPurchases();
    if (!Purchases) return null;
    try {
      console.log('[RevenueCat] Fetching offerings...');
      const fetchedOfferings = await Purchases.getOfferings();
      setOfferings(fetchedOfferings);
      return fetchedOfferings;
    } catch (err) {
      console.error('[RevenueCat] Error fetching offerings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offerings');
      return null;
    }
  };

  const purchasePackage = async (pkg: PurchasesPackage) => {
    const Purchases = loadPurchases();
    if (!isConfigured || !Purchases) {
      console.warn('[RevenueCat] SDK not configured');
      return { success: false, error: 'RevenueCat not configured', userCancelled: false };
    }

    try {
      console.log('[RevenueCat] Purchasing package:', pkg.identifier);
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(info);
      return { success: true, customerInfo: info };
    } catch (err: any) {
      console.error('[RevenueCat] Purchase error:', err);
      if (err.userCancelled) {
        return { success: false, userCancelled: true };
      }
      return {
        success: false,
        error: err.message || 'Purchase failed',
        userCancelled: false,
      };
    }
  };

  const restorePurchases = async () => {
    const Purchases = loadPurchases();
    if (!isConfigured || !Purchases) {
      console.warn('[RevenueCat] SDK not configured');
      return { success: false, error: 'RevenueCat not configured' };
    }

    try {
      console.log('[RevenueCat] Restoring purchases...');
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return { success: true, customerInfo: info };
    } catch (err) {
      console.error('[RevenueCat] Restore error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to restore purchases',
      };
    }
  };

  const isPro = (): boolean => {
    if (!customerInfo) return false;
    const entitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
    return entitlement?.isActive === true;
  };

  const getActiveSubscription = () => {
    if (!customerInfo) return null;
    const entitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
    if (!entitlement?.isActive) return null;
    return {
      productIdentifier: entitlement.productIdentifier,
      expirationDate: entitlement.expirationDate,
      periodType: entitlement.periodType,
      willRenew: entitlement.willRenew,
    };
  };

  return {
    isConfigured,
    customerInfo,
    offerings,
    isLoading,
    error,
    isPro: isPro(),
    activeSubscription: getActiveSubscription(),
    purchasePackage,
    restorePurchases,
    fetchCustomerInfo,
    fetchOfferings,
  };
});
