import { File } from 'expo-file-system';
import { Platform } from 'react-native';

export async function convertImageToBase64(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    if (uri.startsWith('data:')) {
      return uri.split(',')[1];
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL.split(',')[1]);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = uri;
    });
  }
  
  try {
    const file = new File(uri);
    const base64 = await file.base64();
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
}

export function removeBase64Prefix(base64String: string): string {
  return base64String.replace(/^data:image\/\w+;base64,/, '');
}
