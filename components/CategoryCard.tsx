import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '@/constants/categories';
import Colors from '@/constants/colors';
import { HelpCircle } from 'lucide-react-native';

type CategoryCardProps = {
  category: Category;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const router = useRouter();
  
  // Import the icon dynamically
  const getIconComponent = () => {
    try {
      // This is a workaround since we can't dynamically import icons
      // In a real app, you would use a proper icon mapping
      return <HelpCircle color="#FFFFFF" size={24} />;
    } catch (error) {
      return <HelpCircle color="#FFFFFF" size={24} />;
    }
  };

  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.9 : 1 }
      ]}
      onPress={handlePress}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        {getIconComponent()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {category.description}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
});

export default CategoryCard;