import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Colors from '@/constants/colors';
import { Brain, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/user-store';

const AIAdviceCard = () => {
  const router = useRouter();
  const aiAnalysis = useUserStore(state => state.aiAnalysis);
  
  const hasAnalysis = useMemo(() => !!aiAnalysis.lastAnalysis, [aiAnalysis.lastAnalysis]);
  
  const lastAnalysisDate = useMemo(() => {
    if (!hasAnalysis || !aiAnalysis.lastAnalysis) return null;
    return new Date(aiAnalysis.lastAnalysis).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, [hasAnalysis, aiAnalysis.lastAnalysis]);

  const handlePress = useCallback(() => {
    router.push('/ai-advice');
  }, [router]);

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.9 : 1 }
      ]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Brain size={24} color="#FFFFFF" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {hasAnalysis ? 'Your AI Analysis' : 'Get AI Advice'}
        </Text>
        <Text style={styles.description}>
          {hasAnalysis 
            ? `Last updated: ${lastAnalysisDate}. Tap to view your personalized advice.`
            : 'Upload a photo to get AI-powered appearance advice tailored to you.'}
        </Text>
      </View>
      
      <ChevronRight size={20} color={Colors.dark.subtext} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
});

export default memo(AIAdviceCard);