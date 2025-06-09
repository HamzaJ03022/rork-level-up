export type Tip = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string;
  impact: 1 | 2 | 3 | 4 | 5;
};

export const tips: Tip[] = [
  // Grooming
  {
    id: 'grooming-1',
    categoryId: 'grooming',
    title: 'Find Your Ideal Haircut',
    description: 'Consult with a professional barber to find a haircut that complements your face shape. Square faces suit textured crops, round faces benefit from styles with height, and oval faces work with most styles.',
    difficulty: 'beginner',
    timeRequired: '30-60 minutes',
    impact: 4,
  },
  {
    id: 'grooming-2',
    categoryId: 'grooming',
    title: 'Master Beard Maintenance',
    description: 'Keep your beard well-groomed with regular trimming. Define your neckline and cheek lines. Use beard oil to keep it soft and healthy.',
    difficulty: 'beginner',
    timeRequired: '5-10 minutes daily',
    impact: 4,
  },
  {
    id: 'grooming-3',
    categoryId: 'grooming',
    title: 'Eyebrow Grooming',
    description: 'Clean up stray hairs between and under your eyebrows. Avoid over-plucking - just maintain a natural shape.',
    difficulty: 'beginner',
    timeRequired: '5 minutes weekly',
    impact: 3,
  },
  
  // Skincare
  {
    id: 'skincare-1',
    categoryId: 'skincare',
    title: 'Basic Skincare Routine',
    description: 'Start with a cleanser, moisturizer, and SPF in the morning. At night, cleanse and apply moisturizer. Consistency is key.',
    difficulty: 'beginner',
    timeRequired: '5 minutes, twice daily',
    impact: 5,
  },
  {
    id: 'skincare-2',
    categoryId: 'skincare',
    title: 'Exfoliate Weekly',
    description: 'Use a chemical exfoliant (BHA/AHA) once or twice a week to remove dead skin cells and improve texture.',
    difficulty: 'intermediate',
    timeRequired: '5 minutes, 1-2 times weekly',
    impact: 4,
  },
  {
    id: 'skincare-3',
    categoryId: 'skincare',
    title: 'Targeted Treatments',
    description: 'Add serums with ingredients like niacinamide (for pores), vitamin C (for brightness), or retinol (for texture and anti-aging).',
    difficulty: 'advanced',
    timeRequired: '2 minutes daily',
    impact: 4,
  },
  
  // Fitness
  {
    id: 'fitness-1',
    categoryId: 'fitness',
    title: 'Compound Lifting',
    description: 'Focus on compound exercises like squats, deadlifts, and bench press to build overall muscle mass and boost testosterone.',
    difficulty: 'intermediate',
    timeRequired: '45-60 minutes, 3-4 times weekly',
    impact: 5,
  },
  {
    id: 'fitness-2',
    categoryId: 'fitness',
    title: 'Neck Training',
    description: 'Strengthen your neck with specific exercises to improve your profile and overall appearance.',
    difficulty: 'intermediate',
    timeRequired: '10 minutes, 2-3 times weekly',
    impact: 3,
  },
  {
    id: 'fitness-3',
    categoryId: 'fitness',
    title: 'Body Fat Reduction',
    description: 'Lower your body fat percentage through diet and cardio to enhance facial definition and jawline.',
    difficulty: 'advanced',
    timeRequired: 'Ongoing lifestyle change',
    impact: 5,
  },
  
  // Style
  {
    id: 'style-1',
    categoryId: 'style',
    title: 'Proper Fit',
    description: 'Wear clothes that fit your body type. Consider getting key pieces tailored for a perfect fit.',
    difficulty: 'beginner',
    timeRequired: 'One-time wardrobe assessment',
    impact: 5,
  },
  {
    id: 'style-2',
    categoryId: 'style',
    title: 'Color Coordination',
    description: 'Learn which colors complement your skin tone and build a wardrobe around these colors.',
    difficulty: 'intermediate',
    timeRequired: 'One-time analysis',
    impact: 4,
  },
  {
    id: 'style-3',
    categoryId: 'style',
    title: 'Accessorize Strategically',
    description: 'Add watches, quality belts, and subtle jewelry to elevate basic outfits.',
    difficulty: 'beginner',
    timeRequired: '1 minute daily',
    impact: 3,
  },
  
  // Posture
  {
    id: 'posture-1',
    categoryId: 'posture',
    title: 'Shoulder Alignment',
    description: 'Practice pulling your shoulders back and down. Set reminders to check your posture throughout the day.',
    difficulty: 'beginner',
    timeRequired: 'Ongoing awareness',
    impact: 4,
  },
  {
    id: 'posture-2',
    categoryId: 'posture',
    title: 'Core Strengthening',
    description: 'Strengthen your core muscles with planks and other exercises to support better posture.',
    difficulty: 'intermediate',
    timeRequired: '10 minutes daily',
    impact: 4,
  },
  {
    id: 'posture-3',
    categoryId: 'posture',
    title: 'Mewing Technique',
    description: 'Practice proper tongue posture by keeping your tongue on the roof of your mouth to potentially enhance jawline over time.',
    difficulty: 'intermediate',
    timeRequired: 'Ongoing habit formation',
    impact: 3,
  },
  
  // Confidence
  {
    id: 'confidence-1',
    categoryId: 'confidence',
    title: 'Eye Contact Practice',
    description: 'Maintain comfortable eye contact during conversations to project confidence and engagement.',
    difficulty: 'beginner',
    timeRequired: 'Practice during conversations',
    impact: 4,
  },
  {
    id: 'confidence-2',
    categoryId: 'confidence',
    title: 'Power Posing',
    description: 'Spend 2 minutes in an expansive, powerful pose before important events to boost confidence.',
    difficulty: 'beginner',
    timeRequired: '2 minutes as needed',
    impact: 3,
  },
  {
    id: 'confidence-3',
    categoryId: 'confidence',
    title: 'Voice Training',
    description: 'Practice speaking from your diaphragm with a lower, resonant voice. Record yourself to improve.',
    difficulty: 'intermediate',
    timeRequired: '5-10 minutes daily',
    impact: 4,
  },
  
  // Hygiene
  {
    id: 'hygiene-1',
    categoryId: 'hygiene',
    title: 'Proper Dental Care',
    description: 'Brush teeth twice daily, floss once daily, and use mouthwash to maintain fresh breath and a bright smile. Consider whitening treatments for enhanced appearance.',
    difficulty: 'beginner',
    timeRequired: '5 minutes, twice daily',
    impact: 5,
  },
  {
    id: 'hygiene-2',
    categoryId: 'hygiene',
    title: 'Body Odor Management',
    description: "Use antiperspirant/deodorant daily, shower after workouts, and wear breathable fabrics. Consider fragrance as a finishing touch, but don't overdo it.",
    difficulty: 'beginner',
    timeRequired: '2 minutes daily',
    impact: 5,
  },
  {
    id: 'hygiene-3',
    categoryId: 'hygiene',
    title: 'Nail Care Routine',
    description: 'Keep nails clean and trimmed regularly. Push back cuticles and use hand moisturizer. Well-maintained hands make a strong impression during interactions.',
    difficulty: 'beginner',
    timeRequired: '10 minutes weekly',
    impact: 3,
  },
  {
    id: 'hygiene-4',
    categoryId: 'hygiene',
    title: 'Ear and Nose Hair Maintenance',
    description: 'Regularly trim ear and nose hair using proper tools. These often-overlooked areas can significantly impact your overall appearance.',
    difficulty: 'beginner',
    timeRequired: '2 minutes weekly',
    impact: 4,
  },
];