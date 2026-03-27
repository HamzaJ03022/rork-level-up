import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { analyzeImageWithVision } from "@/backend/services/openai";

export default protectedProcedure
  .input(z.object({ 
    photoUri: z.string(),
    faceShape: z.string().optional(),
    currentBeardStyle: z.string().optional(),
    beardDensity: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log('[Beard Analysis] Starting analysis...');
    
    const prompt = `Analyze this person's facial hair and provide beard style recommendations.
    
    Please analyze:
    1. Face shape (oval, round, square, heart, diamond, or oblong)
    2. Beard density (patchy, medium, full, or thick)
    3. Current beard style (clean-shaven, stubble, short-beard, medium-beard, full-beard, or goatee)
    
    Based on your analysis, respond with ONLY a JSON object (no markdown, no code blocks) in this exact format:
    {
      "faceShape": "detected face shape",
      "beardDensity": "detected beard density",
      "currentStyle": "detected current style",
      "explanation": "Brief explanation of why these characteristics were identified"
    }`;

    try {
      const aiResponse = await analyzeImageWithVision({
        imageUrl: input.photoUri,
        prompt,
      });

      console.log('[Beard Analysis] AI response:', aiResponse.content);
      
      const cleanedResponse = aiResponse.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(cleanedResponse);
      
      const detectedFaceShape = input.faceShape || analysis.faceShape;
      const detectedBeardDensity = input.beardDensity || analysis.beardDensity;
      const detectedCurrentStyle = input.currentBeardStyle || analysis.currentStyle;

      const beardSuggestions = generateBeardSuggestions(detectedFaceShape, detectedBeardDensity, detectedCurrentStyle);

      console.log('[Beard Analysis] Analysis complete');

      return {
        faceShape: detectedFaceShape,
        beardDensity: detectedBeardDensity,
        currentStyle: detectedCurrentStyle,
        suggestions: beardSuggestions,
        aiExplanation: analysis.explanation,
        analysisDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('[Beard Analysis] Error:', error);
      throw new Error('Failed to analyze beard photo. Please try again.');
    }
  });

// Helper function to generate beard style suggestions based on face shape and beard density
function generateBeardSuggestions(faceShape: string, beardDensity: string, currentStyle: string) {
  const suggestions = {
    oval: {
      description: "Oval face shapes are versatile and can pull off almost any beard style.",
      beardStyles: {
        patchy: [
          {
            name: "Light Stubble",
            description: "A short, even stubble that's about 1-2mm in length.",
            suitability: "Perfect for patchy growth as it disguises uneven areas while maintaining a clean look.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Goatee",
            description: "Focused facial hair on the chin and mustache, with clean-shaven cheeks.",
            suitability: "Great for patchy cheek growth, as it focuses on areas where growth is typically stronger.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Van Dyke",
            description: "A goatee with a disconnected mustache and soul patch.",
            suitability: "Works well with your oval face shape and patchy growth pattern.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Short Boxed Beard",
            description: "A full beard kept short (around 1cm) with clean, defined edges.",
            suitability: "Perfect for your oval face shape with medium density growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          },
          {
            name: "Corporate Beard",
            description: "A neat, trimmed beard (1-2cm) that follows the jawline with clean edges.",
            suitability: "Complements your oval face shape while maintaining a professional look.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Balbo Beard",
            description: "A shaped beard without sideburns, featuring a connected mustache and soul patch.",
            suitability: "Works well with your oval face shape and medium density.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1770&auto=format&fit=crop"
          }
        ],
        full: [
          {
            name: "Full Beard",
            description: "A complete beard with natural growth, typically 2-5cm in length.",
            suitability: "Perfect for your oval face shape and full beard density.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Garibaldi Beard",
            description: "A wide, full beard with a rounded bottom and integrated mustache.",
            suitability: "Complements your oval face shape with your full beard growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Ducktail Beard",
            description: "A full beard that's shorter on the sides and longer/pointed at the chin.",
            suitability: "Works well with your oval face shape and full beard density.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          }
        ],
        thick: [
          {
            name: "Bandholz Beard",
            description: "A full, natural beard with substantial length and volume.",
            suitability: "Perfect for your oval face shape and thick beard growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "Verdi Beard",
            description: "A short/medium rounded beard with a styled mustache.",
            suitability: "Complements your oval face shape with your thick beard growth.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Yeard",
            description: "A beard that's been grown for a full year with minimal trimming.",
            suitability: "Works well with your oval face shape and thick beard density.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          }
        ]
      }
    },
    round: {
      description: "Round face shapes benefit from beard styles that add length and definition to create more angles.",
      beardStyles: {
        patchy: [
          {
            name: "Goatee with Soul Patch",
            description: "Focused facial hair on the chin and mustache with a soul patch.",
            suitability: "Adds length to your round face shape while working with patchy growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Chin Strap",
            description: "A thin line of facial hair that follows the jawline.",
            suitability: "Defines your jawline, adding structure to your round face shape.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Extended Goatee",
            description: "A goatee that extends partially along the jawline.",
            suitability: "Adds definition to your round face shape while working with patchy growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Pointed Beard",
            description: "A beard that's shaped to come to a subtle point at the chin.",
            suitability: "Adds length to your round face shape, creating a more oval appearance.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1770&auto=format&fit=crop"
          },
          {
            name: "Hollywoodian",
            description: "A beard without sideburns that extends along the jawline.",
            suitability: "Defines your jawline while adding length to your round face shape.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Short Boxed Beard with Length",
            description: "A boxed beard with slightly more length at the chin.",
            suitability: "Adds structure and length to your round face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          }
        ],
        full: [
          {
            name: "Ducktail Beard",
            description: "A full beard that's shorter on the sides and longer/pointed at the chin.",
            suitability: "Perfect for your round face shape as it adds length and definition.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "Extended Goatee with Full Beard",
            description: "A full beard that's longer at the chin and shorter on the sides.",
            suitability: "Adds length to your round face shape while maintaining fullness.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Anchor Beard",
            description: "A pointed beard with a floating mustache that resembles a ship's anchor.",
            suitability: "Creates angles that complement your round face shape.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1770&auto=format&fit=crop"
          }
        ],
        thick: [
          {
            name: "Ducktail Beard",
            description: "A full beard that's shorter on the sides and longer/pointed at the chin.",
            suitability: "Perfect for your round face shape and thick beard growth, adding length and definition.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "French Fork",
            description: "A full beard with the bottom split into two sections.",
            suitability: "Adds length and a unique style that complements your round face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Pointed Full Beard",
            description: "A full beard shaped to come to a defined point at the chin.",
            suitability: "Adds significant length to balance your round face shape.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          }
        ]
      }
    },
    square: {
      description: "Square face shapes have strong jawlines and benefit from beard styles that maintain this masculine feature while softening angles slightly.",
      beardStyles: {
        patchy: [
          {
            name: "Light Stubble",
            description: "A short, even stubble that's about 1-2mm in length.",
            suitability: "Enhances your strong jawline while working with patchy growth.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Circle Beard",
            description: "A connected mustache and goatee that forms a circle around the mouth.",
            suitability: "Adds a focal point while complementing your square face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Mustache",
            description: "A standalone mustache without other facial hair.",
            suitability: "Draws attention away from patchy areas while complementing your square face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Corporate Beard",
            description: "A neat, trimmed beard (1-2cm) that follows the jawline with clean edges.",
            suitability: "Maintains your strong jawline while adding sophistication.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Beardstache",
            description: "A prominent mustache with very short beard stubble.",
            suitability: "Softens your square jawline while creating a stylish focal point.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          },
          {
            name: "Short Rounded Beard",
            description: "A short beard with slightly rounded edges rather than sharp lines.",
            suitability: "Softens the angles of your square face shape while maintaining structure.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1770&auto=format&fit=crop"
          }
        ],
        full: [
          {
            name: "Full Beard with Rounded Bottom",
            description: "A complete beard with a rounded shape at the bottom.",
            suitability: "Maintains your strong jawline while softening the angles slightly.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Garibaldi Beard",
            description: "A wide, full beard with a rounded bottom and integrated mustache.",
            suitability: "Complements your square face shape while softening the angles.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Corporate Beard with Length",
            description: "A neat beard with slightly more length than a standard corporate beard.",
            suitability: "Enhances your square face shape while maintaining a professional look.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        thick: [
          {
            name: "Full Natural Beard",
            description: "A full beard with natural growth and minimal shaping.",
            suitability: "Enhances your square face shape while showcasing your thick beard growth.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Garibaldi with Styled Mustache",
            description: "A Garibaldi beard with extra attention to styling the mustache.",
            suitability: "Complements your square face shape while adding sophistication.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Verdi Beard",
            description: "A short/medium rounded beard with a styled mustache.",
            suitability: "Softens the angles of your square face while maintaining masculinity.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          }
        ]
      }
    },
    heart: {
      description: "Heart face shapes have wider foreheads and narrower chins, benefiting from beard styles that add width to the lower face.",
      beardStyles: {
        patchy: [
          {
            name: "Chin Strap with Goatee",
            description: "A thin line of facial hair along the jawline with a goatee.",
            suitability: "Adds width to your jawline, balancing your heart-shaped face.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Extended Goatee",
            description: "A goatee that extends partially along the jawline.",
            suitability: "Adds width to your chin area, balancing your heart-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Mustache with Soul Patch",
            description: "A mustache connected to a small patch of hair below the lower lip.",
            suitability: "Draws attention to the center of your face while working with patchy growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Balbo Beard",
            description: "A shaped beard without sideburns, featuring a connected mustache and soul patch.",
            suitability: "Adds width to your chin area, balancing your heart-shaped face.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1770&auto=format&fit=crop"
          },
          {
            name: "Short Boxed Beard",
            description: "A full beard kept short with clean, defined edges.",
            suitability: "Adds structure to your lower face, balancing your heart-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          },
          {
            name: "Hollywoodian",
            description: "A beard without sideburns that extends along the jawline.",
            suitability: "Adds width to your jawline, balancing your heart-shaped face.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        full: [
          {
            name: "Full Beard with Square Bottom",
            description: "A complete beard with a squared shape at the bottom.",
            suitability: "Adds significant width to your chin area, perfectly balancing your heart-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Garibaldi Beard",
            description: "A wide, full beard with a rounded bottom and integrated mustache.",
            suitability: "Adds width to your lower face, balancing your heart-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Full Beard with Faded Sideburns",
            description: "A full beard with sideburns that gradually fade into the hair.",
            suitability: "Creates a balanced look for your heart-shaped face.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          }
        ],
        thick: [
          {
            name: "Full Natural Beard",
            description: "A full beard with natural growth and minimal shaping.",
            suitability: "Adds significant width to your lower face, perfectly balancing your heart-shaped face.",
            maintenanceLevel: "Low",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Garibaldi with Wide Bottom",
            description: "A Garibaldi beard with extra width at the bottom.",
            suitability: "Perfectly balances your heart-shaped face with your thick beard growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Bandholz Beard",
            description: "A full, natural beard with substantial length and volume.",
            suitability: "Adds significant width to your lower face, creating perfect balance.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          }
        ]
      }
    },
    diamond: {
      description: "Diamond face shapes have narrow foreheads and jawlines with wider cheekbones, benefiting from beard styles that add width to the jawline.",
      beardStyles: {
        patchy: [
          {
            name: "Chin Strap",
            description: "A thin line of facial hair that follows the jawline.",
            suitability: "Defines and adds width to your jawline, balancing your diamond-shaped face.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Extended Goatee",
            description: "A goatee that extends partially along the jawline.",
            suitability: "Adds width to your chin area, balancing your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Light Stubble with Defined Edges",
            description: "A short stubble with clean, defined edges along the jawline.",
            suitability: "Adds subtle width to your jawline while working with patchy growth.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Boxed Beard",
            description: "A full beard with clean, straight lines at the cheeks and neck.",
            suitability: "Adds width to your jawline, balancing your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          },
          {
            name: "Hollywoodian",
            description: "A beard without sideburns that extends along the jawline.",
            suitability: "Adds width to your jawline while minimizing width at the cheekbones.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Corporate Beard",
            description: "A neat, trimmed beard that follows the jawline with clean edges.",
            suitability: "Adds structure to your jawline while maintaining a professional look.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        full: [
          {
            name: "Full Beard with Square Bottom",
            description: "A complete beard with a squared shape at the bottom.",
            suitability: "Adds significant width to your jawline, balancing your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Full Beard with Tapered Sides",
            description: "A full beard that's slightly shorter on the sides and fuller at the chin.",
            suitability: "Adds width to your jawline while minimizing width at the cheekbones.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "Garibaldi with Shorter Sides",
            description: "A Garibaldi beard with slightly shorter sides.",
            suitability: "Adds width to your jawline while complementing your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          }
        ],
        thick: [
          {
            name: "Full Beard with Squared Edges",
            description: "A full beard with defined, squared edges.",
            suitability: "Adds significant width to your jawline, perfectly balancing your diamond-shaped face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Bandholz with Tapered Sides",
            description: "A Bandholz beard with slightly tapered sides.",
            suitability: "Adds width to your jawline while minimizing width at the cheekbones.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          },
          {
            name: "Verdi with Squared Bottom",
            description: "A Verdi beard with a squared bottom rather than rounded.",
            suitability: "Adds structure to your jawline while showcasing your thick beard growth.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          }
        ]
      }
    },
    oblong: {
      description: "Oblong face shapes are longer than they are wide, benefiting from beard styles that add width and reduce the appearance of length.",
      beardStyles: {
        patchy: [
          {
            name: "Mutton Chops",
            description: "Sideburns that extend down the sides of the face, with a clean-shaven chin.",
            suitability: "Adds width to the sides of your face, reducing the appearance of length.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Chin Strap with Mustache",
            description: "A thin line of facial hair along the jawline with a mustache.",
            suitability: "Adds width to your jawline, balancing your oblong face shape.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          },
          {
            name: "Circle Beard",
            description: "A connected mustache and goatee that forms a circle around the mouth.",
            suitability: "Creates a focal point that distracts from your face length.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop"
          }
        ],
        medium: [
          {
            name: "Boxed Beard with Fullness",
            description: "A boxed beard with extra fullness at the sides.",
            suitability: "Adds width to your face, reducing the appearance of length.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          },
          {
            name: "Corporate Beard with Width",
            description: "A corporate beard styled for maximum width at the sides.",
            suitability: "Adds width to your face while maintaining a professional look.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Beardstache with Stubble",
            description: "A prominent mustache with light stubble on the cheeks and jawline.",
            suitability: "Creates width while breaking up the length of your face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          }
        ],
        full: [
          {
            name: "Full Beard with Extra Width",
            description: "A full beard styled for maximum width at the sides.",
            suitability: "Adds significant width to your face, perfectly balancing your oblong face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Garibaldi with Wide Bottom",
            description: "A Garibaldi beard with extra width at the bottom and sides.",
            suitability: "Adds width to your face, reducing the appearance of length.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Short Full Beard",
            description: "A full beard kept relatively short but with maximum coverage.",
            suitability: "Adds width without adding length to your face.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1936&auto=format&fit=crop"
          }
        ],
        thick: [
          {
            name: "Full Beard with Maximum Width",
            description: "A full beard styled for maximum width at the sides and cheeks.",
            suitability: "Adds significant width to your face, perfectly balancing your oblong face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Verdi with Wide Sides",
            description: "A Verdi beard with extra width at the sides.",
            suitability: "Adds width to your face while showcasing your thick beard growth.",
            maintenanceLevel: "High",
            imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop"
          },
          {
            name: "Garibaldi with Extended Sides",
            description: "A Garibaldi beard with extended growth at the sides.",
            suitability: "Creates maximum width to balance your oblong face shape.",
            maintenanceLevel: "Medium",
            imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop"
          }
        ]
      }
    }
  };

  // Get suggestions based on face shape
  const faceSuggestions = suggestions[faceShape as keyof typeof suggestions] || suggestions.oval;
  
  // Get beard styles based on beard density
  const beardStyles = faceSuggestions.beardStyles[beardDensity as keyof typeof faceSuggestions.beardStyles] || 
                     faceSuggestions.beardStyles.medium;
  
  // Adjust suggestions based on current style
  const adjustedStyles = beardStyles.map(style => {
    let adjustedStyle = { ...style };
    
    // Add current style specific advice
    if (currentStyle === "clean-shaven") {
      adjustedStyle.description += " Start by growing out your facial hair evenly for 1-2 weeks before shaping.";
    } else if (currentStyle === style.name.toLowerCase()) {
      adjustedStyle.description += " You're already rocking this style! Consider these refinements to perfect it.";
    }
    
    return adjustedStyle;
  });

  return {
    faceShapeDescription: faceSuggestions.description,
    beardStyles: adjustedStyles
  };
}