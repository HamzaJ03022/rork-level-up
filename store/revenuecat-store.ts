import { useEffect, useState } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || 'test_YPzxPgnxJWqypxtMPWnuXfzBUPu';
const ENTITLEMENT_ID = 'Level up Pro';

export const [RevenueCatProvider, useRevenueCat] = createContextHook(() => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    configurePurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const configurePurchases = async () => {
    try {
      console.log('[RevenueCat] Configuring SDK...');
      
      if (Platform.OS === 'web') {
        console.log('[RevenueCat] Web platform detected, skipping configuration');
        setIsConfigured(false);
        setIsLoading(false);
        return;
      }

      Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
      Purchases.configure({ apiKey: REVENUECAT_API_KEY });

      console.log('[RevenueCat] SDK configured successfully');
      setIsConfigured(true);

      await fetchCustomerInfo();
      await fetchOfferings();
    } catch (err) {
      console.error('[RevenueCat] Configuration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to configure RevenueCat');
      setIsLoading(false);
    }
  };

  const fetchCustomerInfo = async () => {
    try {
      console.log('[RevenueCat] Fetching customer info...');
      const info = await Purchases.getCustomerInfo();
      console.log('[RevenueCat] Customer info:', JSON.stringify(info, null, 2));
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
    try {
      console.log('[RevenueCat] Fetching offerings...');
      const fetchedOfferings = await Purchases.getOfferings();
      console.log('[RevenueCat] Offerings:', JSON.stringify(fetchedOfferings, null, 2));
      setOfferings(fetchedOfferings);
      return fetchedOfferings;
    } catch (err) {
      console.error('[RevenueCat] Error fetching offerings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offerings');
      return null;
    }
  };

  const purchasePackage = async (pkg: PurchasesPackage) => {
    try {
      console.log('[RevenueCat] Purchasing package:', pkg.identifier);
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      console.log('[RevenueCat] Purchase successful:', JSON.stringify(info, null, 2));
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
    try {
      console.log('[RevenueCat] Restoring purchases...');
      const info = await Purchases.restorePurchases();
      console.log('[RevenueCat] Purchases restored:', JSON.stringify(info, null, 2));
      setCustomerInfo(info);
      return { success: true, customerInfo: info };
    } catch (err) {
      console.error('[RevenueCat] Restore error:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to restore purchases' 
      };
    }
  };

  const isPro = () => {
    if (!customerInfo) return false;
    
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    const isActive = entitlement?.isActive === true;
    
    console.log('[RevenueCat] Pro status:', isActive);
    return isActive;
  };

  const getActiveSubscription = () => {
    if (!customerInfo) return null;
    
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
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
