import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { Calendar, Trash2, X } from 'lucide-react-native';

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const profile = useUserStore(state => state.profile);
  const removeProgressPhoto = useUserStore(state => state.removeProgressPhoto);
  
  const photo = profile?.progressPhotos.find(p => p.id === id);
  
  const formattedDate = photo?.date 
    ? new Date(photo.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const handleDelete = () => {
    if (id) {
      removeProgressPhoto(id);
      router.back();
    }
  };

  if (!photo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Photo not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          ),
        }} 
      />
      
      <View style={styles.imageContainer}>
        {Platform.OS === 'web' ? (
          <img 
            src={photo.uri} 
            alt="Progress" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              maxHeight: '70vh'
            }}
          />
        ) : (
          <Image 
            source={{ uri: photo.uri }} 
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={Colors.dark.text} />
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        {photo.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notes}>{photo.notes}</Text>
          </View>
        )}
        
        <Pressable 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Trash2 size={20} color={Colors.dark.error} />
          <Text style={styles.deleteText}>Delete Photo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: Colors.dark.background,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 8,
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  notes: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  deleteText: {
    fontSize: 16,
    color: Colors.dark.error,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.error,
    textAlign: 'center',
    marginTop: 24,
  },
});