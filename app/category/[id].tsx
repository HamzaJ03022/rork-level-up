import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, Href } from 'expo-router';
import Colors from '@/constants/colors';
import { categories } from '@/constants/categories';
import { tips } from '@/constants/tips';
import TipCard from '@/components/TipCard';
import { HelpCircle, Plus } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { Routine } from '@/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addRoutine = useUserStore(state => state.addRoutine);
  
  const category = categories.find(cat => cat.id === id);
  const categoryTips = tips.filter(tip => tip.categoryId === id);
  
  const handleAddAllToRoutine = () => {
    if (category && categoryTips.length > 0) {
      // Add all tips from this category as daily routines
      categoryTips.forEach(tip => {
        const newRoutine: Routine = {
          id: `routine-${Date.now()}-${tip.id}`,
          title: tip.title,
          description: tip.description,
          categoryId: tip.categoryId,
          frequency: 'daily', // Default to daily
          completed: false,
        };
        
        addRoutine(newRoutine);
      });
      
      // Navigate to routines tab
      router.push('/routines' as Href);
    }
  };

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="category-scroll">
      <Stack.Screen options={{ title: category.title }} />
      
      <View style={[styles.header, { backgroundColor: category.color }]} testID="category-header">
        <HelpCircle size={32} color="#FFFFFF" />
        <Text style={styles.headerTitle}>{category.title}</Text>
        <Text style={styles.headerDescription}>{category.description}</Text>
      </View>
      
      <View style={styles.actionContainer}>
        <Pressable 
          style={styles.addAllButton}
          onPress={handleAddAllToRoutine}
          testID="category-add-all"
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.addAllButtonText}>Add All to Routines</Text>
        </Pressable>
      </View>
      
      <Text style={styles.sectionTitle}>Tips & Techniques</Text>
      
      {categoryTips.length > 0 ? (
        categoryTips.map(tip => (
          <TipCard key={tip.id} tip={tip} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No tips available for this category yet.
          </Text>
        </View>
      )}
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
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  actionContainer: {
    marginBottom: 16,
  },
  addAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addAllButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.error,
    textAlign: 'center',
    marginTop: 24,
  },
});