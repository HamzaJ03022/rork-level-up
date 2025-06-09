import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Routine } from '@/types';
import Colors from '@/constants/colors';
import { Check, Calendar, Trash2, Clock } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';

type RoutineItemProps = {
  routine: Routine;
  onToggle: (id: string, completed: boolean) => void;
};

const RoutineItem = ({ routine, onToggle }: RoutineItemProps) => {
  const removeRoutine = useUserStore(state => state.removeRoutine);
  
  const lastCompletedText = routine.lastCompleted 
    ? new Date(routine.lastCompleted).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Never';

  const handleToggle = () => {
    onToggle(routine.id, !routine.completed);
  };

  const handleDelete = () => {
    removeRoutine(routine.id);
  };

  return (
    <View style={[
      styles.container,
      routine.completed ? styles.completedContainer : {}
    ]}>
      <Pressable 
        style={[
          styles.checkbox,
          routine.completed ? styles.checkboxActive : {}
        ]}
        onPress={handleToggle}
      >
        {routine.completed && <Check size={16} color="#FFFFFF" />}
      </Pressable>
      
      <View style={styles.content}>
        <Text style={[
          styles.title,
          routine.completed ? styles.completedTitle : {}
        ]}>
          {routine.title}
        </Text>
        
        {routine.description && (
          <Text style={[
            styles.description,
            routine.completed ? styles.completedDescription : {}
          ]} numberOfLines={2}>
            {routine.description}
          </Text>
        )}
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar size={12} color={Colors.dark.subtext} />
            <Text style={styles.meta}>
              {routine.frequency}
            </Text>
          </View>
          
          {routine.lastCompleted && (
            <View style={styles.metaItem}>
              <Clock size={12} color={Colors.dark.subtext} />
              <Text style={styles.meta}>
                last: {lastCompletedText}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Pressable 
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Trash2 size={16} color={Colors.dark.inactive} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  completedContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: Colors.dark.success,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.dark.success,
    borderColor: Colors.dark.success,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.dark.subtext,
  },
  description: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 8,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  meta: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
    marginTop: 2,
  },
});

export default RoutineItem;