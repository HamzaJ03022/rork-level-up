import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Platform,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/user-store';
import {
  ChevronRight,
  Camera,
  Check,
  ArrowRight,
  ChevronLeft,
  User,
  Ruler,
  Dumbbell,
  Sparkles,
  Heart,
  Target,
} from 'lucide-react-native';
import { UserProfile } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { appearanceGoals } from '@/constants/appearance-goals';
import { motivationalGoals } from '@/constants/motivational-goals';
import { categories } from '@/constants/categories';

const { width } = Dimensions.get('window');
const TOTAL_STEPS = 7;

const STEP_META = [
  { icon: User, label: 'About You', color: '#6366F1' },
  { icon: Ruler, label: 'Measurements', color: '#10B981' },
  { icon: Camera, label: 'Face Photo', color: '#F59E0B' },
  { icon: Camera, label: 'Body Photo', color: '#EC4899' },
  { icon: Dumbbell, label: 'Habits', color: '#3B82F6' },
  { icon: Heart, label: 'Motivation', color: '#EF4444' },
  { icon: Target, label: 'Routines', color: '#8B5CF6' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setProfile = useUserStore((state) => state.setProfile);
  const setOnboarded = useUserStore((state) => state.setOnboarded);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [heightValue, setHeightValue] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [currentRoutines, setCurrentRoutines] = useState<string[]>([]);
  const [selectedMotivationalGoals, setSelectedMotivationalGoals] = useState<string[]>([]);
  const [selectedImprovementRoutines, setSelectedImprovementRoutines] = useState<string[]>([]);

  const [photoError, setPhotoError] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step + 1) / TOTAL_STEPS,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [step, progressAnim]);

  const animateTransition = useCallback(
    (nextStep: number) => {
      const direction = nextStep > step ? 1 : -1;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        setStep(nextStep);
        slideAnim.setValue(direction * 40);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [step, fadeAnim, slideAnim]
  );

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      animateTransition(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      animateTransition(step - 1);
    }
  };

  const toggleMotivationalGoal = (goalId: string) => {
    setSelectedMotivationalGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const toggleImprovementRoutine = (routineId: string) => {
    setSelectedImprovementRoutines((prev) =>
      prev.includes(routineId) ? prev.filter((id) => id !== routineId) : [...prev, routineId]
    );
  };

  const toggleRoutine = (routineId: string) => {
    setCurrentRoutines((prev) =>
      prev.includes(routineId) ? prev.filter((id) => id !== routineId) : [...prev, routineId]
    );
  };

  const handlePickPhoto = async (type: 'face' | 'body') => {
    try {
      setPhotoError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'face' ? [1, 1] : [3, 4],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (type === 'face') {
          setFacePhoto(result.assets[0].uri);
        } else {
          setBodyPhoto(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error(`Error picking ${type} photo:`, error);
      setPhotoError('Failed to select image. Please try again.');
    }
  };

  const completeOnboarding = () => {
    const initialRoutines = selectedImprovementRoutines.map((routineId) => {
      const routine = appearanceGoals.find((g) => g.id === routineId);
      return {
        id: `routine-${Date.now()}-${routineId}`,
        title: routine?.title || '',
        description: routine?.description || '',
        categoryId: routine?.category || 'other',
        frequency: (routine?.recommendedFrequency || 'daily') as 'daily' | 'weekly' | 'monthly',
        completed: false,
        lastCompleted: undefined,
      };
    });

    const newProfile: UserProfile = {
      name: name.trim(),
      age: age ? parseInt(age, 10) : undefined,
      height: heightValue
        ? { value: parseFloat(heightValue), unit: heightUnit }
        : undefined,
      weight: weightValue
        ? { value: parseFloat(weightValue), unit: weightUnit }
        : undefined,
      facePhoto: facePhoto || undefined,
      bodyPhoto: bodyPhoto || undefined,
      currentRoutines,
      selectedMotivationalGoals,
      selectedImprovementRoutines,
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
    if (step === 0) return name.trim() === '';
    if (step === 5) return selectedMotivationalGoals.length === 0;
    if (step === 6) return selectedImprovementRoutines.length === 0;
    return false;
  };

  const canSkip = () => {
    return step === 1 || step === 2 || step === 3 || step === 4;
  };

  const meta = STEP_META[step];
  const StepIcon = meta.icon;

  const dailyRoutineOptions = [
    { id: 'skincare-morning', title: 'Morning Skincare', category: 'skincare', emoji: '🧴' },
    { id: 'skincare-evening', title: 'Evening Skincare', category: 'skincare', emoji: '🌙' },
    { id: 'workout-strength', title: 'Strength Training', category: 'fitness', emoji: '💪' },
    { id: 'workout-cardio', title: 'Cardio Exercise', category: 'fitness', emoji: '🏃' },
    { id: 'grooming-hair', title: 'Hair Styling', category: 'grooming', emoji: '💇' },
    { id: 'grooming-beard', title: 'Beard Care', category: 'grooming', emoji: '🧔' },
    { id: 'posture-practice', title: 'Posture Practice', category: 'posture', emoji: '🧘' },
    { id: 'hygiene-dental', title: 'Dental Care', category: 'hygiene', emoji: '🦷' },
    { id: 'style-outfits', title: 'Outfit Planning', category: 'style', emoji: '👔' },
    { id: 'nutrition-hydration', title: 'Hydration', category: 'nutrition', emoji: '💧' },
    { id: 'nutrition-protein', title: 'Protein Intake', category: 'nutrition', emoji: '🥩' },
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.fieldLabel}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#555"
              autoFocus={Platform.OS !== 'web'}
              testID="onboarding-name-input"
            />
            <Text style={styles.fieldLabel}>How old are you? (optional)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) setAge(text);
              }}
              placeholder="Age"
              placeholderTextColor="#555"
              keyboardType="numeric"
              testID="onboarding-age-input"
            />
            <View style={styles.infoCard}>
              <Sparkles size={20} color="#F59E0B" />
              <Text style={styles.infoCardText}>
                We&apos;ll use this to personalize your experience and create routines tailored to you.
              </Text>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepBody}>
            <View style={styles.measureRow}>
              <View style={styles.measureField}>
                <Text style={styles.fieldLabel}>Height</Text>
                <TextInput
                  style={styles.input}
                  value={heightValue}
                  onChangeText={(text) => {
                    if (/^(\d*\.?\d*)$/.test(text)) setHeightValue(text);
                  }}
                  placeholder={heightUnit === 'cm' ? '175' : '5.9'}
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.unitToggle}>
                {(['cm', 'ft'] as const).map((u) => (
                  <Pressable
                    key={u}
                    style={[styles.unitBtn, heightUnit === u && { backgroundColor: meta.color }]}
                    onPress={() => setHeightUnit(u)}
                  >
                    <Text style={[styles.unitText, heightUnit === u && styles.unitTextActive]}>
                      {u}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.measureRow}>
              <View style={styles.measureField}>
                <Text style={styles.fieldLabel}>Weight</Text>
                <TextInput
                  style={styles.input}
                  value={weightValue}
                  onChangeText={(text) => {
                    if (/^(\d*\.?\d*)$/.test(text)) setWeightValue(text);
                  }}
                  placeholder={weightUnit === 'kg' ? '70' : '154'}
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.unitToggle}>
                {(['kg', 'lbs'] as const).map((u) => (
                  <Pressable
                    key={u}
                    style={[styles.unitBtn, weightUnit === u && { backgroundColor: meta.color }]}
                    onPress={() => setWeightUnit(u)}
                  >
                    <Text style={[styles.unitText, weightUnit === u && styles.unitTextActive]}>
                      {u}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ruler size={20} color={meta.color} />
              <Text style={styles.infoCardText}>
                This helps us give more accurate fitness and nutrition advice. You can skip this.
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={[styles.stepBody, styles.centeredBody]}>
            {facePhoto ? (
              <View style={styles.photoPreview}>
                {Platform.OS === 'web' ? (
                  <img
                    src={facePhoto}
                    alt="Face"
                    style={{
                      width: 180,
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: 90,
                    }}
                  />
                ) : (
                  <Image source={{ uri: facePhoto }} style={styles.faceImage} />
                )}
                <View style={[styles.photoCheck, { backgroundColor: meta.color }]}>
                  <Check size={18} color="#FFF" />
                </View>
              </View>
            ) : (
              <Pressable
                style={[styles.photoUpload, { borderColor: `${meta.color}60` }]}
                onPress={() => handlePickPhoto('face')}
                testID="onboarding-face-photo"
              >
                <View style={[styles.photoIconWrap, { backgroundColor: `${meta.color}15` }]}>
                  <Camera size={32} color={meta.color} />
                </View>
                <Text style={styles.photoUploadTitle}>Upload Face Photo</Text>
                <Text style={styles.photoUploadSub}>Clear, front-facing, natural light</Text>
              </Pressable>
            )}
            {photoError && <Text style={styles.errorText}>{photoError}</Text>}
            {facePhoto && (
              <Pressable style={styles.changeBtn} onPress={() => handlePickPhoto('face')}>
                <Text style={[styles.changeBtnText, { color: meta.color }]}>Change Photo</Text>
              </Pressable>
            )}
            <View style={styles.tipsList}>
              <Text style={styles.tipsHeader}>Tips for best results</Text>
              <Text style={styles.tipItem}>• Use natural lighting</Text>
              <Text style={styles.tipItem}>• Face the camera directly</Text>
              <Text style={styles.tipItem}>• Neutral expression, no filters</Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={[styles.stepBody, styles.centeredBody]}>
            {bodyPhoto ? (
              <View style={styles.photoPreview}>
                {Platform.OS === 'web' ? (
                  <img
                    src={bodyPhoto}
                    alt="Body"
                    style={{
                      width: 150,
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 16,
                    }}
                  />
                ) : (
                  <Image source={{ uri: bodyPhoto }} style={styles.bodyImage} />
                )}
                <View style={[styles.photoCheck, { backgroundColor: meta.color }]}>
                  <Check size={18} color="#FFF" />
                </View>
              </View>
            ) : (
              <Pressable
                style={[styles.photoUpload, { borderColor: `${meta.color}60` }]}
                onPress={() => handlePickPhoto('body')}
                testID="onboarding-body-photo"
              >
                <View style={[styles.photoIconWrap, { backgroundColor: `${meta.color}15` }]}>
                  <Camera size={32} color={meta.color} />
                </View>
                <Text style={styles.photoUploadTitle}>Upload Body Photo</Text>
                <Text style={styles.photoUploadSub}>Full body, fitted clothing</Text>
              </Pressable>
            )}
            {photoError && <Text style={styles.errorText}>{photoError}</Text>}
            {bodyPhoto && (
              <Pressable style={styles.changeBtn} onPress={() => handlePickPhoto('body')}>
                <Text style={[styles.changeBtnText, { color: meta.color }]}>Change Photo</Text>
              </Pressable>
            )}
            <View style={styles.tipsList}>
              <Text style={styles.tipsHeader}>Tips for best results</Text>
              <Text style={styles.tipItem}>• Plain background</Text>
              <Text style={styles.tipItem}>• Stand with natural posture</Text>
              <Text style={styles.tipItem}>• Good lighting, no filters</Text>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepSubtitle}>
              What are you already doing? This helps us find gaps.
            </Text>
            <View style={styles.chipGrid}>
              {dailyRoutineOptions.map((routine) => {
                const selected = currentRoutines.includes(routine.id);
                return (
                  <Pressable
                    key={routine.id}
                    style={[
                      styles.chip,
                      selected && { backgroundColor: `${meta.color}20`, borderColor: meta.color },
                    ]}
                    onPress={() => toggleRoutine(routine.id)}
                  >
                    <Text style={styles.chipEmoji}>{routine.emoji}</Text>
                    <Text style={[styles.chipText, selected && { color: '#FFF' }]}>
                      {routine.title}
                    </Text>
                    {selected && (
                      <View style={[styles.chipCheck, { backgroundColor: meta.color }]}>
                        <Check size={10} color="#FFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.selectionHint}>
              {currentRoutines.length} selected
            </Text>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepSubtitle}>
              What drives you? Pick all that apply.
            </Text>
            {motivationalGoals.map((goal) => {
              const selected = selectedMotivationalGoals.includes(goal.id);
              return (
                <Pressable
                  key={goal.id}
                  style={[
                    styles.selectCard,
                    selected && { borderColor: meta.color, backgroundColor: `${meta.color}08` },
                  ]}
                  onPress={() => toggleMotivationalGoal(goal.id)}
                >
                  <View
                    style={[
                      styles.selectCheck,
                      selected && { backgroundColor: meta.color, borderColor: meta.color },
                    ]}
                  >
                    {selected && <Check size={14} color="#FFF" />}
                  </View>
                  <View style={styles.selectContent}>
                    <Text style={styles.selectTitle}>{goal.title}</Text>
                    <Text style={styles.selectDesc}>{goal.description}</Text>
                  </View>
                </Pressable>
              );
            })}
            <Text style={styles.selectionHint}>
              {selectedMotivationalGoals.length} selected
            </Text>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepSubtitle}>
              Choose the routines you want to commit to.
            </Text>
            {appearanceGoals.map((goal) => {
              const selected = selectedImprovementRoutines.includes(goal.id);
              const cat = categories.find((c) => c.id === goal.category);
              const catColor = cat?.color || meta.color;
              return (
                <Pressable
                  key={goal.id}
                  style={[
                    styles.selectCard,
                    selected && {
                      borderColor: catColor,
                      backgroundColor: `${catColor}08`,
                    },
                  ]}
                  onPress={() => toggleImprovementRoutine(goal.id)}
                >
                  <View
                    style={[
                      styles.selectCheck,
                      selected && { backgroundColor: catColor, borderColor: catColor },
                    ]}
                  >
                    {selected && <Check size={14} color="#FFF" />}
                  </View>
                  <View style={styles.selectContent}>
                    <Text style={styles.selectTitle}>{goal.title}</Text>
                    <Text style={styles.selectDesc}>{goal.description}</Text>
                    <View style={styles.tagRow}>
                      <View style={[styles.tag, { backgroundColor: `${catColor}18` }]}>
                        <Text style={[styles.tagText, { color: catColor }]}>
                          {goal.recommendedFrequency === 'daily'
                            ? 'Daily'
                            : goal.recommendedFrequency === 'weekly'
                            ? 'Weekly'
                            : 'Monthly'}
                        </Text>
                      </View>
                      <View style={[styles.tag, { backgroundColor: 'rgba(245,158,11,0.12)' }]}>
                        <Text style={[styles.tagText, { color: '#F59E0B' }]}>
                          {goal.difficulty === 'easy'
                            ? 'Easy'
                            : goal.difficulty === 'medium'
                            ? 'Medium'
                            : 'Hard'}
                        </Text>
                      </View>
                      <View style={[styles.tag, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
                        <Text style={[styles.tagText, { color: '#10B981' }]}>
                          {goal.timeRequired}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
            <Text style={styles.selectionHint}>
              {selectedImprovementRoutines.length} selected
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0: return "Let's get to know you";
      case 1: return 'Your measurements';
      case 2: return 'Face photo';
      case 3: return 'Body photo';
      case 4: return 'Current habits';
      case 5: return 'Your motivation';
      case 6: return 'Pick your routines';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#121212', '#1a1a2e', '#121212']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={[styles.topSection, { paddingTop: insets.top + 8 }]}>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: meta.color,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.stepCounter}>
            {step + 1}/{TOTAL_STEPS}
          </Text>
        </View>

        <View style={styles.headerRow}>
          <View style={[styles.stepIconBadge, { backgroundColor: `${meta.color}18` }]}>
            <StepIcon size={18} color={meta.color} />
          </View>
          <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Animated.View style={[styles.flex, { opacity: fadeAnim }]}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
              {renderStep()}
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerLeft}>
          {step > 0 && (
            <Pressable
              style={styles.backBtn}
              onPress={handleBack}
              testID="onboarding-back"
            >
              <ChevronLeft size={20} color="#AAA" />
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
          )}
          {canSkip() && (
            <Pressable style={styles.skipBtn} onPress={handleNext}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.nextBtn,
            { backgroundColor: meta.color, opacity: isNextDisabled() ? 0.35 : pressed ? 0.85 : 1 },
          ]}
          onPress={handleNext}
          disabled={isNextDisabled()}
          testID="onboarding-next"
        >
          <Text style={styles.nextBtnText}>
            {step === TOTAL_STEPS - 1 ? 'Start Journey' : 'Continue'}
          </Text>
          {step === TOTAL_STEPS - 1 ? (
            <ArrowRight size={18} color="#FFF" />
          ) : (
            <ChevronRight size={18} color="#FFF" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  flex: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  stepCounter: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600' as const,
    minWidth: 30,
    textAlign: 'right' as const,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  stepBody: {
    gap: 12,
  },
  centeredBody: {
    alignItems: 'center',
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#888',
    lineHeight: 22,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#AAA',
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  infoCardText: {
    flex: 1,
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  measureRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  measureField: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 1,
  },
  unitBtn: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  unitText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600' as const,
  },
  unitTextActive: {
    color: '#FFF',
  },
  photoUpload: {
    width: width - 80,
    maxWidth: 280,
    aspectRatio: 0.85,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  photoIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  photoUploadTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFF',
    marginBottom: 4,
  },
  photoUploadSub: {
    fontSize: 13,
    color: '#666',
  },
  photoPreview: {
    position: 'relative',
    marginBottom: 8,
  },
  faceImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  bodyImage: {
    width: 150,
    height: 200,
    borderRadius: 16,
  },
  photoCheck: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#121212',
  },
  changeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
  },
  tipsList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginTop: 16,
  },
  tipsHeader: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#AAA',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 13,
    color: '#777',
    lineHeight: 22,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    gap: 8,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipText: {
    fontSize: 14,
    color: '#AAA',
    fontWeight: '500' as const,
  },
  chipCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  selectCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  selectContent: {
    flex: 1,
  },
  selectTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
    marginBottom: 3,
  },
  selectDesc: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  selectionHint: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500' as const,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e1e1e',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 8,
  },
  backBtnText: {
    fontSize: 15,
    color: '#AAA',
    marginLeft: 2,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  skipBtnText: {
    fontSize: 15,
    color: '#666',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    gap: 6,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
});
