import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Modal, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import ProgressPhotoCard from '@/components/ProgressPhotoCard';
import SafeWrapper from '@/components/SafeWrapper';
import { Camera, Plus, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProgressPhoto } from '@/types';

export default function ProgressScreen() {
  const router = useRouter();
  const profile = useUserStore(state => state.profile);
  const addProgressPhoto = useUserStore(state => state.addProgressPhoto);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  
  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]?.uri || null);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      // Show user-friendly error message
    }
  };

  const handleSavePhoto = () => {
    if (selectedImage) {
      const newPhoto: ProgressPhoto = {
        id: Date.now().toString(),
        uri: selectedImage,
        date: new Date().toISOString(),
        notes: notes.trim() || undefined,
      };
      
      addProgressPhoto(newPhoto);
      setModalVisible(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setNotes('');
  };

  const handlePhotoPress = (photo: ProgressPhoto) => {
    router.push({
      pathname: '/photo-detail',
      params: { id: photo.id }
    });
  };

  return (
    <SafeWrapper>
      <View style={styles.container}>
        <Stack.Screen 
        options={{ 
          title: "Progress Photos",
          headerRight: () => (
            <Pressable 
              onPress={handleAddPhoto}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Plus color={Colors.dark.text} size={24} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} testID="progress-scroll">
        {profile?.progressPhotos && Array.isArray(profile.progressPhotos) && profile.progressPhotos.length > 0 ? (
          <View style={styles.photoGrid}>
            {profile.progressPhotos.map(photo => (
              <ProgressPhotoCard 
                key={photo.id} 
                photo={photo} 
                onPress={handlePhotoPress}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Camera size={64} color={Colors.dark.inactive} testID="progress-empty-icon" />
            <Text style={styles.emptyStateTitle}>No progress photos yet</Text>
            <Text style={styles.emptyStateText}>
              Take photos regularly to track your progress and see your transformation over time.
            </Text>
            <Pressable 
              style={styles.addButton}
              onPress={handleAddPhoto}
              testID="progress-add-photo"
            >
              <Text style={styles.addButtonText}>Add Your First Photo</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      
      {/* Add Photo Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        testID="progress-add-photo-modal"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} testID="progress-modal-title">Add Progress Photo</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                <View style={styles.imagePreview}>
                  {Platform.OS === 'web' ? (
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                    />
                  ) : (
                    <View 
                      style={styles.nativeImagePlaceholder}
                    />
                  )}
                </View>
              </View>
            )}
            
            <Text style={styles.inputLabel}>Notes (optional)</Text>
            <TextInput
              style={styles.input}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g., Starting point, 3 months progress..."
              placeholderTextColor={Colors.dark.inactive}
              multiline
              numberOfLines={3}
              testID="progress-notes-input"
            />
            
            <Pressable 
              style={styles.saveButton}
              onPress={handleSavePhoto}
              testID="progress-save-photo"
            >
              <Text style={styles.saveButtonText}>Save Photo</Text>
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    marginTop: 16,
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
  selectedImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 266,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
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
    marginBottom: 24,
    height: 80,
    textAlignVertical: 'top',
  },
  nativeImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: Colors.dark.card,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});