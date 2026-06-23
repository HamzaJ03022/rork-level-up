import { useEffect, useState, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ─── Types ────────────────────────────────────────────────────────────────────

type CustomerInfo = any;
type PurchasesOfferings = any;
type PurchasesPackage = any;
type PurchasesModule = any;

interface PurchaseResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
  userCancelled?: boolean;
}

interface RestoreResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}

interface ActiveSubscription {
  productIdentifier: string;
  expirationDate: string | null;
  periodType: string | null;
  willRenew: boolean | null;
}

// ─── API Key Selection (3-key pattern) ────────────────────────────────────────

/**
 * Picks the correct RevenueCat API key based on platform and build mode.
 *
 * - Web preview & __DEV__ builds → Test Store key
 * - Production iOS → iOS App Store key
 * - Production Android → Google Play key
 */
const getRCToken = (): string => {
  // Dev builds and web preview use the test store
  if (__DEV__ || Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || '';
  }
  // Production builds use platform-specific keys
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '',
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '',
    default: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || '',
  });
};

// ─── Constants ────────────────────────────────────────────────────────────────

const RC_API_KEY = getRCToken();
const ENTITLEMENT_ID = 'Level Up Pro';
const IS_EXPO_GO = Constants.appOwnership === 'expo';

// ─── Lazy Native Module Loader ────────────────────────────────────────────────

/**
 * Lazily loads react-native-purchases. It's a native module that crashes on
 * import inside Expo Go, so we only require it when the runtime supports it.
 */
const loadPurchases = (): PurchasesModule | null => {
  if (IS_EXPO_GO) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-purchases');
    return mod?.default ?? mod;
  } catch (err) {
    console.warn('[RevenueCat] Native module unavailable:', err);
    return null;
  }
};

// ─── Top-Level SDK Configuration ──────────────────────────────────────────────

/**
 * Configure RevenueCat once at module scope. This runs as soon as the
 * module is first imported — not inside a useEffect or component.
 *
 * The call is a no-op on:
 * - Expo Go (native module unavailable)
 * - Missing API key
 */
let purchasesInstance: PurchasesModule | null = null;

const configurePurchasesModule = (): void => {
  if (purchasesInstance !== null) return; // already configured
  if (!RC_API_KEY) {
    console.log('[RevenueCat] No API key configured, skipping');
    return;
  }

  const Purchases = loadPurchases();
  if (!Purchases) {
    console.log('[RevenueCat] Native module not available, skipping');
    return;
  }

  try {
    Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.INFO);
    Purchases.configure({ apiKey: RC_API_KEY });
    purchasesInstance = Purchases;
    console.log('[RevenueCat] SDK configured successfully');
  } catch (err) {
    console.error('[RevenueCat] Configuration error:', err);
  }
};

// Configure immediately at module import time
configurePurchasesModule();

// ─── Context Provider & Hook ──────────────────────────────────────────────────

export const [RevenueCatProvider, useRevenueCat] = createContextHook(() => {
  const [isConfigured, setIsConfigured] = useState<boolean>(purchasesInstance !== null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch customer info and offerings on mount ──────────────────────────

  useEffect(() => {
    if (!purchasesInstance) {
      setIsLoading(false);
      return;
    }
    Promise.all([fetchCustomerInfo(), fetchOfferings()]).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Core API Helpers ────────────────────────────────────────────────────

  const fetchCustomerInfo = useCallback(async (): Promise<CustomerInfo | null> => {
    if (!purchasesInstance) {
      setIsLoading(false);
      return null;
    }
    try {
      console.log('[RevenueCat] Fetching customer info...');
      const info = await purchasesInstance.getCustomerInfo();
      setCustomerInfo(info);
      setIsLoading(false);
      return info;
    } catch (err) {
      console.error('[RevenueCat] Error fetching customer info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer info');
      setIsLoading(false);
      return null;
    }
  }, []);

  const fetchOfferings = useCallback(async (): Promise<PurchasesOfferings | null> => {
    if (!purchasesInstance) return null;
    try {
      console.log('[RevenueCat] Fetching offerings...');
      const fetchedOfferings = await purchasesInstance.getOfferings();
      setOfferings(fetchedOfferings);
      return fetchedOfferings;
    } catch (err) {
      console.error('[RevenueCat] Error fetching offerings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offerings');
      return null;
    }
  }, []);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<PurchaseResult> => {
    if (!purchasesInstance) {
      console.warn('[RevenueCat] SDK not configured');
      return { success: false, error: 'RevenueCat not configured', userCancelled: false };
    }

    try {
      console.log('[RevenueCat] Purchasing package:', pkg.identifier);
      const { customerInfo: info } = await purchasesInstance.purchasePackage(pkg);
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
  }, []);

  const restorePurchases = useCallback(async (): Promise<RestoreResult> => {
    if (!purchasesInstance) {
      console.warn('[RevenueCat] SDK not configured');
      return { success: false, error: 'RevenueCat not configured' };
    }

    try {
      console.log('[RevenueCat] Restoring purchases...');
      const info = await purchasesInstance.restorePurchases();
      setCustomerInfo(info);
      return { success: true, customerInfo: info };
    } catch (err) {
      console.error('[RevenueCat] Restore error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to restore purchases',
      };
    }
  }, []);

  // ── Entitlement & Subscription Helpers ──────────────────────────────────

  const isPro = ((): boolean => {
    if (!customerInfo) return false;
    const entitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
    return entitlement?.isActive === true;
  })();

  const getActiveSubscription = useCallback((): ActiveSubscription | null => {
    if (!customerInfo) return null;
    const entitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
    if (!entitlement?.isActive) return null;
    return {
      productIdentifier: entitlement.productIdentifier,
      expirationDate: entitlement.expirationDate ?? null,
      periodType: entitlement.periodType ?? null,
      willRenew: entitlement.willRenew ?? null,
    };
  }, [customerInfo]);

  // ── Public API ──────────────────────────────────────────────────────────

  return {
    isConfigured,
    customerInfo,
    offerings,
    isLoading,
    error,
    isPro,
    activeSubscription: getActiveSubscription(),
    purchasePackage,
    restorePurchases,
    fetchCustomerInfo,
    fetchOfferings,
  };
});
