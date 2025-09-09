import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { ProgressPhoto } from '@/types';
import Colors from '@/constants/colors';
import { Calendar, Trash2 } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';

type ProgressPhotoCardProps = {
  photo: ProgressPhoto;
  onPress: (photo: ProgressPhoto) => void;
};

const ProgressPhotoCard = ({ photo, onPress }: ProgressPhotoCardProps) => {
  const removeProgressPhoto = useUserStore(state => state.removeProgressPhoto);
  
  const formattedDate = photo?.date ? new Date(photo.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) : 'Unknown date';

  const handleDelete = () => {
    removeProgressPhoto(photo.id);
  };

  return (
    <Pressable 
      testID={`progress-photo-${photo.id}`}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.9 : 1 }
      ]}
      onPress={() => onPress(photo)}
    >
      {photo?.uri ? (
        <Image source={{ uri: photo.uri }} style={styles.image} />
      ) : (
        <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.card }]}> 
          <Text style={{ color: Colors.dark.subtext, fontSize: 12 }}>No image</Text>
        </View>
      )}
      
      <View style={styles.overlay}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={Colors.dark.text} />
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        {photo.notes && (
          <Text style={styles.notes} numberOfLines={1}>
            {photo.notes}
          </Text>
        )}
        
        <Pressable 
          testID={`delete-progress-photo-${photo.id}`}
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Trash2 size={16} color={Colors.dark.error} />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: Colors.dark.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.dark.text,
    marginLeft: 4,
  },
  notes: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressPhotoCard;