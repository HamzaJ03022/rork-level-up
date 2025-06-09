import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Modal } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';
import { tips } from '@/constants/tips';
import { categories } from '@/constants/categories';
import { Star, Clock, BarChart, Check, Plus, X } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { Routine } from '@/types';

export default function TipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useUserStore(state => state.profile);
  const markTipCompleted = useUserStore(state => state.markTipCompleted);
  const addRoutine = useUserStore(state => state.addRoutine);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const tip = tips.find(t => t.id === id);
  const category = tip ? categories.find(cat => cat.id === tip.categoryId) : null;
  
  const isCompleted = profile?.completedTips.includes(id || '');

  const handleMarkComplete = () => {
    if (!isCompleted && id) {
      markTipCompleted(id);
    }
  };

  const handleAddToRoutine = () => {
    setModalVisible(true);
  };

  const handleConfirmAddToRoutine = () => {
    if (tip && category) {
      const newRoutine: Routine = {
        id: `routine-${Date.now()}`,
        title: tip.title,
        description: tip.description,
        categoryId: tip.categoryId,
        frequency: selectedFrequency,
        completed: false,
      };
      
      addRoutine(newRoutine);
      setModalVisible(false);
    }
  };

  // Render impact stars
  const renderImpact = () => {
    if (!tip) return null;
    
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          color={i < tip.impact ? Colors.dark.primary : Colors.dark.inactive}
          fill={i < tip.impact ? Colors.dark.primary : 'none'}
        />
      );
    }
    return stars;
  };

  if (!tip || !category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tip not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: tip.title }} />
      
      <View style={styles.header}>
        <Text style={styles.category} numberOfLines={1}>
          {category.title}
        </Text>
        <Text style={styles.title}>{tip.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.dark.subtext} />
            <Text style={styles.metaText}>{tip.timeRequired}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <BarChart size={16} color={Colors.dark.subtext} />
            <Text style={styles.metaText}>{tip.difficulty}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.impactContainer}>
        <Text style={styles.impactLabel}>Impact Level:</Text>
        <View style={styles.starsContainer}>
          {renderImpact()}
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>How to do it</Text>
        <Text style={styles.description}>{tip.description}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.addToRoutineButton}
          onPress={handleAddToRoutine}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addToRoutineText}>Add to Routine</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.completeButton,
            isCompleted ? styles.completedButton : {}
          ]}
          onPress={handleMarkComplete}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.completedButtonText}>Completed</Text>
            </>
          ) : (
            <Text style={styles.completeButtonText}>Mark as Completed</Text>
          )}
        </Pressable>
      </View>
      
      {/* Frequency Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Routine</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            <Text style={styles.modalText}>
              How often would you like to do this?
            </Text>
            
            <View style={styles.frequencyContainer}>
              {['daily', 'weekly', 'monthly'].map((frequency) => (
                <Pressable
                  key={frequency}
                  style={[
                    styles.frequencyButton,
                    selectedFrequency === frequency ? styles.selectedFrequencyButton : {}
                  ]}
                  onPress={() => setSelectedFrequency(frequency as 'daily' | 'weekly' | 'monthly')}
                >
                  <Text 
                    style={[
                      styles.frequencyButtonText,
                      selectedFrequency === frequency ? styles.selectedFrequencyText : {}
                    ]}
                  >
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            <Pressable 
              style={styles.confirmButton}
              onPress={handleConfirmAddToRoutine}
            >
              <Text style={styles.confirmButtonText}>Add to Routine</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
  },
  category: {
    fontSize: 14,
    color: Colors.dark.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginLeft: 4,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  impactLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginRight: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  descriptionContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.dark.text,
  },
  buttonContainer: {
    gap: 12,
  },
  addToRoutineButton: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToRoutineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    backgroundColor: Colors.dark.success,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.error,
    textAlign: 'center',
    marginTop: 24,
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
  modalText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
  },
  selectedFrequencyButton: {
    backgroundColor: Colors.dark.primary,
  },
  frequencyButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  selectedFrequencyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});