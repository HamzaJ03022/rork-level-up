import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, ProgressPhoto, Routine, AIAnalysisResult, HaircutAnalysis } from '@/types';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  aiAnalysis: {
    lastAnalysis: string | null;
    results: AIAnalysisResult | null;
  };
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  addProgressPhoto: (photo: ProgressPhoto) => void;
  removeProgressPhoto: (id: string) => void;
  addRoutine: (routine: Routine) => void;
  toggleRoutineCompletion: (id: string, completed: boolean) => void;
  removeRoutine: (id: string) => void;
  markTipCompleted: (tipId: string) => void;
  setOnboarded: (value: boolean) => void;
  setAIAnalysis: (results: AIAnalysisResult) => void;
  setHaircutAnalysis: (analysis: HaircutAnalysis) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isOnboarded: false,
      aiAnalysis: {
        lastAnalysis: null,
        results: null,
      },
      
      setProfile: (profile) => set({ profile }),
      
      addProgressPhoto: (photo) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          progressPhotos: [photo, ...state.profile.progressPhotos]
        } : null
      })),
      
      removeProgressPhoto: (id) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          progressPhotos: state.profile.progressPhotos.filter(photo => photo.id !== id)
        } : null
      })),
      
      addRoutine: (routine) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          routines: [...state.profile.routines, routine]
        } : null
      })),
      
      toggleRoutineCompletion: (id, completed) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          routines: state.profile.routines.map(routine => 
            routine.id === id 
              ? { ...routine, completed, lastCompleted: completed ? new Date().toISOString() : routine.lastCompleted } 
              : routine
          )
        } : null
      })),
      
      removeRoutine: (id) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          routines: state.profile.routines.filter(routine => routine.id !== id)
        } : null
      })),
      
      markTipCompleted: (tipId) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          completedTips: [...state.profile.completedTips, tipId]
        } : null
      })),
      
      setOnboarded: (value) => set({ isOnboarded: value }),
      
      setAIAnalysis: (results) => set({
        aiAnalysis: {
          lastAnalysis: new Date().toISOString(),
          results
        }
      }),

      setHaircutAnalysis: (analysis) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          haircutAnalysis: analysis
        } : null
      })),
    }),
    {
      name: 'level-up-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);