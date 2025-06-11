import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { Brain, RefreshCw, ArrowLeft, Camera, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { AIAnalysisResult } from '@/types';

export default function AIAdviceScreen() {
  const router = useRouter();
  const aiAnalysis = useUserStore(state => state.aiAnalysis);
  const setAIAnalysis = useUserStore(state => state.setAIAnalysis);
  const profile = useUserStore(state => state.profile);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newFacePhoto, setNewFacePhoto] = useState<string | null>(null);
  const [newBodyPhoto, setNewBodyPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  
  const handleBack = () => {
    router.back();
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
        setNewFacePhoto(result.assets[0].uri);
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
        setNewBodyPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking body photo:', error);
      setPhotoError('Failed to select image. Please try again.');
    }
  };
  
  const getNewAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // In a real app, we would send the photos to an AI service
      // For this demo, we'll simulate an analysis with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Use the new photos if provided, otherwise use the profile photos
      const facePhotoToUse = newFacePhoto || profile?.facePhoto;
      const bodyPhotoToUse = newBodyPhoto || profile?.bodyPhoto;
      
      if (!facePhotoToUse && !bodyPhotoToUse) {
        setPhotoError('Please upload at least one photo for analysis');
        setIsAnalyzing(false);
        return;
      }
      
      // Check which routines the user currently follows
      const currentRoutines = profile?.currentRoutines || [];
      const hasSkincare = currentRoutines.some(r => r.includes('skincare'));
      const hasWorkout = currentRoutines.some(r => r.includes('workout'));
      const hasGrooming = currentRoutines.some(r => r.includes('grooming'));
      const hasPosture = currentRoutines.some(r => r.includes('posture'));
      const hasHydration = currentRoutines.some(r => r.includes('hydration'));
      const hasProtein = currentRoutines.some(r => r.includes('protein'));
      const hasStyle = currentRoutines.some(r => r.includes('style'));
      const hasDental = currentRoutines.some(r => r.includes('dental'));
      
      // Generate personalized analysis based on current routines
      const mockAnalysis: AIAnalysisResult = {
        face: {
          strengths: [
            hasGrooming ? "Your dedication to facial grooming is paying off" : "Good natural facial structure",
            "Strong facial symmetry potential",
            hasGrooming ? "Your attention to facial grooming shows in your appearance" : "Natural facial features with good potential"
          ],
          suggestions: [
            hasSkincare ? "Take your skincare to the next level by adding targeted treatments for specific concerns" : "Starting a basic skincare routine would dramatically enhance your facial appearance",
            hasGrooming ? "Experiment with different facial hair styles to find what best complements your face shape" : "Consider facial hair grooming to enhance your facial structure",
            "Adding daily facial exercises would help define your jawline and facial muscles, taking your appearance to the next level"
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
        priorityAreas: [
          !hasSkincare ? "Basic skincare routine" : "Advanced skincare techniques",
          !hasWorkout ? "Strength training fundamentals" : "Progressive strength development",
          !hasPosture ? "Posture improvement" : "Advanced posture refinement",
          !hasGrooming ? "Grooming essentials" : "Refined grooming techniques",
          !hasHydration ? "Hydration habits" : "Nutrition optimization"
        ]
      };
      
      // Update the analysis in the store
      setAIAnalysis(mockAnalysis);
      
      // Clear the new photos
      setNewFacePhoto(null);
      setNewBodyPhoto(null);
      
    } catch (error) {
      console.error('Error during analysis:', error);
      setPhotoError('Failed to analyze photos. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    // Create an empty analysis object with the correct structure
    const emptyAnalysis: AIAnalysisResult = {
      face: { strengths: [], suggestions: [] },
      skin: { strengths: [], suggestions: [] },
      hair: { strengths: [], suggestions: [] },
      body: { strengths: [], suggestions: [] },
      posture: { strengths: [], suggestions: [] },
      priorityAreas: []
    };
    
    setAIAnalysis(emptyAnalysis);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const lastAnalysisDate = formatDate(aiAnalysis.lastAnalysis);
  const hasAnalysis = aiAnalysis.results && Object.keys(aiAnalysis.results).length > 0;
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "AI Appearance Analysis",
          headerLeft: () => (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.dark.text} />
            </Pressable>
          )
        }} 
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Brain size={48} color={Colors.dark.secondary} />
          </View>
          <Text style={styles.title}>AI Appearance Analysis</Text>
          <Text style={styles.subtitle}>
            Get personalized insights and recommendations based on your photos
          </Text>
        </View>
        
        {isAnalyzing ? (
          <View style={styles.analyzingContainer}>
            <Text style={styles.analyzingTitle}>Analyzing Your Photos</Text>
            <Text style={styles.analyzingText}>
              Our AI is analyzing your photos to provide personalized recommendations.
            </Text>
            <ActivityIndicator 
              size="large" 
              color={Colors.dark.primary} 
              style={styles.loader} 
            />
          </View>
        ) : (
          <>
            {hasAnalysis ? (
              <View style={styles.analysisContainer}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Last Analysis</Text>
                  <Text style={styles.infoValue}>{lastAnalysisDate}</Text>
                </View>
                
                <Text style={styles.sectionTitle}>Your Analysis Results</Text>
                
                {aiAnalysis.results && Object.entries(aiAnalysis.results).map(([category, data]: [string, any]) => {
                  if (category === 'priorityAreas' || !data) return null;
                  
                  return (
                    <View key={category} style={styles.categoryAnalysis}>
                      <Text style={styles.categoryAnalysisTitle}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                      
                      {data.strengths && data.strengths.length > 0 && (
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>Strengths</Text>
                          {data.strengths.map((strength: string, index: number) => (
                            <View key={index} style={styles.analysisItem}>
                              <Text style={styles.analysisItemText}>• {strength}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      
                      {data.suggestions && data.suggestions.length > 0 && (
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>Suggestions</Text>
                          {data.suggestions.map((suggestion: string, index: number) => (
                            <View key={index} style={styles.analysisItem}>
                              <Text style={styles.analysisItemText}>• {suggestion}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
                
                {aiAnalysis.results?.priorityAreas && aiAnalysis.results.priorityAreas.length > 0 && (
                  <View style={styles.priorityContainer}>
                    <Text style={styles.priorityTitle}>Priority Areas</Text>
                    <Text style={styles.prioritySubtitle}>
                      Based on our analysis, these are the areas to focus on first to level up your appearance:
                    </Text>
                    
                    {aiAnalysis.results.priorityAreas.map((area: string, index: number) => (
                      <View key={index} style={styles.priorityItem}>
                        <Text style={styles.priorityText}>{index + 1}. {area}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.actionsContainer}>
                  <Pressable 
                    style={styles.actionButton}
                    onPress={getNewAnalysis}
                  >
                    <RefreshCw size={20} color={Colors.dark.text} />
                    <Text style={styles.actionText}>Get New Analysis</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.resetButton}
                    onPress={resetAnalysis}
                  >
                    <Text style={styles.resetText}>Reset Analysis</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <Text style={styles.uploadInstructions}>
                  Upload photos for AI analysis. You can use your profile photos or upload new ones.
                </Text>
                
                <View style={styles.photoRow}>
                  <View style={styles.photoColumn}>
                    <Text style={styles.photoLabel}>Face Photo</Text>
                    {newFacePhoto ? (
                      <View style={styles.photoPreviewContainer}>
                        {Platform.OS === 'web' ? (
                          <img 
                            src={newFacePhoto} 
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
                            source={{ uri: newFacePhoto }} 
                            style={styles.facePhotoPreview} 
                          />
                        )}
                      </View>
                    ) : profile?.facePhoto ? (
                      <View style={styles.photoPreviewContainer}>
                        {Platform.OS === 'web' ? (
                          <img 
                            src={profile.facePhoto} 
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
                            source={{ uri: profile.facePhoto }} 
                            style={styles.facePhotoPreview} 
                          />
                        )}
                        <Text style={styles.usingProfileText}>Using profile photo</Text>
                      </View>
                    ) : (
                      <Pressable 
                        style={styles.photoUploadButton}
                        onPress={handlePickFacePhoto}
                      >
                        <Camera size={30} color={Colors.dark.primary} />
                        <Text style={styles.photoUploadText}>Upload</Text>
                      </Pressable>
                    )}
                    
                    {(newFacePhoto || profile?.facePhoto) && (
                      <Pressable 
                        style={styles.changePhotoButton}
                        onPress={handlePickFacePhoto}
                      >
                        <Text style={styles.changePhotoText}>Change</Text>
                      </Pressable>
                    )}
                  </View>
                  
                  <View style={styles.photoColumn}>
                    <Text style={styles.photoLabel}>Body Photo</Text>
                    {newBodyPhoto ? (
                      <View style={styles.photoPreviewContainer}>
                        {Platform.OS === 'web' ? (
                          <img 
                            src={newBodyPhoto} 
                            alt="Body" 
                            style={{ 
                              width: 90, 
                              height: 120, 
                              objectFit: 'cover', 
                              borderRadius: 8 
                            }}
                          />
                        ) : (
                          <Image 
                            source={{ uri: newBodyPhoto }} 
                            style={styles.bodyPhotoPreview} 
                          />
                        )}
                      </View>
                    ) : profile?.bodyPhoto ? (
                      <View style={styles.photoPreviewContainer}>
                        {Platform.OS === 'web' ? (
                          <img 
                            src={profile.bodyPhoto} 
                            alt="Body" 
                            style={{ 
                              width: 90, 
                              height: 120, 
                              objectFit: 'cover', 
                              borderRadius: 8 
                            }}
                          />
                        ) : (
                          <Image 
                            source={{ uri: profile.bodyPhoto }} 
                            style={styles.bodyPhotoPreview} 
                          />
                        )}
                        <Text style={styles.usingProfileText}>Using profile photo</Text>
                      </View>
                    ) : (
                      <Pressable 
                        style={styles.photoUploadButton}
                        onPress={handlePickBodyPhoto}
                      >
                        <Camera size={30} color={Colors.dark.primary} />
                        <Text style={styles.photoUploadText}>Upload</Text>
                      </Pressable>
                    )}
                    
                    {(newBodyPhoto || profile?.bodyPhoto) && (
                      <Pressable 
                        style={styles.changePhotoButton}
                        onPress={handlePickBodyPhoto}
                      >
                        <Text style={styles.changePhotoText}>Change</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
                
                {photoError && (
                  <Text style={styles.errorText}>{photoError}</Text>
                )}
                
                <Pressable 
                  style={styles.analyzeButton}
                  onPress={getNewAnalysis}
                  disabled={(!newFacePhoto && !profile?.facePhoto) && (!newBodyPhoto && !profile?.bodyPhoto)}
                >
                  <Brain size={20} color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Analyze Photos</Text>
                </Pressable>
                
                <Text style={styles.disclaimer}>
                  Note: This is a simulated AI analysis for demonstration purposes. In a real app, photos would be processed by advanced AI models.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
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
  analysisContainer: {
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
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
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  resetButton: {
    alignItems: 'center',
    padding: 12,
  },
  resetText: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  uploadContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  uploadInstructions: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 20,
    textAlign: 'center',
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  photoColumn: {
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  photoUploadButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  photoUploadText: {
    fontSize: 14,
    color: Colors.dark.primary,
    marginTop: 8,
  },
  photoPreviewContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  facePhotoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  bodyPhotoPreview: {
    width: 90,
    height: 120,
    borderRadius: 8,
  },
  usingProfileText: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginTop: 4,
    textAlign: 'center',
  },
  changePhotoButton: {
    marginTop: 4,
    padding: 4,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.dark.primary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.dark.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.dark.subtext,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});