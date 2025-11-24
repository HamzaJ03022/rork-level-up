import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  Platform, 
  Image, 
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { ChevronRight, Camera, Check, Brain, ArrowRight, ChevronLeft } from 'lucide-react-native';
import { UserProfile } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { appearanceGoals } from '@/constants/appearance-goals';
import { motivationalGoals } from '@/constants/motivational-goals';
import { categories } from '@/constants/categories';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const setProfile = useUserStore(state => state.setProfile);
  const setOnboarded = useUserStore(state => state.setOnboarded);
  const setAIAnalysis = useUserStore(state => state.setAIAnalysis);
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  
  // Height and weight
  const [heightValue, setHeightValue] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  
  // Photos
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  
  // Current routines/habits
  const [currentRoutines, setCurrentRoutines] = useState<string[]>([]);
  
  // Selected motivational goals
  const [selectedMotivationalGoals, setSelectedMotivationalGoals] = useState<string[]>([]);
  
  // Selected improvement routines
  const [selectedImprovementRoutines, setSelectedImprovementRoutines] = useState<string[]>([]);
  
  // AI Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  // Error states
  const [photoError, setPhotoError] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0.125)).current;

  // Animate progress bar when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / 8,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [step, progressAnim]);

  const animateTransition = (nextStep: number) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start(() => {
      // Change step
      setStep(nextStep);
      
      // Reset slide position
      slideAnim.setValue(width * 0.1);
      
      // Slide in and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    });
  };

  const handleNext = () => {
    if (step < 8) {
      // If we're on step 5 (routines) and moving to step 6 (AI analysis)
      // Start the analysis process
      if (step === 5) {
        performAIAnalysis();
      } else {
        animateTransition(step + 1);
      }
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      animateTransition(step - 1);
    }
  };

  const handleSkip = () => {
    if (step === 2) { // Skip measurements
      animateTransition(3);
    } else if (step === 5) { // Skip current routines
      performAIAnalysis();
    }
  };

  const toggleMotivationalGoalSelection = (goalId: string) => {
    if (selectedMotivationalGoals.includes(goalId)) {
      setSelectedMotivationalGoals(selectedMotivationalGoals.filter(id => id !== goalId));
    } else {
      setSelectedMotivationalGoals([...selectedMotivationalGoals, goalId]);
    }
  };

  const toggleImprovementRoutineSelection = (routineId: string) => {
    if (selectedImprovementRoutines.includes(routineId)) {
      setSelectedImprovementRoutines(selectedImprovementRoutines.filter(id => id !== routineId));
    } else {
      setSelectedImprovementRoutines([...selectedImprovementRoutines, routineId]);
    }
  };

  const toggleRoutineSelection = (routineId: string) => {
    if (currentRoutines.includes(routineId)) {
      setCurrentRoutines(currentRoutines.filter(id => id !== routineId));
    } else {
      setCurrentRoutines([...currentRoutines, routineId]);
    }
  };

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

  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // In a real app, we would send the photos to an AI service
      // For this demo, we'll simulate an analysis with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check which routines the user currently follows
      const hasSkincare = currentRoutines.some(r => r.includes('skincare'));
      const hasWorkout = currentRoutines.some(r => r.includes('workout'));
      const hasGrooming = currentRoutines.some(r => r.includes('grooming'));
      const hasPosture = currentRoutines.some(r => r.includes('posture'));
      const hasHydration = currentRoutines.some(r => r.includes('hydration'));
      const hasProtein = currentRoutines.some(r => r.includes('protein'));
      const hasStyle = currentRoutines.some(r => r.includes('style'));

      
      // Generate personalized analysis based on current routines
      const mockAnalysis = {
        face: {
          strengths: [
            hasGrooming ? "You're already maintaining your facial appearance well" : "Good natural facial structure",
            "Strong facial symmetry potential",
            hasGrooming ? "Your attention to facial grooming shows in your appearance" : "Natural facial features with good potential"
          ],
          suggestions: [
            hasSkincare ? "Continue your skincare routine and consider adding targeted treatments for even better results" : "Implementing a basic skincare routine would significantly enhance your facial appearance",
            hasGrooming ? "Experiment with different facial hair styles to find what best complements your face shape" : "Consider facial hair grooming to enhance your facial structure",
            "Daily facial exercises would help define your jawline and facial muscles, taking your appearance to the next level"
          ]
        },
        skin: {
          strengths: [
            hasSkincare ? "Your commitment to skincare is evident in your complexion" : "Natural skin tone with good potential",
            hasSkincare ? "Your current skincare routine has established a good foundation" : "No major skin concerns visible",
            hasHydration ? "Your hydration habits are benefiting your skin's appearance" : "Natural skin resilience"
          ],
          suggestions: [
            hasSkincare ? "Level up your routine by adding exfoliation 2-3 times weekly for improved texture and glow" : "Starting with a basic cleanser and moisturizer would transform your skin's appearance",
            hasSkincare ? "Adding a vitamin C serum would enhance your current routine and boost your skin's radiance" : "Daily SPF protection would prevent premature aging and maintain your skin's youthful appearance",
            hasHydration ? "Continue your excellent hydration habits for optimal skin health" : "Increasing your daily water intake would dramatically improve your skin's appearance and health"
          ]
        },
        hair: {
          strengths: [
            hasGrooming ? "Your attention to hair care is evident" : "Good natural hair density and texture",
            hasGrooming ? "Your current hair maintenance provides a solid foundation" : "Natural hair color complements your complexion well",
            hasGrooming ? "Regular grooming shows discipline and attention to detail" : "Hair has potential for various styling options"
          ],
          suggestions: [
            hasGrooming ? "Experiment with different styling products to enhance texture and definition" : "A structured haircut would significantly elevate your appearance",
            hasGrooming ? "Consider a professional consultation for a style that best frames your face shape" : "Regular trims every 4-6 weeks would keep your style looking intentional and fresh",
            hasGrooming ? "Adding a weekly deep conditioning treatment would take your hair care to the next level" : "Developing a basic hair care routine would transform your overall appearance"
          ]
        },
        body: {
          strengths: [
            hasWorkout ? "Your commitment to physical fitness is showing positive results" : "Good natural physique with potential",
            hasWorkout ? "Current exercise routine has established a foundation to build upon" : "Balanced body proportions",
            hasProtein ? "Your attention to nutrition supports your physical development" : "Natural frame with good potential for development"
          ],
          suggestions: [
            hasWorkout ? "Incorporating more compound exercises would accelerate your physical development" : "Starting with just 2-3 strength training sessions weekly would transform your physique",
            hasWorkout ? "Adding progressive overload to your routine would take your results to the next level" : "Building muscle would significantly enhance your overall appearance and confidence",
            hasProtein ? "Continue prioritizing protein intake for optimal muscle development" : "Increasing protein consumption would support muscle growth and definition"
          ]
        },
        posture: {
          strengths: [
            hasPosture ? "Your awareness of posture importance is evident" : "Natural stance with improvement potential",
            hasPosture ? "Current posture habits provide a good foundation" : "No major postural issues observed"
          ],
          suggestions: [
            hasPosture ? "Daily posture exercises would enhance your current efforts" : "Practicing standing tall with shoulders back would instantly improve your appearance",
            hasPosture ? "Adding core-strengthening exercises would support your posture goals" : "Strengthening your core and back muscles would dramatically improve your posture",
            hasPosture ? "Continue your posture awareness throughout the day" : "Setting hourly reminders to check posture would create lasting improvement"
          ]
        },
        style: {
          strengths: [
            hasStyle ? "Your attention to clothing choices shows good style awareness" : "Potential for style development",
            hasStyle ? "Current outfit planning provides a good foundation" : "Natural style sensibility"
          ],
          suggestions: [
            hasStyle ? "Developing a more cohesive wardrobe with versatile pieces would elevate your style" : "Investing in well-fitted basics would transform your appearance",
            hasStyle ? "Adding statement accessories would enhance your current style" : "Learning about color theory and which colors complement your complexion would improve your style",
            hasStyle ? "Continue developing your personal style identity" : "Creating a signature look would help you stand out and make memorable impressions"
          ]
        },
        priorityAreas: [
          !hasSkincare ? "Basic skincare routine" : "Advanced skincare techniques",
          !hasWorkout ? "Strength training fundamentals" : "Progressive strength development",
          !hasPosture ? "Posture improvement" : "Advanced posture refinement",
          !hasGrooming ? "Grooming essentials" : "Refined grooming techniques",
          !hasHydration ? "Hydration habits" : "Nutrition optimization"
        ]
      };
      
      setAnalysisResults(mockAnalysis);
      setAIAnalysis(mockAnalysis);
      setAnalysisComplete(true);
      animateTransition(6);
    } catch (error) {
      console.error('Error during analysis:', error);
      // Move to next step anyway in case of error
      animateTransition(6);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const completeOnboarding = () => {
    // Create initial routines based on selected improvement routines
    const initialRoutines = selectedImprovementRoutines.map(routineId => {
      const routine = appearanceGoals.find(g => g.id === routineId);
      return {
        id: `routine-${Date.now()}-${routineId}`,
        title: routine?.title || '',
        description: routine?.description || '',
        categoryId: routine?.category || 'other',
        frequency: routine?.recommendedFrequency || 'daily',
        completed: false,
        lastCompleted: undefined,
      };
    });
    
    const newProfile: UserProfile = {
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
      facePhoto: facePhoto || undefined,
      bodyPhoto: bodyPhoto || undefined,
      currentRoutines: currentRoutines,
      selectedMotivationalGoals: selectedMotivationalGoals,
      selectedImprovementRoutines: selectedImprovementRoutines,
      startDate: new Date().toISOString(),
      progressPhotos: [],
      routines: initialRoutines,
      completedTips: [],
    };
    
    setProfile(newProfile);
    setOnboarded(true);
    router.replace('/');
  };

  const isNextDisabled = () => {
    if (step === 1) {
      return name.trim() === '';
    }
    if (step === 3) {
      return !facePhoto;
    }
    if (step === 4) {
      return !bodyPhoto;
    }
    if (step === 6) {
      return isAnalyzing;
    }
    if (step === 7) {
      return selectedMotivationalGoals.length === 0;
    }
    if (step === 8) {
      return selectedImprovementRoutines.length === 0;
    }
    return false;
  };

  // Daily routines/habits that users can select from
  const dailyRoutineOptions = [
    {
      id: 'skincare-morning',
      title: 'Morning Skincare Routine',
      category: 'skincare',
      description: 'Cleansing, moisturizing, SPF application'
    },
    {
      id: 'skincare-evening',
      title: 'Evening Skincare Routine',
      category: 'skincare',
      description: 'Cleansing, treatments, moisturizing'
    },
    {
      id: 'workout-strength',
      title: 'Strength Training',
      category: 'fitness',
      description: 'Weight lifting, resistance training'
    },
    {
      id: 'workout-cardio',
      title: 'Cardio Exercise',
      category: 'fitness',
      description: 'Running, cycling, swimming, etc.'
    },
    {
      id: 'grooming-hair',
      title: 'Hair Styling',
      category: 'grooming',
      description: 'Regular haircuts, daily styling'
    },
    {
      id: 'grooming-beard',
      title: 'Beard Maintenance',
      category: 'grooming',
      description: 'Trimming, shaping, conditioning'
    },
    {
      id: 'posture-practice',
      title: 'Posture Practice',
      category: 'posture',
      description: 'Conscious posture correction throughout the day'
    },
    {
      id: 'hygiene-dental',
      title: 'Dental Care',
      category: 'hygiene',
      description: 'Brushing, flossing, mouthwash'
    },
    {
      id: 'style-outfits',
      title: 'Outfit Planning',
      category: 'style',
      description: 'Selecting well-fitted, coordinated clothing'
    },
    {
      id: 'nutrition-hydration',
      title: 'Hydration',
      category: 'nutrition',
      description: 'Drinking adequate water throughout the day'
    },
    {
      id: 'nutrition-protein',
      title: 'Protein Intake',
      category: 'nutrition',
      description: 'Consuming sufficient protein for muscle growth'
    }
  ];

  // Group routine options by category
  const groupedRoutineOptions = dailyRoutineOptions.reduce((acc, routine) => {
    if (!acc[routine.category]) {
      acc[routine.category] = [];
    }
    acc[routine.category].push(routine);
    return acc;
  }, {} as Record<string, typeof dailyRoutineOptions>);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.dark.inactive}
              autoFocus={Platform.OS !== 'web'}
            />
            
            <Text style={styles.label}>Age (optional)</Text>
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
            
            <View style={styles.welcomeImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbiUyMGNvbmZpZGVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60' }} 
                style={styles.welcomeImage} 
              />
              <Text style={styles.welcomeText}>
                Level Up helps you track your appearance transformation journey with personalized routines and progress tracking.
              </Text>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.measurementsContainer}>
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
            
            <Text style={styles.optionalText}>
              This information helps us provide more personalized advice. You can skip this step if you prefer.
            </Text>
            
            <View style={styles.measurementImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVhc3VyZW1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60' }} 
                style={styles.measurementImage} 
              />
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.photoContainer}>
            <Text style={styles.photoInstructions}>
              Upload a clear, well-lit photo of your face. This helps us provide personalized advice for facial features.
            </Text>
            
            {facePhoto ? (
              <View style={styles.photoPreviewContainer}>
                {Platform.OS === 'web' ? (
                  <img 
                    src={facePhoto} 
                    alt="Face" 
                    style={{ 
                      width: 200, 
                      height: 200, 
                      objectFit: 'cover', 
                      borderRadius: 100 
                    }}
                  />
                ) : (
                  <Image 
                    source={{ uri: facePhoto }} 
                    style={styles.facePhotoPreview} 
                  />
                )}
                <View style={styles.photoCheckmark}>
                  <Check size={24} color="#FFFFFF" />
                </View>
              </View>
            ) : (
              <Pressable 
                style={styles.photoUploadButton}
                onPress={handlePickFacePhoto}
              >
                <Camera size={40} color={Colors.dark.primary} />
                <Text style={styles.photoUploadText}>Tap to Upload Face Photo</Text>
              </Pressable>
            )}
            
            {photoError && (
              <Text style={styles.errorText}>{photoError}</Text>
            )}
            
            {facePhoto && (
              <Pressable 
                style={styles.changePhotoButton}
                onPress={handlePickFacePhoto}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </Pressable>
            )}
            
            <View style={styles.photoTipsContainer}>
              <Text style={styles.photoTipsTitle}>Tips for a good photo:</Text>
              <Text style={styles.photoTip}>• Use natural lighting</Text>
              <Text style={styles.photoTip}>• Face the camera directly</Text>
              <Text style={styles.photoTip}>• Use a neutral expression</Text>
              <Text style={styles.photoTip}>• Avoid filters or heavy editing</Text>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.photoContainer}>
            <Text style={styles.photoInstructions}>
              Upload a full-body photo in neutral clothing. This helps us provide advice on physique and posture.
            </Text>
            
            {bodyPhoto ? (
              <View style={styles.photoPreviewContainer}>
                {Platform.OS === 'web' ? (
                  <img 
                    src={bodyPhoto} 
                    alt="Body" 
                    style={{ 
                      width: 150, 
                      height: 200, 
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
                <View style={styles.photoCheckmark}>
                  <Check size={24} color="#FFFFFF" />
                </View>
              </View>
            ) : (
              <Pressable 
                style={styles.photoUploadButton}
                onPress={handlePickBodyPhoto}
              >
                <Camera size={40} color={Colors.dark.primary} />
                <Text style={styles.photoUploadText}>Tap to Upload Full Body Photo</Text>
              </Pressable>
            )}
            
            {photoError && (
              <Text style={styles.errorText}>{photoError}</Text>
            )}
            
            {bodyPhoto && (
              <Pressable 
                style={styles.changePhotoButton}
                onPress={handlePickBodyPhoto}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </Pressable>
            )}
            
            <View style={styles.photoTipsContainer}>
              <Text style={styles.photoTipsTitle}>Tips for a good photo:</Text>
              <Text style={styles.photoTip}>• Stand against a plain background</Text>
              <Text style={styles.photoTip}>• Wear fitted but comfortable clothing</Text>
              <Text style={styles.photoTip}>• Stand with natural posture</Text>
              <Text style={styles.photoTip}>• Use good lighting</Text>
            </View>
          </View>
        );
      
      case 5:
        return (
          <View style={styles.routinesContainer}>
            <Text style={styles.routinesInstructions}>
              Select the routines you already follow regularly. This helps us understand your current habits.
            </Text>
            
            {Object.entries(groupedRoutineOptions).map(([category, routines]) => {
              // Find the category object to get the color
              const categoryObj = categories.find(c => c.id === category);
              const categoryColor = categoryObj?.color || Colors.dark.primary;
              
              return (
                <View key={category} style={styles.routineCategory}>
                  <Text style={[styles.categoryTitle, { color: categoryColor }]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  
                  {routines.map(routine => (
                    <Pressable 
                      key={routine.id}
                      style={[
                        styles.routineCheckbox,
                        currentRoutines.includes(routine.id) && [
                          styles.routineCheckboxSelected,
                          { borderColor: categoryColor, backgroundColor: `${categoryColor}10` }
                        ]
                      ]}
                      onPress={() => toggleRoutineSelection(routine.id)}
                    >
                      <View style={styles.checkboxContainer}>
                        <View style={[
                          styles.checkbox,
                          currentRoutines.includes(routine.id) && [
                            styles.checkboxSelected,
                            { backgroundColor: categoryColor, borderColor: categoryColor }
                          ]
                        ]}>
                          {currentRoutines.includes(routine.id) && (
                            <Check size={16} color="#FFFFFF" />
                          )}
                        </View>
                      </View>
                      
                      <View style={styles.routineContent}>
                        <Text style={styles.routineTitle}>{routine.title}</Text>
                        <Text style={styles.routineDescription}>{routine.description}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              );
            })}
            
            <Text style={styles.selectionCount}>
              {currentRoutines.length} {currentRoutines.length === 1 ? 'routine' : 'routines'} selected
            </Text>
          </View>
        );
      
      case 6:
        return (
          <View style={styles.analysisContainer}>
            {isAnalyzing ? (
              <View style={styles.analyzingContainer}>
                <View style={styles.iconContainer}>
                  <Brain size={48} color={Colors.dark.secondary} />
                </View>
                <Text style={styles.analyzingTitle}>Analyzing Your Photos</Text>
                <Text style={styles.analyzingText}>
                  Our AI is analyzing your photos and current routines to provide personalized recommendations.
                </Text>
                <ActivityIndicator 
                  size="large" 
                  color={Colors.dark.primary} 
                  style={styles.loader} 
                />
              </View>
            ) : (
              <>
                <View style={styles.analysisHeader}>
                  <View style={styles.iconContainer}>
                    <Brain size={48} color={Colors.dark.secondary} />
                  </View>
                  <Text style={styles.analysisTitle}>Your AI Analysis</Text>
                  <Text style={styles.analysisSubtitle}>
                    Based on your photos and current routines, here&apos;s our personalized analysis
                  </Text>
                </View>
                
                {analysisResults && (
                  <View style={styles.analysisResults}>
                    {Object.entries(analysisResults).map(([category, data]: [string, any]) => {
                      if (category === 'priorityAreas') return null;
                      
                      return (
                        <View key={category} style={styles.categoryAnalysis}>
                          <Text style={styles.categoryAnalysisTitle}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Text>
                          
                          <View style={styles.analysisSection}>
                            <Text style={styles.analysisSectionTitle}>Strengths</Text>
                            {data.strengths.map((strength: string, index: number) => (
                              <View key={index} style={styles.analysisItem}>
                                <Text style={styles.analysisItemText}>• {strength}</Text>
                              </View>
                            ))}
                          </View>
                          
                          <View style={styles.analysisSection}>
                            <Text style={styles.analysisSectionTitle}>Suggestions</Text>
                            {data.suggestions.map((suggestion: string, index: number) => (
                              <View key={index} style={styles.analysisItem}>
                                <Text style={styles.analysisItemText}>• {suggestion}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      );
                    })}
                    
                    {analysisResults.priorityAreas && (
                      <View style={styles.priorityContainer}>
                        <Text style={styles.priorityTitle}>Priority Areas</Text>
                        <Text style={styles.prioritySubtitle}>
                          Based on our analysis, focus on these areas first to level up your appearance:
                        </Text>
                        
                        {analysisResults.priorityAreas.map((area: string, index: number) => (
                          <View key={index} style={styles.priorityItem}>
                            <Text style={styles.priorityText}>{index + 1}. {area}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        );
      
      case 7:
        return (
          <View style={styles.goalsContainer}>
            <Text style={styles.goalsInstructions}>
              Based on your AI analysis, what are your main motivations for improving your appearance?
            </Text>
            
            {motivationalGoals.map((goal) => (
              <Pressable 
                key={goal.id}
                style={[
                  styles.goalCheckbox,
                  selectedMotivationalGoals.includes(goal.id) && styles.goalCheckboxSelected
                ]}
                onPress={() => toggleMotivationalGoalSelection(goal.id)}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[
                    styles.checkbox,
                    selectedMotivationalGoals.includes(goal.id) && styles.checkboxSelected
                  ]}>
                    {selectedMotivationalGoals.includes(goal.id) && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </View>
                </View>
                
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
              </Pressable>
            ))}
            
            <Text style={styles.selectionCount}>
              {selectedMotivationalGoals.length} {selectedMotivationalGoals.length === 1 ? 'motivation' : 'motivations'} selected
            </Text>
          </View>
        );
      
      case 8:
        return (
          <View style={styles.goalsContainer}>
            <Text style={styles.goalsInstructions}>
              Now, select the improvement routines you want to focus on. We&apos;ll create daily routines for you.
            </Text>
            
            {appearanceGoals.map((goal) => {
              // Find the category object to get the color
              const categoryObj = categories.find(c => c.id === goal.category);
              const categoryColor = categoryObj?.color || Colors.dark.primary;
              
              return (
                <Pressable 
                  key={goal.id}
                  style={[
                    styles.goalCheckbox,
                    selectedImprovementRoutines.includes(goal.id) && [
                      styles.goalCheckboxSelected,
                      { borderColor: categoryColor, backgroundColor: `${categoryColor}10` }
                    ]
                  ]}
                  onPress={() => toggleImprovementRoutineSelection(goal.id)}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      selectedImprovementRoutines.includes(goal.id) && [
                        styles.checkboxSelected,
                        { backgroundColor: categoryColor, borderColor: categoryColor }
                      ]
                    ]}>
                      {selectedImprovementRoutines.includes(goal.id) && (
                        <Check size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.goalContent}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                    <View style={styles.goalMeta}>
                      <Text style={[styles.goalFrequency, { color: categoryColor, backgroundColor: `${categoryColor}15` }]}>
                        {goal.recommendedFrequency === 'daily' ? 'Daily' : 
                         goal.recommendedFrequency === 'weekly' ? 'Weekly' : 'Monthly'}
                      </Text>
                      <Text style={styles.goalDifficulty}>
                        {goal.difficulty === 'easy' ? 'Easy' : 
                         goal.difficulty === 'medium' ? 'Medium' : 'Hard'}
                      </Text>
                      <Text style={styles.goalTimeRequired}>
                        {goal.timeRequired}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
            
            <Text style={styles.selectionCount}>
              {selectedImprovementRoutines.length} {selectedImprovementRoutines.length === 1 ? 'routine' : 'routines'} selected
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Welcome to Level Up';
      case 2: return 'Your Measurements';
      case 3: return 'Face Photo';
      case 4: return 'Body Photo';
      case 5: return 'Current Routines';
      case 6: return 'AI Analysis';
      case 7: return 'Your Motivations';
      case 8: return 'Improvement Routines';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return "Let's get to know you better";
      case 2: return "This helps us personalize your experience";
      case 3: return "Upload a clear photo of your face";
      case 4: return "Upload a full body photo";
      case 5: return "Tell us about your current habits";
      case 6: return "Personalized insights based on your photos";
      case 7: return "What are your appearance goals?";
      case 8: return "Select specific routines to focus on";
      default: return '';
    }
  };

  const canSkip = () => {
    return step === 2 || step === 5;
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) 
            }
          ]} 
        />
      </View>
      
      <View style={styles.header}>
        <Text style={styles.stepText}>Step {step} of 8</Text>
        <Text style={styles.title}>{getStepTitle()}</Text>
        <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          {renderStepContent()}
        </Animated.View>
      </Animated.ScrollView>
      
      <View style={styles.footer}>
        {step > 1 && step !== 6 && (
          <Pressable 
            style={styles.backButton}
            onPress={handleBack}
          >
            <ChevronLeft size={20} color={Colors.dark.text} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        )}
        
        {canSkip() && (
          <Pressable 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        )}
        
        <Pressable 
          style={[
            styles.nextButton,
            isNextDisabled() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={isNextDisabled()}
        >
          <Text style={styles.nextButtonText}>
            {step < 8 ? 'Next' : 'Get Started'}
          </Text>
          {step < 8 ? (
            <ChevronRight size={20} color="#FFFFFF" />
          ) : (
            <ArrowRight size={20} color="#FFFFFF" />
          )}
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
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.dark.card,
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.primary,
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  stepText: {
    fontSize: 14,
    color: Colors.dark.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  welcomeImageContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  welcomeImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 24,
  },
  measurementsContainer: {
    marginBottom: 24,
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
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    marginRight: 12,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
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
  optionalText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 16,
    fontStyle: 'italic',
  },
  measurementImageContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  measurementImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoInstructions: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  photoUploadButton: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  photoUploadText: {
    fontSize: 16,
    color: Colors.dark.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  photoPreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  facePhotoPreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  bodyPhotoPreview: {
    width: 150,
    height: 200,
    borderRadius: 12,
  },
  photoCheckmark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.success,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.dark.background,
  },
  changePhotoButton: {
    marginTop: 16,
    padding: 8,
  },
  changePhotoText: {
    fontSize: 16,
    color: Colors.dark.primary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.dark.error,
    marginTop: 8,
  },
  photoTipsContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  photoTipsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.primary,
    marginBottom: 8,
  },
  photoTip: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  routinesContainer: {
    marginBottom: 24,
  },
  routinesInstructions: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 20,
  },
  routineCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  routineCheckbox: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  routineCheckboxSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  routineContent: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  routineDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  analysisContainer: {
    flex: 1,
    marginBottom: 24,
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyzingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  analyzingText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  loader: {
    marginTop: 20,
  },
  analysisHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  analysisSubtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  analysisResults: {
    marginBottom: 16,
  },
  categoryAnalysis: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryAnalysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  analysisSection: {
    marginBottom: 12,
  },
  analysisSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.primary,
    marginBottom: 8,
  },
  analysisItem: {
    marginBottom: 4,
  },
  analysisItemText: {
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 20,
  },
  priorityContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  priorityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.secondary,
    marginBottom: 8,
  },
  prioritySubtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 12,
  },
  priorityItem: {
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  goalsContainer: {
    marginBottom: 24,
  },
  goalsInstructions: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 20,
  },
  goalCheckbox: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  goalCheckboxSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.dark.inactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 8,
  },
  goalMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  goalFrequency: {
    fontSize: 12,
    color: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  goalDifficulty: {
    fontSize: 12,
    color: Colors.dark.warning,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  goalTimeRequired: {
    fontSize: 12,
    color: Colors.dark.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  selectionCount: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 4,
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.dark.inactive,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 4,
  },
});