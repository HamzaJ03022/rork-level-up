import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Tip } from '@/constants/tips';
import Colors from '@/constants/colors';
import { Star, Check, Plus } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { Routine } from '@/types';

type TipCardProps = {
  tip: Tip;
};

const TipCard = ({ tip }: TipCardProps) => {
  const router = useRouter();
  const profile = useUserStore(state => state.profile);
  const markTipCompleted = useUserStore(state => state.markTipCompleted);
  const addRoutine = useUserStore(state => state.addRoutine);
  
  const isCompleted = profile?.completedTips?.includes(tip.id) ?? false;

  const handlePress = () => {
    router.push(`/tip/${tip.id}` as Href);
  };

  const handleMarkComplete = useCallback(() => {
    if (!isCompleted) {
      markTipCompleted(tip.id);
    }
  }, [isCompleted, markTipCompleted, tip.id]);

  const handleAddToRoutine = useCallback((e: any) => {
    e.stopPropagation();
    
    const newRoutine: Routine = {
      id: `routine-${Date.now()}`,
      title: tip.title,
      description: tip.description,
      categoryId: tip.categoryId,
      frequency: 'daily',
      completed: false,
    };
    
    addRoutine(newRoutine);
  }, [addRoutine, tip.title, tip.description, tip.categoryId]);

  const renderImpact = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color={i < tip.impact ? Colors.dark.primary : Colors.dark.inactive}
          fill={i < tip.impact ? Colors.dark.primary : 'none'}
        />
      );
    }
    return stars;
  }, [tip.impact]);

  return (
    <Pressable 
      testID={`tip-card-${tip.id}`}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.9 : 1 }
      ]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{tip.title}</Text>
        <View style={styles.actions}>
          <Pressable 
            testID={`tip-add-to-routine-${tip.id}`}
            style={styles.addButton}
            onPress={handleAddToRoutine}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Plus size={16} color={Colors.dark.primary} />
          </Pressable>
          
          <Pressable 
            testID={`tip-mark-complete-${tip.id}`}
            style={[
              styles.completedButton,
              isCompleted ? styles.completedButtonActive : {}
            ]}
            onPress={handleMarkComplete}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Check size={16} color={isCompleted ? '#FFFFFF' : Colors.dark.inactive} />
          </Pressable>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {tip.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.impactContainer}>
          <Text style={styles.label}>Impact:</Text>
          <View style={styles.starsContainer}>
            {renderImpact}
          </View>
        </View>
        
        <View style={styles.metaContainer}>
          <Text style={[
            styles.difficulty,
            tip.difficulty === 'beginner' ? styles.beginner : 
            tip.difficulty === 'intermediate' ? styles.intermediate : 
            styles.advanced
          ]}>
            {tip.difficulty}
          </Text>
          <Text style={styles.time}>{tip.timeRequired}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginRight: 8,
  },
  completedButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.inactive,
  },
  completedButtonActive: {
    backgroundColor: Colors.dark.success,
    borderColor: Colors.dark.success,
  },
  description: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginRight: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  beginner: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10B981',
  },
  intermediate: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#F59E0B',
  },
  advanced: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
  },
  time: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
});

export default memo(TipCard);