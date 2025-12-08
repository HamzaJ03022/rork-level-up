import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { analyzeImageWithVision } from "@/backend/services/openai";

export default protectedProcedure
  .input(z.object({ 
    photoUri: z.string(),
    faceShape: z.string().optional(),
    hairType: z.string().optional(),
    currentHairLength: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log('[Haircut Analysis] Starting analysis...');
    
    const prompt = `Analyze this person's appearance and provide haircut recommendations.
    
    Please analyze:
    1. Face shape (oval, round, square, heart, diamond, or oblong)
    2. Hair type (straight, wavy, curly, or coily)
    3. Current hair length (short, medium, or long)
    
    Based on your analysis, respond with ONLY a JSON object (no markdown, no code blocks) in this exact format:
    {
      "faceShape": "detected face shape",
      "hairType": "detected hair type",
      "hairLength": "detected hair length",
      "explanation": "Brief explanation of why these characteristics were identified"
    }`;

    try {
      const aiResponse = await analyzeImageWithVision({
        imageUrl: input.photoUri,
        prompt,
      });

      console.log('[Haircut Analysis] AI response:', aiResponse.content);
      
      const cleanedResponse = aiResponse.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(cleanedResponse);
      
      const detectedFaceShape = input.faceShape || analysis.faceShape;
      const detectedHairType = input.hairType || analysis.hairType;
      const detectedHairLength = input.currentHairLength || analysis.hairLength;

      const haircutSuggestions = generateHaircutSuggestions(detectedFaceShape, detectedHairType, detectedHairLength);

      console.log('[Haircut Analysis] Analysis complete');

      return {
        faceShape: detectedFaceShape,
        hairType: detectedHairType,
        hairLength: detectedHairLength,
        suggestions: haircutSuggestions,
        aiExplanation: analysis.explanation,
        analysisDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('[Haircut Analysis] Error:', error);
      throw new Error('Failed to analyze haircut photo. Please try again.');
    }
  });

// Helper function to generate haircut suggestions based on face shape and hair type
function generateHaircutSuggestions(faceShape: string, hairType: string, hairLength: string) {
  const suggestions = {
    oval: {
      description: "Oval face shapes are versatile and can pull off almost any haircut.",
      haircuts: {
        short: [
          {
            name: "Classic Crew Cut",
            description: "A timeless short haircut with slightly more length on top than the sides.",
            suitability: "Excellent for your oval face shape as it maintains balanced proportions.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
          },
          {
            name: "Textured Crop",
            description: "Short on the sides with textured length on top for movement and dimension.",
            suitability: "Complements your oval face shape while adding modern style.",
            maintenanceLevel: "Low to Medium",
            imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Short Pompadour",
            description: "Classic style with height at the front and shorter sides.",
            suitability: "Works well with your face shape while adding a touch of sophistication.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Modern Quiff",
            description: "Medium length on top styled upward and back with shorter sides.",
            suitability: "Perfect for your oval face shape, adding height and dimension.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Side Part",
            description: "Classic medium length style with a defined side part.",
            suitability: "Complements your oval face shape with timeless appeal.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?q=80&w=1970&auto=format&fit=crop"
          },
          {
            name: "Textured Fringe",
            description: "Medium length with textured layers and a forward-styled fringe.",
            suitability: "Works well with your face shape while adding modern style.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?q=80&w=2076&auto=format&fit=crop"
          }
        ],
        long: [
          {
            name: "Layered Cut",
            description: "Longer hair with layers for movement and dimension.",
            suitability: "Excellent for your oval face shape, adding texture without overwhelming your features.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Man Bun",
            description: "Longer hair that can be tied back into a bun.",
            suitability: "Works well with your oval face shape for a contemporary look.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1923&auto=format&fit=crop"
          },
          {
            name: "Shoulder-Length Cut",
            description: "Hair that falls around the shoulders with minimal layering.",
            suitability: "Complements your oval face shape while making a statement.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=1780&auto=format&fit=crop"
          }
        ]
      }
    },
    round: {
      description: "Round face shapes benefit from haircuts that add angles and height to balance facial fullness.",
      haircuts: {
        short: [
          {
            name: "Undercut",
            description: "Very short sides with longer top that can be styled up for height.",
            suitability: "Excellent for your round face shape as it adds angles and height.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=1854&auto=format&fit=crop"
          },
          {
            name: "Faux Hawk",
            description: "Shorter sides with length on top styled upward.",
            suitability: "Creates the illusion of length for your round face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1584486483122-af7d49cf2992?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "High and Tight",
            description: "Very short sides with slightly more length on top.",
            suitability: "Adds structure to complement your round face shape.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Pompadour",
            description: "Classic style with significant height at the front and shorter sides.",
            suitability: "Perfect for your round face shape, adding height to elongate your face.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1541975902809-04c201d0a56b?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Textured Slick Back",
            description: "Medium length on top styled backward with shorter sides.",
            suitability: "Adds length to your round face shape for a more balanced look.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1541975902809-04c201d0a56b?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Side-Swept Undercut",
            description: "Undercut with longer top hair swept to one side.",
            suitability: "Creates angles that complement your round face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        long: [
          {
            name: "Long Layered Cut",
            description: "Longer hair with layers starting at the chin or below.",
            suitability: "The layers help create angles that complement your round face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Long Undercut",
            description: "Shaved sides with long top hair that can be tied back.",
            suitability: "Creates a striking contrast that works well with your round face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Textured Long Cut",
            description: "Longer hair with lots of texture and layers.",
            suitability: "Adds dimension that complements your round face shape.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=1780&auto=format&fit=crop"
          }
        ]
      }
    },
    square: {
      description: "Square face shapes have strong jawlines and benefit from haircuts that soften angles while maintaining masculinity.",
      haircuts: {
        short: [
          {
            name: "Buzz Cut with Faded Sides",
            description: "Very short all over with slightly faded sides.",
            suitability: "Emphasizes your strong jawline while keeping a clean look.",
            maintenanceLevel: "Very Low",
            imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Textured French Crop",
            description: "Short sides with textured length on top and a short fringe.",
            suitability: "The fringe helps soften your square face shape while maintaining structure.",
            maintenanceLevel: "Low to Medium",
            imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Short Sides with Curly Top",
            description: "Faded sides with natural curls on top.",
            suitability: "The curls add softness to balance your strong jawline.",
            maintenanceLevel: "Low to Medium",
            imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Textured Quiff",
            description: "Medium length on top styled upward with texture and shorter sides.",
            suitability: "Adds height while the texture softens your square face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Medium Length with Side Part",
            description: "Classic medium length style with a defined side part.",
            suitability: "The side part adds asymmetry that complements your square face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?q=80&w=1970&auto=format&fit=crop"
          },
          {
            name: "Brushed Back Style",
            description: "Medium length hair brushed back from the forehead.",
            suitability: "Creates a flowing look that softens your square face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1541975902809-04c201d0a56b?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        long: [
          {
            name: "Long Layered Cut",
            description: "Longer hair with layers for movement.",
            suitability: "The length and layers soften your square face shape.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Long Hair with Middle Part",
            description: "Longer hair parted down the middle.",
            suitability: "The middle part and length help soften your square face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Man Bun with Beard",
            description: "Longer hair tied back with a complementary beard.",
            suitability: "Works well with your square face shape, especially with a well-groomed beard.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1923&auto=format&fit=crop"
          }
        ]
      }
    },
    heart: {
      description: "Heart face shapes have wider foreheads and narrower chins, benefiting from haircuts that balance these proportions.",
      haircuts: {
        short: [
          {
            name: "Short Textured Cut",
            description: "Short all over with texture on top.",
            suitability: "Balances your heart-shaped face by adding width at the jawline.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
          },
          {
            name: "Short Side Part",
            description: "Classic short cut with a defined side part.",
            suitability: "Adds structure that complements your heart-shaped face.",
            maintenanceLevel: "Low to Medium",
            imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Buzz Cut with Beard",
            description: "Very short hair paired with a fuller beard.",
            suitability: "The beard adds width to your jawline, balancing your heart-shaped face.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Textured Fringe",
            description: "Medium length with textured layers and a forward-styled fringe.",
            suitability: "The fringe helps balance your wider forehead.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "Medium Length with Volume",
            description: "Medium length styled for volume on the sides.",
            suitability: "Adds width at the temples and jawline to balance your heart-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?q=80&w=1970&auto=format&fit=crop"
          },
          {
            name: "Brushed Back with Fade",
            description: "Medium length on top brushed back with faded sides.",
            suitability: "Creates balance for your heart-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1541975902809-04c201d0a56b?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        long: [
          {
            name: "Long Layered Cut",
            description: "Longer hair with layers for movement.",
            suitability: "The layers help balance your heart-shaped face.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Long Hair with Side Part",
            description: "Longer hair with a deep side part.",
            suitability: "The side part helps balance your wider forehead.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Long Textured Cut with Beard",
            description: "Longer textured hair paired with a beard.",
            suitability: "The beard adds width to your jawline, balancing your heart-shaped face.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1923&auto=format&fit=crop"
          }
        ]
      }
    },
    diamond: {
      description: "Diamond face shapes have narrow foreheads and jawlines with wider cheekbones, benefiting from haircuts that add width at the forehead and jawline.",
      haircuts: {
        short: [
          {
            name: "Textured Crop with Fringe",
            description: "Short on the sides with textured length on top and a fringe.",
            suitability: "The fringe adds width to your forehead, balancing your diamond-shaped face.",
            maintenanceLevel: "Low to Medium",
            imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Short Cut with Beard",
            description: "Short hair paired with a fuller beard.",
            suitability: "The beard adds width to your jawline, balancing your diamond-shaped face.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Textured Crew Cut",
            description: "Classic short haircut with texture on top.",
            suitability: "Adds width at the temples to balance your diamond-shaped face.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Textured Fringe",
            description: "Medium length with textured layers and a forward-styled fringe.",
            suitability: "The fringe adds width to your forehead, balancing your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "Medium Length with Volume",
            description: "Medium length styled for volume on the sides.",
            suitability: "Adds width at the temples to balance your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?q=80&w=1970&auto=format&fit=crop"
          },
          {
            name: "Side Part with Volume",
            description: "Medium length with a side part and volume on top.",
            suitability: "Creates balance for your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        long: [
          {
            name: "Long Layered Cut",
            description: "Longer hair with layers for movement.",
            suitability: "The layers help balance your diamond-shaped face.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Long Hair with Beard",
            description: "Longer hair paired with a beard.",
            suitability: "The beard adds width to your jawline, balancing your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1923&auto=format&fit=crop"
          },
          {
            name: "Long Textured Cut",
            description: "Longer hair with lots of texture and layers.",
            suitability: "Adds dimension that complements your diamond-shaped face.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=1780&auto=format&fit=crop"
          }
        ]
      }
    },
    oblong: {
      description: "Oblong face shapes are longer than they are wide, benefiting from haircuts that add width and reduce the appearance of length.",
      haircuts: {
        short: [
          {
            name: "Textured Crop with Fringe",
            description: "Short on the sides with textured length on top and a fringe.",
            suitability: "The fringe shortens your face length while adding width.",
            maintenanceLevel: "Low to Medium",
            imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Short Cut with Beard",
            description: "Short hair paired with a fuller beard.",
            suitability: "The beard adds width to your face, balancing your oblong face shape.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Textured Crew Cut",
            description: "Classic short haircut with texture on top.",
            suitability: "Adds width at the temples to balance your oblong face shape.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Textured Fringe",
            description: "Medium length with textured layers and a forward-styled fringe.",
            suitability: "The fringe shortens your face length while the texture adds width.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "Medium Length with Volume",
            description: "Medium length styled for volume on the sides.",
            suitability: "Adds width to balance your oblong face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?q=80&w=1970&auto=format&fit=crop"
          },
          {
            name: "Side Part with Volume",
            description: "Medium length with a side part and volume on top and sides.",
            suitability: "Creates width that complements your oblong face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        long: [
          {
            name: "Long Layered Cut with Volume",
            description: "Longer hair with layers for movement and volume.",
            suitability: "The volume at the sides adds width to balance your oblong face shape.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Long Hair with Beard",
            description: "Longer hair paired with a fuller beard.",
            suitability: "The beard adds width to your face, balancing your oblong face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1923&auto=format&fit=crop"
          },
          {
            name: "Long Textured Cut with Side Part",
            description: "Longer hair with lots of texture and a side part.",
            suitability: "Adds dimension and width that complements your oblong face shape.",
            maintenanceLevel: "Medium to High",
            imageUrl: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=1780&auto=format&fit=crop"
          }
        ]
      }
    }
  };

  // Get suggestions based on face shape
  const faceSuggestions = suggestions[faceShape as keyof typeof suggestions] || suggestions.oval;
  
  // Get haircuts based on hair length
  const haircuts = faceSuggestions.haircuts[hairLength as keyof typeof faceSuggestions.haircuts] || 
                  faceSuggestions.haircuts.medium;
  
  // Adjust suggestions based on hair type
  const adjustedHaircuts = haircuts.map(haircut => {
    let adjustedHaircut = { ...haircut };
    
    // Add hair type specific advice
    if (hairType === "curly") {
      adjustedHaircut.description += " Works well with your natural curls.";
    } else if (hairType === "wavy") {
      adjustedHaircut.description += " Complements your natural waves.";
    } else if (hairType === "coily") {
      adjustedHaircut.description += " Embraces your natural texture.";
    }
    
    return adjustedHaircut;
  });

  return {
    faceShapeDescription: faceSuggestions.description,
    haircuts: adjustedHaircuts
  };
}