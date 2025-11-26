import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateChatCompletion } from "@/backend/services/openai";

export default publicProcedure
  .input(z.object({ 
    messages: z.array(z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    })),
    context: z.object({
      userGoals: z.array(z.string()).optional(),
      currentRoutines: z.array(z.string()).optional(),
      recentAnalysis: z.any().optional(),
    }).optional(),
  }))
  .mutation(async ({ input }) => {
    const { messages, context } = input;
    
    const systemMessage = {
      role: 'system' as const,
      content: `You are an expert appearance and self-improvement coach. You provide practical, actionable advice on topics like skincare, fitness, grooming, style, and overall appearance improvement.

Be encouraging, specific, and practical in your responses. Focus on achievable steps and scientific backing where applicable.

${context?.userGoals && context.userGoals.length > 0 ? `User's goals: ${context.userGoals.join(', ')}` : ''}
${context?.currentRoutines && context.currentRoutines.length > 0 ? `User's current routines: ${context.currentRoutines.join(', ')}` : ''}
${context?.recentAnalysis ? `User's recent appearance analysis: ${JSON.stringify(context.recentAnalysis)}` : ''}`
    };
    
    const allMessages = [systemMessage, ...messages];
    
    try {
      const response = await generateChatCompletion({
        messages: allMessages,
        temperature: 0.7,
        maxTokens: 1000,
      });
      
      return {
        message: response.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  });
