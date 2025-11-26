import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Modal, Switch } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import RoutineItem from '@/components/RoutineItem';
import SafeWrapper from '@/components/SafeWrapper';
import { Plus, X, Calendar, Clock } from 'lucide-react-native';
import { categories } from '@/constants/categories';
import { Routine } from '@/types';
import { appearanceGoals } from '@/constants/appearance-goals';

export default function RoutinesScreen() {
  const routines = useUserStore(state => state.profile?.routines);
  const selectedImprovementRoutines = useUserStore(state => state.profile?.selectedImprovementRoutines);
  const addRoutine = useUserStore(state => state.addRoutine);
  const toggleRoutineCompletion = useUserStore(state => state.toggleRoutineCompletion);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const [showCompleted, setShowCompleted] = useState(true);
  
  const frequencies: ('daily' | 'weekly' | 'monthly')[] = ['daily', 'weekly', 'monthly'];

  const resetForm = useCallback(() => {
    setNewRoutineTitle('');
    setNewRoutineDescription('');
    setSelectedCategory('');
    setSelectedFrequency('daily');
  }, []);

  const handleAddRoutine = useCallback(() => {
    if (newRoutineTitle.trim() && selectedCategory && selectedFrequency) {
      const newRoutine: Routine = {
        id: Date.now().toString(),
        title: newRoutineTitle.trim(),
        description: newRoutineDescription.trim(),
        categoryId: selectedCategory,
        frequency: selectedFrequency,
        completed: false,
      };
      
      addRoutine(newRoutine);
      setModalVisible(false);
      resetForm();
    }
  }, [newRoutineTitle, newRoutineDescription, selectedCategory, selectedFrequency, addRoutine, resetForm]);

  const handleToggleRoutine = useCallback((id: string, completed: boolean) => {
    toggleRoutineCompletion(id, completed);
  }, [toggleRoutineCompletion]);

  const filteredRoutines = useMemo(() => 
    routines?.filter(routine => 
      showCompleted ? true : !routine.completed
    ) || [],
    [routines, showCompleted]
  );

  const groupedRoutines = useMemo(() => 
    filteredRoutines.reduce((acc, routine) => {
      if (!acc[routine.frequency]) {
        acc[routine.frequency] = [];
      }
      acc[routine.frequency].push(routine);
      return acc;
    }, {} as Record<string, Routine[]>),
    [filteredRoutines]
  );

  const handleAddRoutineClick = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const formattedDate = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <SafeWrapper>
      <View style={styles.container}>
        <Stack.Screen 
        options={{ 
          title: "Improvement Routines",
          headerRight: () => (
            <Pressable 
              onPress={handleAddRoutineClick}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Plus color={Colors.dark.text} size={24} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} testID="routines-scroll">
        <View style={styles.dateHeader}>
          <Calendar size={20} color={Colors.dark.primary} />
          <Text style={styles.dateText} testID="routines-date">{formattedDate}</Text>
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Show completed routines</Text>
          <Switch
            value={showCompleted}
            onValueChange={setShowCompleted}
            trackColor={{ false: Colors.dark.inactive, true: Colors.dark.primary }}
            thumbColor="#FFFFFF"
            testID="routines-toggle-completed"
          />
        </View>
        
        {Object.keys(groupedRoutines).length > 0 ? (
          <>
            {frequencies.map(frequency => {
              const routines = groupedRoutines[frequency] || [];
              if (routines.length === 0) return null;
              
              return (
                <View key={frequency} style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </Text>
                  
                  {routines.map(routine => (
                    <RoutineItem 
                      key={routine.id} 
                      routine={routine} 
                      onToggle={handleToggleRoutine}
                    />
                  ))}
                </View>
              );
            })}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No routines yet</Text>
            <Text style={styles.emptyStateText}>
              Add routines to track your daily, weekly, or monthly habits for improving your appearance.
            </Text>
            <Pressable 
              style={styles.addButton}
              onPress={handleAddRoutineClick}
            >
              <Text style={styles.addButtonText}>Add Your First Routine</Text>
            </Pressable>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Routines</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your appearance goals
          </Text>
          
          {appearanceGoals
            ?.filter(goal => !selectedImprovementRoutines?.includes(goal.id))
            ?.slice(0, 3)
            ?.map(goal => (
              <View key={goal.id} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <Text style={styles.suggestionTitle}>{goal.title}</Text>
                  <View style={styles.suggestionMeta}>
                    <Clock size={12} color={Colors.dark.subtext} />
                    <Text style={styles.suggestionTime}>{goal.timeRequired}</Text>
                  </View>
                </View>
                <Text style={styles.suggestionDescription}>{goal.description}</Text>
                <Pressable 
                  style={styles.addSuggestionButton}
                  onPress={() => {
                    const newRoutine: Routine = {
                      id: Date.now().toString(),
                      title: goal.title,
                      description: goal.description,
                      categoryId: goal.category,
                      frequency: goal.recommendedFrequency,
                      completed: false,
                    };
                    addRoutine(newRoutine);
                  }}
                >
                  <Text style={styles.addSuggestionText}>Add to Routines</Text>
                </Pressable>
              </View>
            ))}
        </View>
      </ScrollView>
      
      {/* Add Routine Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        testID="add-routine-modal"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Routine</Text>
              <Pressable onPress={handleCloseModal}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            <Text style={styles.inputLabel}>Routine Name</Text>
            <TextInput
              style={styles.input}
              value={newRoutineTitle}
              onChangeText={setNewRoutineTitle}
              placeholder="e.g., Morning Skincare"
              placeholderTextColor={Colors.dark.inactive}
              testID="add-routine-title"
            />
            
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newRoutineDescription}
              onChangeText={setNewRoutineDescription}
              placeholder="Describe what this routine involves"
              placeholderTextColor={Colors.dark.inactive}
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map(category => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && { backgroundColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text 
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category.id && styles.selectedCategoryText
                    ]}
                  >
                    {category.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <Text style={styles.inputLabel}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {frequencies.map(frequency => (
                <Pressable
                  key={frequency}
                  style={[
                    styles.frequencyButton,
                    selectedFrequency === frequency && styles.selectedFrequencyButton
                  ]}
                  onPress={() => setSelectedFrequency(frequency)}
                >
                  <Text 
                    style={[
                      styles.frequencyButtonText,
                      selectedFrequency === frequency && styles.selectedFrequencyText
                    ]}
                  >
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            <Pressable 
              style={[
                styles.saveButton,
                (!newRoutineTitle.trim() || !selectedCategory) && styles.saveButtonDisabled
              ]}
              onPress={handleAddRoutine}
              disabled={!newRoutineTitle.trim() || !selectedCategory}
              testID="add-routine-save"
            >
              <Text style={styles.saveButtonText}>Add Routine</Text>
            </Pressable>
          </View>
        </View>
        </Modal>
      </View>
    </SafeWrapper>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.dark.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    flex: 1,
  },
  suggestionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionTime: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginLeft: 4,
  },
  suggestionDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 12,
  },
  addSuggestionButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  addSuggestionText: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.dark.card,
    marginRight: 8,
  },
  categoryButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    marginRight: 8,
    borderRadius: 8,
  },
  selectedFrequencyButton: {
    backgroundColor: Colors.dark.primary,
  },
  frequencyButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  selectedFrequencyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.dark.inactive,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});