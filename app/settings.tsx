import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Switch, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { Save, Camera, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen() {
  const router = useRouter();
  const profile = useUserStore(state => state.profile);
  const setProfile = useUserStore(state => state.setProfile);
  
  const [name, setName] = useState(profile?.name || '');
  const [age, setAge] = useState(profile?.age ? profile.age.toString() : '');
  
  // Height and weight
  const [heightValue, setHeightValue] = useState(
    profile?.height ? profile.height.value.toString() : ''
  );
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(
    profile?.height ? profile.height.unit : 'cm'
  );
  const [weightValue, setWeightValue] = useState(
    profile?.weight ? profile.weight.value.toString() : ''
  );
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    profile?.weight ? profile.weight.unit : 'kg'
  );
  
  // Photos
  const [facePhoto, setFacePhoto] = useState<string | undefined>(profile?.facePhoto);
  const [bodyPhoto, setBodyPhoto] = useState<string | undefined>(profile?.bodyPhoto);
  
  // Notification settings
  const [dailyReminders, setDailyReminders] = useState(true);
  const [progressReminders, setProgressReminders] = useState(true);
  
  // Error states
  const [photoError, setPhotoError] = useState<string | null>(null);
  
  const handlePickFacePhoto = async () => {
    try {
      setPhotoError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFacePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking face photo:', error);
      setPhotoError('Failed to select image. Please try again.');
    }
  };

  const handlePickBodyPhoto = async () => {
    try {
      setPhotoError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setBodyPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking body photo:', error);
      setPhotoError('Failed to select image. Please try again.');
    }
  };

  const handleSave = () => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      name: name.trim(),
      age: age ? parseInt(age, 10) : undefined,
      height: heightValue ? {
        value: parseFloat(heightValue),
        unit: heightUnit
      } : undefined,
      weight: weightValue ? {
        value: parseFloat(weightValue),
        unit: weightUnit
      } : undefined,
      facePhoto,
      bodyPhoto,
    };
    
    setProfile(updatedProfile);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Settings",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <ArrowLeft size={24} color={Colors.dark.text} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleSave} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Save size={24} color={Colors.dark.primary} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={Colors.dark.inactive}
        />
        
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={(text) => {
            // Allow only numbers
            if (/^\d*$/.test(text)) {
              setAge(text);
            }
          }}
          placeholder="Enter your age"
          placeholderTextColor={Colors.dark.inactive}
          keyboardType="numeric"
        />
        
        <Text style={styles.sectionTitle}>Measurements</Text>
        
        <View style={styles.measurementGroup}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.measurementInputRow}>
            <TextInput
              style={styles.measurementInput}
              value={heightValue}
              onChangeText={(text) => {
                // Allow numbers and decimal point
                if (/^(\d*\.?\d*)$/.test(text)) {
                  setHeightValue(text);
                }
              }}
              placeholder="Enter height"
              placeholderTextColor={Colors.dark.inactive}
              keyboardType="numeric"
            />
            
            <View style={styles.unitSelector}>
              <Pressable
                style={[
                  styles.unitButton,
                  heightUnit === 'cm' && styles.selectedUnitButton
                ]}
                onPress={() => setHeightUnit('cm')}
              >
                <Text style={[
                  styles.unitButtonText,
                  heightUnit === 'cm' && styles.selectedUnitText
                ]}>cm</Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.unitButton,
                  heightUnit === 'ft' && styles.selectedUnitButton
                ]}
                onPress={() => setHeightUnit('ft')}
              >
                <Text style={[
                  styles.unitButtonText,
                  heightUnit === 'ft' && styles.selectedUnitText
                ]}>ft</Text>
              </Pressable>
            </View>
          </View>
        </View>
        
        <View style={styles.measurementGroup}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.measurementInputRow}>
            <TextInput
              style={styles.measurementInput}
              value={weightValue}
              onChangeText={(text) => {
                // Allow numbers and decimal point
                if (/^(\d*\.?\d*)$/.test(text)) {
                  setWeightValue(text);
                }
              }}
              placeholder="Enter weight"
              placeholderTextColor={Colors.dark.inactive}
              keyboardType="numeric"
            />
            
            <View style={styles.unitSelector}>
              <Pressable
                style={[
                  styles.unitButton,
                  weightUnit === 'kg' && styles.selectedUnitButton
                ]}
                onPress={() => setWeightUnit('kg')}
              >
                <Text style={[
                  styles.unitButtonText,
                  weightUnit === 'kg' && styles.selectedUnitText
                ]}>kg</Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.unitButton,
                  weightUnit === 'lbs' && styles.selectedUnitButton
                ]}
                onPress={() => setWeightUnit('lbs')}
              >
                <Text style={[
                  styles.unitButtonText,
                  weightUnit === 'lbs' && styles.selectedUnitText
                ]}>lbs</Text>
              </Pressable>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Profile Photos</Text>
        
        <View style={styles.photoSection}>
          <Text style={styles.label}>Face Photo</Text>
          <View style={styles.photoContainer}>
            {facePhoto ? (
              <View style={styles.photoPreviewContainer}>
                {Platform.OS === 'web' ? (
                  <img 
                    src={facePhoto} 
                    alt="Face" 
                    style={{ 
                      width: 120, 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 60 
                    }}
                  />
                ) : (
                  <Image 
                    source={{ uri: facePhoto }} 
                    style={styles.facePhotoPreview} 
                  />
                )}
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={32} color={Colors.dark.inactive} />
              </View>
            )}
            
            <Pressable 
              style={styles.changePhotoButton}
              onPress={handlePickFacePhoto}
            >
              <Text style={styles.changePhotoText}>
                {facePhoto ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </Pressable>
          </View>
          
          <Text style={styles.label}>Body Photo</Text>
          <View style={styles.photoContainer}>
            {bodyPhoto ? (
              <View style={styles.photoPreviewContainer}>
                {Platform.OS === 'web' ? (
                  <img 
                    src={bodyPhoto} 
                    alt="Body" 
                    style={{ 
                      width: 90, 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 12 
                    }}
                  />
                ) : (
                  <Image 
                    source={{ uri: bodyPhoto }} 
                    style={styles.bodyPhotoPreview} 
                  />
                )}
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={32} color={Colors.dark.inactive} />
              </View>
            )}
            
            <Pressable 
              style={styles.changePhotoButton}
              onPress={handlePickBodyPhoto}
            >
              <Text style={styles.changePhotoText}>
                {bodyPhoto ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </Pressable>
          </View>
          
          {photoError && (
            <Text style={styles.errorText}>{photoError}</Text>
          )}
        </View>
        
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Daily Routine Reminders</Text>
            <Text style={styles.settingDescription}>
              Receive reminders for your daily routines
            </Text>
          </View>
          <Switch
            value={dailyReminders}
            onValueChange={setDailyReminders}
            trackColor={{ false: Colors.dark.inactive, true: Colors.dark.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Progress Photo Reminders</Text>
            <Text style={styles.settingDescription}>
              Get reminded to take progress photos weekly
            </Text>
          </View>
          <Switch
            value={progressReminders}
            onValueChange={setProgressReminders}
            trackColor={{ false: Colors.dark.inactive, true: Colors.dark.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.saveButtonContainer}>
          <Pressable 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  measurementGroup: {
    marginBottom: 16,
  },
  measurementInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementInput: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    marginRight: 12,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    overflow: 'hidden',
  },
  unitButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedUnitButton: {
    backgroundColor: Colors.dark.primary,
  },
  unitButtonText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  selectedUnitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  photoSection: {
    marginBottom: 16,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPreviewContainer: {
    marginRight: 16,
  },
  facePhotoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  bodyPhotoPreview: {
    width: 90,
    height: 120,
    borderRadius: 12,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  changePhotoButton: {
    backgroundColor: Colors.dark.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.dark.primary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.dark.error,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  saveButtonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});