export type Category = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
};

export const categories: Category[] = [
  {
    id: 'grooming',
    title: 'Grooming',
    icon: 'scissors',
    description: 'Facial hair, haircuts, and general grooming tips',
    color: '#6366F1',
  },
  {
    id: 'skincare',
    title: 'Skincare',
    icon: 'sparkles',
    description: 'Routines and products for clear, healthy skin',
    color: '#8B5CF6',
  },
  {
    id: 'fitness',
    title: 'Fitness',
    icon: 'dumbbell',
    description: 'Workouts to enhance physique and facial structure',
    color: '#10B981',
  },
  {
    id: 'style',
    title: 'Style',
    icon: 'shirt',
    description: 'Fashion advice to elevate your appearance',
    color: '#F59E0B',
  },
  {
    id: 'posture',
    title: 'Posture',
    icon: 'activity',
    description: 'Improve stance and body language',
    color: '#EC4899',
  },
  {
    id: 'confidence',
    title: 'Confidence',
    icon: 'smile',
    description: 'Mental techniques to boost self-image',
    color: '#14B8A6',
  },
  {
    id: 'hygiene',
    title: 'Hygiene',
    icon: 'droplets',
    description: 'Personal cleanliness and odor management',
    color: '#3B82F6',
  },
];