import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
  productId: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (productId, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.productId === productId);
        
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item.productId === productId 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        } else {
          return {
            items: [...state.items, { productId, quantity }]
          };
        }
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
      })),
      
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.productId === productId 
            ? { ...item, quantity }
            : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'level-up-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);