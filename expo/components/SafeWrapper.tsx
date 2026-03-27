import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ErrorBoundary } from '@/app/error-boundary';
import Colors from '@/constants/colors';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface SafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const DefaultFallback = ({ onRetry }: { onRetry?: () => void }) => (
  <View style={styles.fallbackContainer} testID="safe-fallback">
    <AlertTriangle size={48} color={Colors.dark.inactive} />
    <Text style={styles.fallbackTitle} testID="safe-fallback-title">Something went wrong</Text>
    <Text style={styles.fallbackText} testID="safe-fallback-message">
      We encountered an unexpected error. Please try again.
    </Text>
    {onRetry && (
      <Pressable style={styles.retryButton} onPress={onRetry} testID="safe-fallback-retry">
        <RefreshCw size={16} color="#FFFFFF" />
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    )}
  </View>
);

const SafeWrapper: React.FC<SafeWrapperProps> = ({ 
  children, 
  onError 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('SafeWrapper caught error:', error, errorInfo);
    onError?.(error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <View style={styles.root} testID="safe-wrapper-root">
        {children}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.dark.background,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  root: {
    flex: 1,
  }
});

export default SafeWrapper;
export { DefaultFallback };