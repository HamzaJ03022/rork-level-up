# OpenAI Integration Setup

Your app now has secure OpenAI integration built into the backend! 🎉

## What's Been Added

### Backend Services
- **OpenAI Service** (`backend/services/openai.ts`)
  - Secure client initialization
  - Chat completion generation
  - Vision API for image analysis
  - Centralized error handling

### API Endpoints (tRPC)
- **`ai.analyzeAppearance`** - Analyzes face/body photos and provides personalized advice
  - Accepts base64 encoded images
  - Returns detailed analysis with strengths and suggestions
  - Considers user goals and current routines

- **`ai.chat`** - AI chat for appearance advice
  - Context-aware responses
  - Considers user profile and recent analysis
  - Natural conversation flow

## Setup Instructions

### 1. Get Your OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key (starts with `sk-`)

### 2. Configure Environment Variable
1. Open the `.env` file in your project root
2. Add your API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. Save the file

**IMPORTANT**: 
- Never commit the `.env` file with your real API key to git
- The `.env` file is already in `.gitignore` to protect your key
- Use `.env.example` as a template for team members

### 3. Restart Your Development Server
After adding the API key, restart your Expo server:
```bash
npm start
```

## How to Use in Your App

### Example 1: Analyze Appearance
```typescript
import { trpc } from '@/lib/trpc';

// In your component
const analyzeAppearanceMutation = trpc.ai.analyzeAppearance.useMutation();

const handleAnalyze = async (facePhoto: string, bodyPhoto: string) => {
  try {
    // Convert images to base64 (without the data:image prefix)
    const faceBase64 = facePhoto.replace(/^data:image\/\w+;base64,/, '');
    const bodyBase64 = bodyPhoto.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await analyzeAppearanceMutation.mutateAsync({
      facePhotoBase64: faceBase64,
      bodyPhotoBase64: bodyBase64,
      userGoals: ['Build muscle', 'Clear skin'],
      currentRoutines: ['Morning skincare', 'Gym 3x/week']
    });
    
    console.log('Analysis:', result);
    // result contains: face, skin, hair, body, posture, priorityAreas
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};
```

### Example 2: AI Chat
```typescript
import { trpc } from '@/lib/trpc';

// In your component
const chatMutation = trpc.ai.chat.useMutation();

const askAI = async (userMessage: string) => {
  try {
    const result = await chatMutation.mutateAsync({
      messages: [
        { role: 'user', content: userMessage }
      ],
      context: {
        userGoals: ['Build muscle', 'Improve skin'],
        currentRoutines: ['Morning workout', 'Skincare routine'],
        recentAnalysis: aiAnalysisResults // optional
      }
    });
    
    console.log('AI Response:', result.message);
  } catch (error) {
    console.error('Chat failed:', error);
  }
};
```

## Security Features ✅

1. **API Key Protection**
   - API key stored securely in environment variable
   - Never exposed to the frontend
   - Not included in client-side bundles

2. **Backend-Only Processing**
   - All OpenAI calls made from backend
   - Frontend only sends image data and receives results
   - Rate limiting possible at backend level

3. **Error Handling**
   - Graceful error messages for users
   - Detailed logging for debugging
   - No API key exposure in error messages

## API Models Used

- **Chat/Analysis**: `gpt-4o` (latest GPT-4 optimized model)
- **Vision**: `gpt-4o` (supports image analysis)

You can change models in `backend/services/openai.ts` if needed.

## Cost Considerations

OpenAI charges per token (text) and per image analyzed:
- GPT-4o: ~$0.005 per 1K input tokens, ~$0.015 per 1K output tokens
- Vision: ~$0.01 per image

Monitor usage at: https://platform.openai.com/usage

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"
- Make sure `.env` file exists in project root
- Verify the variable is named exactly `OPENAI_API_KEY`
- Restart your development server after adding the key

### "Failed to analyze photos"
- Check your API key is valid
- Ensure you have credits in your OpenAI account
- Verify images are properly base64 encoded

### Rate Limiting
If you get rate limit errors, consider:
- Implementing request throttling
- Caching responses
- Upgrading your OpenAI plan

## Next Steps

1. Replace the mock AI analysis in `app/ai-advice.tsx` with real OpenAI calls
2. Add a chat interface using the `ai.chat` endpoint
3. Implement loading states and error handling
4. Consider adding response caching for better performance

## Support

For OpenAI API issues: https://help.openai.com
For integration questions: Check the code comments in `backend/services/openai.ts`
