import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Modal, ActivityIndicator, Image, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { tips } from '@/constants/tips';
import { categories } from '@/constants/categories';
import { Star, Clock, BarChart, Check, Plus, X, Camera, Brain, ArrowRight, RefreshCw } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { Routine, HaircutSuggestion, BeardStyleSuggestion } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { trpc, trpcClient } from '@/lib/trpc';

export default function TipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const profile = useUserStore(state => state.profile);
  const markTipCompleted = useUserStore(state => state.markTipCompleted);
  const addRoutine = useUserStore(state => state.addRoutine);
  const setHaircutAnalysis = useUserStore(state => state.setHaircutAnalysis);
  const setBeardAnalysis = useUserStore(state => state.setBeardAnalysis);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  // Haircut analysis states
  const [haircutPhoto, setHaircutPhoto] = useState<string | null>(null);
  const [isAnalyzingHaircut, setIsAnalyzingHaircut] = useState(false);
  const [haircutPhotoError, setHaircutPhotoError] = useState<string | null>(null);
  const [haircutResults, setHaircutResults] = useState<any>(null);
  const [haircutModalVisible, setHaircutModalVisible] = useState(false);
  const [selectedHaircut, setSelectedHaircut] = useState<HaircutSuggestion | null>(null);
  
  // Beard analysis states
  const [beardPhoto, setBeardPhoto] = useState<string | null>(null);
  const [isAnalyzingBeard, setIsAnalyzingBeard] = useState(false);
  const [beardPhotoError, setBeardPhotoError] = useState<string | null>(null);
  const [beardResults, setBeardResults] = useState<any>(null);
  const [beardModalVisible, setBeardModalVisible] = useState(false);
  const [selectedBeardStyle, setSelectedBeardStyle] = useState<BeardStyleSuggestion | null>(null);
  
  const tip = tips.find(t => t.id === id);
  const category = tip ? categories.find(cat => cat.id === tip.categoryId) : null;
  
  const isCompleted = profile?.completedTips.includes(id || '');
  const isHaircutTip = tip?.id === 'grooming-1'; // "Find Your Ideal Haircut" tip
  const isBeardTip = tip?.id === 'grooming-2'; // "Master Beard Maintenance" tip

  // Check if we already have a haircut or beard analysis
  useEffect(() => {
    if (isHaircutTip && profile?.haircutAnalysis) {
      setHaircutResults(profile.haircutAnalysis);
    }
    if (isBeardTip && profile?.beardAnalysis) {
      setBeardResults(profile.beardAnalysis);
    }
  }, [isHaircutTip, isBeardTip, profile?.haircutAnalysis, profile?.beardAnalysis]);

  const handleMarkComplete = () => {
    if (!isCompleted && id) {
      markTipCompleted(id);
    }
  };

  const handleAddToRoutine = () => {
    setModalVisible(true);
  };

  const handleConfirmAddToRoutine = () => {
    if (tip && category) {
      const newRoutine: Routine = {
        id: `routine-${Date.now()}`,
        title: tip.title,
        description: tip.description,
        categoryId: tip.categoryId,
        frequency: selectedFrequency,
        completed: false,
      };
      
      addRoutine(newRoutine);
      setModalVisible(false);
    }
  };

  // Haircut photo handling
  const handlePickHaircutPhoto = async () => {
    try {
      setHaircutPhotoError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setHaircutPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking haircut photo:', error);
      setHaircutPhotoError('Failed to select image. Please try again.');
    }
  };

  const analyzeHaircut = async () => {
    if (!haircutPhoto) {
      setHaircutPhotoError('Please upload a photo first');
      return;
    }

    setIsAnalyzingHaircut(true);
    setHaircutPhotoError(null);

    try {
      // Call the backend to analyze the haircut
      const result = await trpcClient.haircut.analyze.mutate({
        photoUri: haircutPhoto
      });

      // Store the results
      setHaircutResults(result);
      
      // Save to user profile
      setHaircutAnalysis({
        photoUri: haircutPhoto,
        faceShape: result.faceShape,
        hairType: result.hairType,
        hairLength: result.hairLength,
        faceShapeDescription: result.suggestions.faceShapeDescription,
        suggestions: result.suggestions.haircuts,
        analysisDate: result.analysisDate
      });

    } catch (error) {
      console.error('Error analyzing haircut:', error);
      setHaircutPhotoError('Failed to analyze photo. Please try again.');
    } finally {
      setIsAnalyzingHaircut(false);
    }
  };

  const openHaircutDetails = (haircut: HaircutSuggestion) => {
    setSelectedHaircut(haircut);
    setHaircutModalVisible(true);
  };

  // Beard photo handling
  const handlePickBeardPhoto = async () => {
    try {
      setBeardPhotoError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setBeardPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking beard photo:', error);
      setBeardPhotoError('Failed to select image. Please try again.');
    }
  };

  const analyzeBeard = async () => {
    if (!beardPhoto) {
      setBeardPhotoError('Please upload a photo first');
      return;
    }

    setIsAnalyzingBeard(true);
    setBeardPhotoError(null);

    try {
      // Call the backend to analyze the beard
      const result = await trpcClient.beard.analyze.mutate({
        photoUri: beardPhoto
      });

      // Store the results
      setBeardResults(result);
      
      // Save to user profile
      setBeardAnalysis({
        photoUri: beardPhoto,
        faceShape: result.faceShape,
        beardDensity: result.beardDensity,
        currentStyle: result.currentStyle,
        faceShapeDescription: result.suggestions.faceShapeDescription,
        suggestions: result.suggestions.beardStyles,
        analysisDate: result.analysisDate
      });

    } catch (error) {
      console.error('Error analyzing beard:', error);
      setBeardPhotoError('Failed to analyze photo. Please try again.');
    } finally {
      setIsAnalyzingBeard(false);
    }
  };

  const openBeardDetails = (beardStyle: BeardStyleSuggestion) => {
    setSelectedBeardStyle(beardStyle);
    setBeardModalVisible(true);
  };

  // Render impact stars
  const renderImpact = () => {
    if (!tip) return null;
    
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          color={i < tip.impact ? Colors.dark.primary : Colors.dark.inactive}
          fill={i < tip.impact ? Colors.dark.primary : 'none'}
        />
      );
    }
    return stars;
  };

  if (!tip || !category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tip not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: tip.title }} />
      
      <View style={styles.header}>
        <Text style={styles.category} numberOfLines={1}>
          {category.title}
        </Text>
        <Text style={styles.title}>{tip.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.dark.subtext} />
            <Text style={styles.metaText}>{tip.timeRequired}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <BarChart size={16} color={Colors.dark.subtext} />
            <Text style={styles.metaText}>{tip.difficulty}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.impactContainer}>
        <Text style={styles.impactLabel}>Impact Level:</Text>
        <View style={styles.starsContainer}>
          {renderImpact()}
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>How to do it</Text>
        <Text style={styles.description}>{tip.description}</Text>
      </View>
      
      {/* Haircut Analysis Section - Only show for the haircut tip */}
      {isHaircutTip && (
        <View style={styles.haircutContainer}>
          <Text style={styles.haircutTitle}>Find Your Ideal Haircut with AI</Text>
          <Text style={styles.haircutDescription}>
            Upload a clear photo of your face to get personalized haircut recommendations based on your face shape and features.
          </Text>
          
          {haircutResults ? (
            <View style={styles.analysisResultsContainer}>
              <View style={styles.photoResultRow}>
                <View style={styles.uploadedPhotoContainer}>
                  {Platform.OS === 'web' ? (
                    <img 
                      src={haircutResults.photoUri} 
                      alt="Your photo" 
                      style={{ 
                        width: 100, 
                        height: 100, 
                        objectFit: 'cover', 
                        borderRadius: 50 
                      }}
                    />
                  ) : (
                    <Image 
                      source={{ uri: haircutResults.photoUri }} 
                      style={styles.uploadedPhoto} 
                    />
                  )}
                  <Text style={styles.photoLabel}>Your Photo</Text>
                </View>
                
                <View style={styles.analysisDetails}>
                  <Text style={styles.analysisDetail}>
                    <Text style={styles.detailLabel}>Face Shape: </Text>
                    <Text style={styles.detailValue}>{haircutResults.faceShape.charAt(0).toUpperCase() + haircutResults.faceShape.slice(1)}</Text>
                  </Text>
                  <Text style={styles.analysisDetail}>
                    <Text style={styles.detailLabel}>Hair Type: </Text>
                    <Text style={styles.detailValue}>{haircutResults.hairType.charAt(0).toUpperCase() + haircutResults.hairType.slice(1)}</Text>
                  </Text>
                  <Text style={styles.analysisDetail}>
                    <Text style={styles.detailLabel}>Current Length: </Text>
                    <Text style={styles.detailValue}>{haircutResults.hairLength.charAt(0).toUpperCase() + haircutResults.hairLength.slice(1)}</Text>
                  </Text>
                </View>
              </View>
              
              <View style={styles.faceShapeContainer}>
                <Text style={styles.faceShapeTitle}>Your Face Shape</Text>
                <Text style={styles.faceShapeDescription}>
                  {haircutResults.faceShapeDescription}
                </Text>
              </View>
              
              <Text style={styles.suggestionsTitle}>Recommended Haircuts</Text>
              <Text style={styles.suggestionsSubtitle}>
                Based on your face shape and hair type, here are some haircuts that would suit you well:
              </Text>
              
              <View style={styles.haircutSuggestions}>
                {haircutResults.suggestions.map((haircut: HaircutSuggestion, index: number) => (
                  <Pressable 
                    key={index}
                    style={styles.haircutCard}
                    onPress={() => openHaircutDetails(haircut)}
                  >
                    {Platform.OS === 'web' ? (
                      <img 
                        src={haircut.imageUrl} 
                        alt={haircut.name} 
                        style={{ 
                          width: '100%', 
                          height: 150, 
                          objectFit: 'cover', 
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12
                        }}
                      />
                    ) : (
                      <Image 
                        source={{ uri: haircut.imageUrl }} 
                        style={styles.haircutImage} 
                      />
                    )}
                    <View style={styles.haircutCardContent}>
                      <Text style={styles.haircutName}>{haircut.name}</Text>
                      <Text style={styles.haircutMaintenance}>
                        Maintenance: {haircut.maintenanceLevel}
                      </Text>
                      <Pressable style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <ArrowRight size={16} color={Colors.dark.primary} />
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>
              
              <Pressable 
                style={styles.newAnalysisButton}
                onPress={() => {
                  setHaircutPhoto(null);
                  setHaircutResults(null);
                }}
              >
                <RefreshCw size={18} color={Colors.dark.text} />
                <Text style={styles.newAnalysisText}>Get New Analysis</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.haircutUploadContainer}>
              {haircutPhoto ? (
                <View style={styles.haircutPhotoPreview}>
                  {Platform.OS === 'web' ? (
                    <img 
                      src={haircutPhoto} 
                      alt="Haircut" 
                      style={{ 
                        width: 200, 
                        height: 200, 
                        objectFit: 'cover', 
                        borderRadius: 100 
                      }}
                    />
                  ) : (
                    <Image 
                      source={{ uri: haircutPhoto }} 
                      style={styles.haircutPhotoImage} 
                    />
                  )}
                  <View style={styles.photoActions}>
                    <Pressable 
                      style={styles.changePhotoButton}
                      onPress={handlePickHaircutPhoto}
                    >
                      <Text style={styles.changePhotoText}>Change Photo</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={styles.analyzeButton}
                      onPress={analyzeHaircut}
                      disabled={isAnalyzingHaircut}
                    >
                      {isAnalyzingHaircut ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Brain size={16} color="#FFFFFF" />
                          <Text style={styles.analyzeButtonText}>Analyze</Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable 
                  style={styles.haircutUploadButton}
                  onPress={handlePickHaircutPhoto}
                >
                  <Camera size={40} color={Colors.dark.primary} />
                  <Text style={styles.haircutUploadText}>Upload a clear photo of your face</Text>
                </Pressable>
              )}
              
              {haircutPhotoError && (
                <Text style={styles.errorText}>{haircutPhotoError}</Text>
              )}
              
              <View style={styles.haircutTipsContainer}>
                <Text style={styles.haircutTipsTitle}>Tips for a good photo:</Text>
                <Text style={styles.haircutTip}>• Face the camera directly</Text>
                <Text style={styles.haircutTip}>• Use good lighting</Text>
                <Text style={styles.haircutTip}>• Keep a neutral expression</Text>
                <Text style={styles.haircutTip}>• Show your current hairstyle clearly</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Beard Analysis Section - Only show for the beard tip */}
      {isBeardTip && (
        <View style={styles.haircutContainer}>
          <Text style={styles.haircutTitle}>Find Your Ideal Beard Style with AI</Text>
          <Text style={styles.haircutDescription}>
            Upload a clear photo of your face to get personalized beard style recommendations based on your face shape and current beard growth.
          </Text>
          
          {beardResults ? (
            <View style={styles.analysisResultsContainer}>
              <View style={styles.photoResultRow}>
                <View style={styles.uploadedPhotoContainer}>
                  {Platform.OS === 'web' ? (
                    <img 
                      src={beardResults.photoUri} 
                      alt="Your photo" 
                      style={{ 
                        width: 100, 
                        height: 100, 
                        objectFit: 'cover', 
                        borderRadius: 50 
                      }}
                    />
                  ) : (
                    <Image 
                      source={{ uri: beardResults.photoUri }} 
                      style={styles.uploadedPhoto} 
                    />
                  )}
                  <Text style={styles.photoLabel}>Your Photo</Text>
                </View>
                
                <View style={styles.analysisDetails}>
                  <Text style={styles.analysisDetail}>
                    <Text style={styles.detailLabel}>Face Shape: </Text>
                    <Text style={styles.detailValue}>{beardResults.faceShape.charAt(0).toUpperCase() + beardResults.faceShape.slice(1)}</Text>
                  </Text>
                  <Text style={styles.analysisDetail}>
                    <Text style={styles.detailLabel}>Beard Density: </Text>
                    <Text style={styles.detailValue}>{beardResults.beardDensity.charAt(0).toUpperCase() + beardResults.beardDensity.slice(1)}</Text>
                  </Text>
                  <Text style={styles.analysisDetail}>
                    <Text style={styles.detailLabel}>Current Style: </Text>
                    <Text style={styles.detailValue}>{beardResults.currentStyle.charAt(0).toUpperCase() + beardResults.currentStyle.slice(1).replace('-', ' ')}</Text>
                  </Text>
                </View>
              </View>
              
              <View style={styles.faceShapeContainer}>
                <Text style={styles.faceShapeTitle}>Your Face Shape</Text>
                <Text style={styles.faceShapeDescription}>
                  {beardResults.suggestions.faceShapeDescription}
                </Text>
              </View>
              
              <Text style={styles.suggestionsTitle}>Recommended Beard Styles</Text>
              <Text style={styles.suggestionsSubtitle}>
                Based on your face shape and beard density, here are some beard styles that would suit you well:
              </Text>
              
              <View style={styles.haircutSuggestions}>
                {beardResults.suggestions.beardStyles.map((style: BeardStyleSuggestion, index: number) => (
                  <Pressable 
                    key={index}
                    style={styles.haircutCard}
                    onPress={() => openBeardDetails(style)}
                  >
                    {Platform.OS === 'web' ? (
                      <img 
                        src={style.imageUrl} 
                        alt={style.name} 
                        style={{ 
                          width: '100%', 
                          height: 150, 
                          objectFit: 'cover', 
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12
                        }}
                      />
                    ) : (
                      <Image 
                        source={{ uri: style.imageUrl }} 
                        style={styles.haircutImage} 
                      />
                    )}
                    <View style={styles.haircutCardContent}>
                      <Text style={styles.haircutName}>{style.name}</Text>
                      <Text style={styles.haircutMaintenance}>
                        Maintenance: {style.maintenanceLevel}
                      </Text>
                      <Pressable style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <ArrowRight size={16} color={Colors.dark.primary} />
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>
              
              <Pressable 
                style={styles.newAnalysisButton}
                onPress={() => {
                  setBeardPhoto(null);
                  setBeardResults(null);
                }}
              >
                <RefreshCw size={18} color={Colors.dark.text} />
                <Text style={styles.newAnalysisText}>Get New Analysis</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.haircutUploadContainer}>
              {beardPhoto ? (
                <View style={styles.haircutPhotoPreview}>
                  {Platform.OS === 'web' ? (
                    <img 
                      src={beardPhoto} 
                      alt="Beard" 
                      style={{ 
                        width: 200, 
                        height: 200, 
                        objectFit: 'cover', 
                        borderRadius: 100 
                      }}
                    />
                  ) : (
                    <Image 
                      source={{ uri: beardPhoto }} 
                      style={styles.haircutPhotoImage} 
                    />
                  )}
                  <View style={styles.photoActions}>
                    <Pressable 
                      style={styles.changePhotoButton}
                      onPress={handlePickBeardPhoto}
                    >
                      <Text style={styles.changePhotoText}>Change Photo</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={styles.analyzeButton}
                      onPress={analyzeBeard}
                      disabled={isAnalyzingBeard}
                    >
                      {isAnalyzingBeard ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Brain size={16} color="#FFFFFF" />
                          <Text style={styles.analyzeButtonText}>Analyze</Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable 
                  style={styles.haircutUploadButton}
                  onPress={handlePickBeardPhoto}
                >
                  <Camera size={40} color={Colors.dark.primary} />
                  <Text style={styles.haircutUploadText}>Upload a clear photo of your face and beard</Text>
                </Pressable>
              )}
              
              {beardPhotoError && (
                <Text style={styles.errorText}>{beardPhotoError}</Text>
              )}
              
              <View style={styles.haircutTipsContainer}>
                <Text style={styles.haircutTipsTitle}>Tips for a good photo:</Text>
                <Text style={styles.haircutTip}>• Face the camera directly</Text>
                <Text style={styles.haircutTip}>• Use good lighting</Text>
                <Text style={styles.haircutTip}>• Show your current beard clearly</Text>
                <Text style={styles.haircutTip}>• Include your full face in the frame</Text>
              </View>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.addToRoutineButton}
          onPress={handleAddToRoutine}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addToRoutineText}>Add to Routine</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.completeButton,
            isCompleted ? styles.completedButton : {}
          ]}
          onPress={handleMarkComplete}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.completedButtonText}>Completed</Text>
            </>
          ) : (
            <Text style={styles.completeButtonText}>Mark as Completed</Text>
          )}
        </Pressable>
      </View>
      
      {/* Frequency Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Routine</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            <Text style={styles.modalText}>
              How often would you like to do this?
            </Text>
            
            <View style={styles.frequencyContainer}>
              {['daily', 'weekly', 'monthly'].map((frequency) => (
                <Pressable
                  key={frequency}
                  style={[
                    styles.frequencyButton,
                    selectedFrequency === frequency ? styles.selectedFrequencyButton : {}
                  ]}
                  onPress={() => setSelectedFrequency(frequency as 'daily' | 'weekly' | 'monthly')}
                >
                  <Text 
                    style={[
                      styles.frequencyButtonText,
                      selectedFrequency === frequency ? styles.selectedFrequencyText : {}
                    ]}
                  >
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            <Pressable 
              style={styles.confirmButton}
              onPress={handleConfirmAddToRoutine}
            >
              <Text style={styles.confirmButtonText}>Add to Routine</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Haircut Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={haircutModalVisible}
        onRequestClose={() => setHaircutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.haircutModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedHaircut?.name}</Text>
              <Pressable onPress={() => setHaircutModalVisible(false)}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            {selectedHaircut && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {Platform.OS === 'web' ? (
                  <img 
                    src={selectedHaircut.imageUrl} 
                    alt={selectedHaircut.name} 
                    style={{ 
                      width: '100%', 
                      height: 250, 
                      objectFit: 'cover', 
                      borderRadius: 12,
                      marginBottom: 16
                    }}
                  />
                ) : (
                  <Image 
                    source={{ uri: selectedHaircut.imageUrl }} 
                    style={styles.haircutDetailImage} 
                  />
                )}
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Description</Text>
                  <Text style={styles.haircutDetailText}>{selectedHaircut.description}</Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Why It Suits You</Text>
                  <Text style={styles.haircutDetailText}>{selectedHaircut.suitability}</Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Maintenance Level</Text>
                  <Text style={styles.haircutDetailText}>{selectedHaircut.maintenanceLevel}</Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>How to Ask Your Barber</Text>
                  <Text style={styles.haircutDetailText}>
                    Show them this picture and ask for a {selectedHaircut.name.toLowerCase()}. Mention that you have a {haircutResults?.faceShape} face shape and {haircutResults?.hairType} hair. Discuss how much time you're willing to spend styling it daily.
                  </Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Styling Tips</Text>
                  <Text style={styles.haircutDetailText}>
                    {selectedHaircut.name.includes("Textured") ? 
                      "Use a matte styling product like clay or paste. Apply to towel-dried hair and work through with your fingers for texture." :
                    selectedHaircut.name.includes("Pompadour") || selectedHaircut.name.includes("Quiff") ?
                      "Blow dry your hair while brushing it into the desired shape. Apply pomade or wax for hold and shine." :
                    selectedHaircut.name.includes("Crop") ?
                      "Apply a small amount of styling cream to damp hair and let it air dry for a natural finish." :
                    selectedHaircut.name.includes("Side Part") ?
                      "Use a comb to create a clean part. Apply pomade for a classic look or texture spray for a more casual style." :
                    "Keep it simple with a light styling product. Ask your barber for specific product recommendations for your hair type."}
                  </Text>
                </View>
              </ScrollView>
            )}
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setHaircutModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Beard Style Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={beardModalVisible}
        onRequestClose={() => setBeardModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.haircutModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedBeardStyle?.name}</Text>
              <Pressable onPress={() => setBeardModalVisible(false)}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            {selectedBeardStyle && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {Platform.OS === 'web' ? (
                  <img 
                    src={selectedBeardStyle.imageUrl} 
                    alt={selectedBeardStyle.name} 
                    style={{ 
                      width: '100%', 
                      height: 250, 
                      objectFit: 'cover', 
                      borderRadius: 12,
                      marginBottom: 16
                    }}
                  />
                ) : (
                  <Image 
                    source={{ uri: selectedBeardStyle.imageUrl }} 
                    style={styles.haircutDetailImage} 
                  />
                )}
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Description</Text>
                  <Text style={styles.haircutDetailText}>{selectedBeardStyle.description}</Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Why It Suits You</Text>
                  <Text style={styles.haircutDetailText}>{selectedBeardStyle.suitability}</Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Maintenance Level</Text>
                  <Text style={styles.haircutDetailText}>{selectedBeardStyle.maintenanceLevel}</Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>How to Achieve This Style</Text>
                  <Text style={styles.haircutDetailText}>
                    {selectedBeardStyle.name.includes("Stubble") ? 
                      "Use a beard trimmer with a short guard (1-3mm). Trim every 2-3 days to maintain the perfect length. Define your neckline just above your Adam's apple." :
                    selectedBeardStyle.name.includes("Goatee") ?
                      "Grow your facial hair for 1-2 weeks. Use a precision trimmer to shape the goatee around your mouth and chin. Keep cheeks clean-shaven." :
                    selectedBeardStyle.name.includes("Full Beard") ?
                      "Grow your beard for 4-6 weeks without trimming. Then shape with scissors and a trimmer, defining your neckline and cheek lines." :
                    selectedBeardStyle.name.includes("Boxed") ?
                      "Grow your beard for 2-3 weeks. Use a trimmer to create clean, straight lines at the cheeks and a defined neckline. Keep the length uniform with regular trimming." :
                    selectedBeardStyle.name.includes("Chin Strap") ?
                      "Shave your cheeks and neck clean. Use a precision trimmer to create a thin line that follows your jawline from ear to ear." :
                    "Start by growing your beard for several weeks. Visit a professional barber for the initial shaping, then maintain with regular trimming and proper beard care products."}
                  </Text>
                </View>
                
                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Maintenance Tips</Text>
                  <Text style={styles.haircutDetailText}>
                    {selectedBeardStyle.maintenanceLevel === "Low" ? 
                      "Wash with beard shampoo 2-3 times per week. Trim every 1-2 weeks to maintain shape. Apply beard oil occasionally to keep hair soft." :
                    selectedBeardStyle.maintenanceLevel === "Medium" ?
                      "Wash with beard shampoo 2-3 times per week. Apply beard oil daily to keep hair soft and healthy. Trim weekly to maintain shape. Use a beard brush to train hair direction." :
                    "Wash with beard shampoo 2-3 times per week. Apply beard oil daily and beard balm for styling. Trim every 3-4 days to maintain precise shape. Use a beard brush and comb daily. Consider professional trimming monthly."}
                  </Text>
                </View>

                <View style={styles.haircutDetailSection}>
                  <Text style={styles.haircutDetailTitle}>Recommended Products</Text>
                  <Text style={styles.haircutDetailText}>
                    • Quality beard trimmer with multiple guard lengths{"\n"}
                    • Beard shampoo and conditioner{"\n"}
                    • Beard oil for hydration{"\n"}
                    {selectedBeardStyle.maintenanceLevel !== "Low" ? "• Beard balm for styling\n" : ""}
                    {selectedBeardStyle.maintenanceLevel === "High" ? "• Beard wax for precise styling\n" : ""}
                    • Beard brush and comb{"\n"}
                    • Precision scissors for detailing
                  </Text>
                </View>
              </ScrollView>
            )}
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setBeardModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  category: {
    fontSize: 14,
    color: Colors.dark.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginLeft: 4,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  impactLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginRight: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  descriptionContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.dark.text,
  },
  buttonContainer: {
    gap: 12,
  },
  addToRoutineButton: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToRoutineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    backgroundColor: Colors.dark.success,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.dark.error,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
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
  haircutModalContent: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
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
  modalText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
  },
  selectedFrequencyButton: {
    backgroundColor: Colors.dark.primary,
  },
  frequencyButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  selectedFrequencyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Haircut Analysis Styles
  haircutContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  haircutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  haircutDescription: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  haircutUploadContainer: {
    alignItems: 'center',
  },
  haircutUploadButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    marginBottom: 16,
  },
  haircutUploadText: {
    fontSize: 16,
    color: Colors.dark.primary,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  haircutTipsContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginTop: 8,
  },
  haircutTipsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.primary,
    marginBottom: 8,
  },
  haircutTip: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  haircutPhotoPreview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  haircutPhotoImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  changePhotoText: {
    fontSize: 16,
    color: Colors.dark.primary,
  },
  analyzeButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  // Analysis Results Styles
  analysisResultsContainer: {
    width: '100%',
  },
  photoResultRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  uploadedPhotoContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  uploadedPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 4,
  },
  photoLabel: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  analysisDetails: {
    flex: 1,
  },
  analysisDetail: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: Colors.dark.primary,
  },
  detailValue: {
    color: Colors.dark.text,
  },
  faceShapeContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  faceShapeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    marginBottom: 4,
  },
  faceShapeDescription: {
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  suggestionsSubtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 16,
  },
  haircutSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  haircutCard: {
    width: '48%',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 8,
  },
  haircutImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  haircutCardContent: {
    padding: 12,
  },
  haircutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  haircutMaintenance: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginBottom: 8,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.dark.primary,
    marginRight: 4,
  },
  newAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  newAnalysisText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 8,
  },
  // Haircut Detail Modal Styles
  haircutDetailImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  haircutDetailSection: {
    marginBottom: 16,
  },
  haircutDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    marginBottom: 8,
  },
  haircutDetailText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  closeModalButton: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
});