import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { LogOut, Calendar, Award, Settings, Ruler, Weight, CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appearanceGoals } from '@/constants/appearance-goals';
import { motivationalGoals } from '@/constants/motivational-goals';

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useUserStore(state => state.profile);
  const setOnboarded = useUserStore(state => state.setOnboarded);
  
  const startDate = profile?.startDate 
    ? new Date(profile.startDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown';
  
  const daysActive = profile?.startDate 
    ? Math.floor((new Date().getTime() - new Date(profile.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const completedTipsCount = profile?.completedTips.length || 0;
  const selectedRoutinesCount = profile?.selectedImprovementRoutines?.length || 0;
  
  const formatHeight = () => {
    if (!profile?.height) return 'Not specified';
    
    if (profile.height.unit === 'cm') {
      return `${profile.height.value} cm`;
    } else {
      // Convert decimal feet to feet and inches
      const feet = Math.floor(profile.height.value);
      const inches = Math.round((profile.height.value - feet) * 12);
      return `${feet}'${inches}"`;
    }
  };
  
  const formatWeight = () => {
    if (!profile?.weight) return 'Not specified';
    return `${profile.weight.value} ${profile.weight.unit}`;
  };
  
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out? This will reset all your data.');
      if (confirmed) {
        resetApp();
      }
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out? This will reset all your data.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive', onPress: resetApp }
        ]
      );
    }
  };

  const resetApp = async () => {
    try {
      await AsyncStorage.clear();
      setOnboarded(false);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  // Get selected motivational goals
  const selectedMotivationalGoalDetails = profile?.selectedMotivationalGoals
    ? profile.selectedMotivationalGoals.map(goalId => 
        motivationalGoals.find(goal => goal.id === goalId)
      ).filter(Boolean)
    : [];

  // Get selected improvement routines
  const selectedRoutineDetails = profile?.selectedImprovementRoutines
    ? profile.selectedImprovementRoutines.map(routineId => 
        appearanceGoals.find(goal => goal.id === routineId)
      ).filter(Boolean)
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="profile-scroll">
      <Stack.Screen options={{ title: "Profile" }} />
      
      <View style={styles.header}>
        {profile?.facePhoto ? (
          <View style={styles.profilePhotoContainer}>
            {Platform.OS === 'web' ? (
              <img 
                src={profile.facePhoto} 
                alt="Profile" 
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 40, 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              <Image 
                source={{ uri: profile.facePhoto }} 
                style={styles.profilePhoto} 
              />
            )}
          </View>
        ) : (
          <View style={styles.profileInitial}>
            <Text style={styles.initialText}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{profile?.name || 'User'}</Text>
        {profile?.age && (
          <Text style={styles.age}>{profile.age} years old</Text>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Calendar size={20} color={Colors.dark.primary} />
          <Text style={styles.statValue}>{daysActive}</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <CheckCircle size={20} color={Colors.dark.primary} />
          <Text style={styles.statValue}>{selectedRoutinesCount}</Text>
          <Text style={styles.statLabel}>Routines</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Award size={20} color={Colors.dark.primary} />
          <Text style={styles.statValue}>{completedTipsCount}</Text>
          <Text style={styles.statLabel}>Tips Done</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Measurements</Text>
        <View style={styles.measurementsContainer}>
          <View style={styles.measurementItem}>
            <Ruler size={20} color={Colors.dark.primary} />
            <View style={styles.measurementContent}>
              <Text style={styles.measurementLabel}>Height</Text>
              <Text style={styles.measurementValue}>{formatHeight()}</Text>
            </View>
          </View>
          
          <View style={styles.measurementDivider} />
          
          <View style={styles.measurementItem}>
            <Weight size={20} color={Colors.dark.primary} />
            <View style={styles.measurementContent}>
              <Text style={styles.measurementLabel}>Weight</Text>
              <Text style={styles.measurementValue}>{formatWeight()}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Started On</Text>
          <Text style={styles.infoValue}>{startDate}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Your Motivations</Text>
        {selectedMotivationalGoalDetails.length > 0 ? (
          <View style={styles.goalsContainer}>
            {selectedMotivationalGoalDetails.map((goal, index) => (
              goal && (
                <View key={index} style={styles.motivationItem}>
                  <Text style={styles.motivationText}>{goal.title}</Text>
                </View>
              )
            ))}
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.emptyText}>No motivations set yet</Text>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Your Improvement Routines</Text>
        {selectedRoutineDetails.length > 0 ? (
          <View style={styles.goalsContainer}>
            {selectedRoutineDetails.map((goal, index) => (
              goal && (
                <View key={index} style={styles.goalItem}>
                  <Text style={styles.goalText}>{goal.title}</Text>
                  <Text style={styles.goalFrequency}>
                    {goal.recommendedFrequency === 'daily' ? 'Daily' : 
                     goal.recommendedFrequency === 'weekly' ? 'Weekly' : 'Monthly'}
                  </Text>
                </View>
              )
            ))}
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.emptyText}>No routines set yet</Text>
          </View>
        )}
        
        {profile?.bodyPhoto && (
          <>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.bodyPhotoContainer}>
              {Platform.OS === 'web' ? (
                <img 
                  src={profile.bodyPhoto} 
                  alt="Body" 
                  style={{ 
                    width: '100%', 
                    height: 300, 
                    objectFit: 'cover', 
                    borderRadius: 12 
                  }}
                />
              ) : (
                <Image 
                  source={{ uri: profile.bodyPhoto }} 
                  style={styles.bodyPhoto} 
                  resizeMode="cover"
                />
              )}
              <Text style={styles.photoLabel}>Starting Photo</Text>
            </View>
          </>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={navigateToSettings} testID="profile-settings">
          <Settings size={20} color={Colors.dark.text} />
          <Text style={styles.actionText}>Settings</Text>
        </Pressable>
        
        <Pressable style={styles.logoutButton} onPress={handleLogout} testID="profile-logout">
          <LogOut size={20} color={Colors.dark.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  profileInitial: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePhotoContainer: {
    marginBottom: 12,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  initialText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  measurementsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  measurementItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementContent: {
    marginLeft: 12,
  },
  measurementLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  measurementDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 16,
  },
  infoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.inactive,
    textAlign: 'center',
  },
  goalsContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  motivationItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  goalItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: Colors.dark.text,
    flex: 1,
  },
  goalFrequency: {
    fontSize: 12,
    color: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  bodyPhotoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  bodyPhoto: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  photoLabel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
    color: '#FFFFFF',
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.dark.error,
    marginLeft: 12,
  },
});