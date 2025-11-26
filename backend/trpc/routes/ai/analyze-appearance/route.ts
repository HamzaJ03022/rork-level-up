import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { analyzeImageWithVision, generateChatCompletion } from "@/backend/services/openai";

export default protectedProcedure
  .input(z.object({ 
    facePhotoBase64: z.string().optional(),
    bodyPhotoBase64: z.string().optional(),
    userGoals: z.array(z.string()).optional(),
    currentRoutines: z.array(z.string()).optional(),
  }))
  .mutation(async ({ input }) => {
    const { facePhotoBase64, bodyPhotoBase64, userGoals, currentRoutines } = input;
    
    if (!facePhotoBase64 && !bodyPhotoBase64) {
      throw new Error('At least one photo (face or body) is required for analysis');
    }
    
    const analysisResults: any = {
      face: { strengths: [], suggestions: [] },
      skin: { strengths: [], suggestions: [] },
      hair: { strengths: [], suggestions: [] },
      body: { strengths: [], suggestions: [] },
      posture: { strengths: [], suggestions: [] },
      priorityAreas: []
    };
    
    try {
      if (facePhotoBase64) {
        const faceAnalysisPrompt = `You are an expert appearance consultant. Analyze this face photo and provide:
1. Three specific strengths about the person's facial features, skin, and overall appearance
2. Three actionable suggestions for improvement in areas like skincare, grooming, facial hair, hairstyle

Format your response as JSON with this structure:
{
  "face": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  "skin": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  "hair": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  }
}

Be specific, encouraging, and actionable in your suggestions.${userGoals && userGoals.length > 0 ? `\n\nUser goals: ${userGoals.join(', ')}` : ''}${currentRoutines && currentRoutines.length > 0 ? `\n\nCurrent routines: ${currentRoutines.join(', ')}` : ''}`;
        
        const faceAnalysis = await analyzeImageWithVision({
          imageUrl: `data:image/jpeg;base64,${facePhotoBase64}`,
          prompt: faceAnalysisPrompt,
        });
        
        const faceData = JSON.parse(faceAnalysis.content);
        
        if (faceData.face) {
          analysisResults.face = faceData.face;
        }
        if (faceData.skin) {
          analysisResults.skin = faceData.skin;
        }
        if (faceData.hair) {
          analysisResults.hair = faceData.hair;
        }
      }
      
      if (bodyPhotoBase64) {
        const bodyAnalysisPrompt = `You are an expert fitness and posture consultant. Analyze this body photo and provide:
1. Three specific strengths about the person's physique, posture, and body composition
2. Three actionable suggestions for improvement in areas like fitness, posture, body composition

Format your response as JSON with this structure:
{
  "body": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  "posture": {
    "strengths": ["strength 1", "strength 2"],
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  }
}

Be specific, encouraging, and actionable in your suggestions.${userGoals && userGoals.length > 0 ? `\n\nUser goals: ${userGoals.join(', ')}` : ''}${currentRoutines && currentRoutines.length > 0 ? `\n\nCurrent routines: ${currentRoutines.join(', ')}` : ''}`;
        
        const bodyAnalysis = await analyzeImageWithVision({
          imageUrl: `data:image/jpeg;base64,${bodyPhotoBase64}`,
          prompt: bodyAnalysisPrompt,
        });
        
        const bodyData = JSON.parse(bodyAnalysis.content);
        
        if (bodyData.body) {
          analysisResults.body = bodyData.body;
        }
        if (bodyData.posture) {
          analysisResults.posture = bodyData.posture;
        }
      }
      
      const priorityPrompt = `Based on this appearance analysis, identify the top 5 priority areas the person should focus on to improve their appearance. Return ONLY a JSON array of strings, like: ["area 1", "area 2", "area 3", "area 4", "area 5"]

Analysis data:
${JSON.stringify(analysisResults, null, 2)}

${userGoals && userGoals.length > 0 ? `User goals: ${userGoals.join(', ')}` : ''}
${currentRoutines && currentRoutines.length > 0 ? `Current routines: ${currentRoutines.join(', ')}` : ''}`;
      
      const priorityResponse = await generateChatCompletion({
        messages: [
          {
            role: 'system',
            content: 'You are an expert appearance consultant. Respond ONLY with valid JSON.'
          },
          {
            role: 'user',
            content: priorityPrompt
          }
        ],
        temperature: 0.3,
        maxTokens: 300,
      });
      
      try {
        const priorityAreas = JSON.parse(priorityResponse.content);
        if (Array.isArray(priorityAreas)) {
          analysisResults.priorityAreas = priorityAreas;
        }
      } catch (e) {
        console.error('Failed to parse priority areas:', e);
        analysisResults.priorityAreas = [
          'Skincare routine',
          'Fitness and strength training',
          'Grooming and styling',
          'Posture improvement',
          'Nutrition and hydration'
        ];
      }
      
    } catch (error) {
      console.error('Error during AI analysis:', error);
      throw new Error('Failed to analyze photos. Please try again.');
    }
    
    return {
      ...analysisResults,
      analysisDate: new Date().toISOString()
    };
  });
