'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price_cents: number;
  quantity: number;
  category: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        let newItems;
        if (existingItem) {
          newItems = items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...items, {
            id: product.id,
            name: product.name,
            price_cents: product.price_cents,
            quantity: 1,
            category: product.category
          }];
        }
        
        const total = newItems.reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ items: newItems, total, itemCount });
      },
      
      removeItem: (id) => {
        const items = get().items.filter(item => item.id !== id);
        const total = items.reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ items, total, itemCount });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity === 0) {
          get().removeItem(id);
          return;
        }
        
        const items = get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        const total = items.reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ items, total, itemCount });
      },
      
      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      }
    }),
    {
      name: 'instyle-cart',
    }
  )
);
