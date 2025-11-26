# Quick Reference: Using OpenAI in Your App

## 1. ANALYZE APPEARANCE
Convert images and send to backend for AI analysis

```typescript
import { trpc } from '@/lib/trpc';
import { convertImageToBase64 } from '@/lib/image-utils';

const analyzeAppearanceMutation = trpc.ai.analyzeAppearance.useMutation();

const analyzePhotos = async (faceUri: string, bodyUri: string) => {
  const faceBase64 = await convertImageToBase64(faceUri);
  const bodyBase64 = await convertImageToBase64(bodyUri);
  
  const result = await analyzeAppearanceMutation.mutateAsync({
    facePhotoBase64: faceBase64,
    bodyPhotoBase64: bodyBase64,
    userGoals: ['Improve skin', 'Build muscle'],
    currentRoutines: ['Skincare routine', 'Gym 3x/week']
  });
  
  return result;
};
```

Result structure:
```typescript
{
  face: { strengths: [], suggestions: [] },
  skin: { strengths: [], suggestions: [] },
  hair: { strengths: [], suggestions: [] },
  body: { strengths: [], suggestions: [] },
  posture: { strengths: [], suggestions: [] },
  priorityAreas: [],
  analysisDate: "2025-01-01T00:00:00.000Z"
}
```

## 2. AI CHAT
Send messages and get contextual responses

```typescript
const chatMutation = trpc.ai.chat.useMutation();

const askAI = async (userMessage: string, previousMessages: any[] = []) => {
  const result = await chatMutation.mutateAsync({
    messages: [
      ...previousMessages,
      { role: 'user', content: userMessage }
    ],
    context: {
      userGoals: ['Build muscle', 'Clear skin'],
      currentRoutines: ['Morning workout', 'Skincare'],
      recentAnalysis: yourAnalysisResults // optional
    }
  });
  
  return result.message;
};
```

## 3. LOADING & ERROR STATES
Use React Query states from mutations

```typescript
const {
  mutate: analyze,
  isPending,
  isError,
  error,
  data
} = trpc.ai.analyzeAppearance.useMutation();

// In your component:
if (isPending) return <LoadingSpinner />;
if (isError) return <ErrorMessage error={error.message} />;
if (data) return <AnalysisResults data={data} />;
```

## 4. CONVERT IMAGES TO BASE64
Works on both web and mobile

```typescript
import { convertImageToBase64 } from '@/lib/image-utils';

const base64 = await convertImageToBase64(imageUri);
// Returns: base64 string without "data:image/..." prefix
```

## 5. FULL EXAMPLE COMPONENT

```typescript
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { trpc } from '@/lib/trpc';
import { convertImageToBase64 } from '@/lib/image-utils';

export function AIAnalysisScreen() {
  const [result, setResult] = useState(null);
  const analyzeMutation = trpc.ai.analyzeAppearance.useMutation();
  
  const handleAnalyze = async () => {
    try {
      // Assuming you have photo URIs
      const faceBase64 = await convertImageToBase64(facePhotoUri);
      const bodyBase64 = await convertImageToBase64(bodyPhotoUri);
      
      const analysis = await analyzeMutation.mutateAsync({
        facePhotoBase64: faceBase64,
        bodyPhotoBase64: bodyBase64,
        userGoals: userGoals,
        currentRoutines: userRoutines
      });
      
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze. Please try again.');
    }
  };
  
  return (
    <View>
      <Button
        title={analyzeMutation.isPending ? "Analyzing..." : "Analyze Photos"}
        onPress={handleAnalyze}
        disabled={analyzeMutation.isPending}
      />
      
      {result && (
        <View>
          <Text>Face: {result.face.suggestions.join(', ')}</Text>
          <Text>Skin: {result.skin.suggestions.join(', ')}</Text>
          <Text>Priority: {result.priorityAreas.join(', ')}</Text>
        </View>
      )}
    </View>
  );
}
```

## REMEMBER:
- Always convert images to base64 before sending
- Handle loading and error states
- Add your OpenAI API key to .env file
- Never commit .env file to git
- Monitor OpenAI usage and costs
- Use `isPending` instead of `isLoading` in newer versions of React Query
