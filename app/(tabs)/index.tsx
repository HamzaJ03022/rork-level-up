import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { categories } from '@/constants/categories';
import { tips } from '@/constants/tips';
import CategoryCard from '@/components/CategoryCard';
import TipCard from '@/components/TipCard';
import AIAdviceCard from '@/components/AIAdviceCard';
import { useUserStore } from '@/store/user-store';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useUserStore(state => state.profile);
  
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  // Get 3 random tips that haven't been completed yet
  const getRecommendedTips = () => {
    if (!profile) return [];
    
    const uncompletedTips = tips.filter(tip => !profile.completedTips.includes(tip.id));
    const shuffled = [...uncompletedTips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  // Get daily routines
  const getDailyRoutines = () => {
    if (!profile) return [];
    return profile.routines.filter(routine => 
      routine.frequency === 'daily' && !routine.completed
    ).slice(0, 3);
  };

  const recommendedTips = getRecommendedTips();
  const dailyRoutines = getDailyRoutines();
  const completedRoutinesCount = profile?.routines.filter(r => r.completed).length || 0;
  const totalRoutinesCount = profile?.routines.length || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Level Up" }} />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {profile?.name || 'there'}!
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      
      {/* Progress Summary */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressBadge}>
            <CheckCircle2 size={14} color={Colors.dark.success} />
            <Text style={styles.progressBadgeText}>
              {completedRoutinesCount}/{totalRoutinesCount} completed
            </Text>
          </View>
        </View>
        
        {dailyRoutines.length > 0 ? (
          <>
            {dailyRoutines.map(routine => (
              <View key={routine.id} style={styles.routineItem}>
                <View style={[
                  styles.routineCheckbox,
                  routine.completed ? styles.routineCheckboxCompleted : {}
                ]}>
                  {routine.completed && <CheckCircle2 size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.routineTitle}>{routine.title}</Text>
              </View>
            ))}
            
            <Pressable 
              style={styles.viewAllButton}
              onPress={() => router.push('/routines')}
            >
              <Text style={styles.viewAllText}>View All Routines</Text>
              <ArrowRight size={16} color={Colors.dark.primary} />
            </Pressable>
          </>
        ) : (
          <View style={styles.emptyRoutines}>
            <Text style={styles.emptyRoutinesText}>
              No routines for today. Add some in the Routines tab.
            </Text>
            <Pressable 
              style={styles.addRoutinesButton}
              onPress={() => router.push('/routines')}
            >
              <Text style={styles.addRoutinesText}>Go to Routines</Text>
            </Pressable>
          </View>
        )}
      </View>
      
      <AIAdviceCard />
      
      <Text style={styles.sectionTitle}>Recommended Tips</Text>
      {recommendedTips.length > 0 ? (
        recommendedTips.map(tip => (
          <TipCard key={tip.id} tip={tip} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            You've completed all tips! Great job!
          </Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>Categories</Text>
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  progressCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 12,
    color: Colors.dark.success,
    marginLeft: 4,
  },
  routineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  routineCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineCheckboxCompleted: {
    backgroundColor: Colors.dark.success,
    borderColor: Colors.dark.success,
  },
  routineTitle: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.dark.primary,
    marginRight: 4,
  },
  emptyRoutines: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyRoutinesText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 12,
  },
  addRoutinesButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addRoutinesText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyStateText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
  },
});