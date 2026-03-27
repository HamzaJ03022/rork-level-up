export type ProgressPhoto = {
  id: string;
  uri: string;
  date: string;
  notes?: string;
};

export type Routine = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  lastCompleted?: string;
};

export type UserProfile = {
  name: string;
  age?: number;
  height?: {
    value: number;
    unit: 'cm' | 'ft';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  facePhoto?: string;
  bodyPhoto?: string;
  currentRoutines: string[];
  selectedMotivationalGoals: string[];
  selectedImprovementRoutines: string[];
  startDate: string;
  progressPhotos: ProgressPhoto[];
  routines: Routine[];
  completedTips: string[];
  haircutAnalysis?: HaircutAnalysis;
  beardAnalysis?: BeardAnalysis;
};

export type AIAnalysisResult = {
  face?: {
    strengths: string[];
    suggestions: string[];
  };
  skin?: {
    strengths: string[];
    suggestions: string[];
  };
  hair?: {
    strengths: string[];
    suggestions: string[];
  };
  body?: {
    strengths: string[];
    suggestions: string[];
  };
  posture?: {
    strengths: string[];
    suggestions: string[];
  };
  style?: {
    strengths: string[];
    suggestions: string[];
  };
  priorityAreas?: string[];
};

export type AppearanceGoal = {
  id: string;
  title: string;
  description: string;
  category: string;
  recommendedFrequency: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
};

export type MotivationalGoal = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export type HaircutSuggestion = {
  name: string;
  description: string;
  suitability: string;
  maintenanceLevel: string;
  imageUrl: string;
};

export type HaircutAnalysis = {
  photoUri: string;
  faceShape: string;
  hairType: string;
  hairLength: string;
  faceShapeDescription: string;
  suggestions: HaircutSuggestion[];
  analysisDate: string;
};

export type BeardStyleSuggestion = {
  name: string;
  description: string;
  suitability: string;
  maintenanceLevel: string;
  imageUrl: string;
};

export type BeardAnalysis = {
  photoUri: string;
  faceShape: string;
  beardDensity: string;
  currentStyle: string;
  faceShapeDescription: string;
  suggestions: BeardStyleSuggestion[];
  analysisDate: string;
};