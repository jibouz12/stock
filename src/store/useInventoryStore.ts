import { create } from 'zustand';
import { InventoryItem, StockStats } from '../types';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  stats: StockStats;
  
  // Actions
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  getItemByBarcode: (barcode: string) => InventoryItem | undefined;
  calculateStats: () => void;
  loadFromStorage: () => Promise<void>;
}

// Helper function to calculate inventory statistics
const calculateInventoryStats = (items: InventoryItem[]): StockStats => {
  const stats: StockStats = {
    total: items.length,
    lowStock: 0,
    outOfStock: 0,
    expiringSoon: 0,
    categories: {}
  };

  const today = new Date();
  const fiveDaysFromNow = new Date();
  fiveDaysFromNow.setDate(today.getDate() + 5);

  items.forEach(item => {
    // Count low stock items
    if (item.stockQuantity <= item.minStockLevel && item.stockQuantity > 0) {
      stats.lowStock++;
    }
    
    // Count out of stock items
    if (item.stockQuantity === 0) {
      stats.outOfStock++;
    }
    
    // Count items expiring soon (within 5 days)
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      if (expiryDate <= fiveDaysFromNow && expiryDate >= today) {
        stats.expiringSoon++;
      }
    }
    
    // Count by category
    if (item.categories) {
      const categories = item.categories.split(',').map(c => c.trim());
      categories.forEach(category => {
        if (category) {
          stats.categories[category] = (stats.categories[category] || 0) + 1;
        }
      });
    }
  });

  return stats;
};

// Storage functions
const saveToStorage = async (items: InventoryItem[]) => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: 'inventory',
        value: JSON.stringify(items)
      });
    } else {
      localStorage.setItem('inventory', JSON.stringify(items));
    }
  } catch (error) {
    console.error('Failed to save inventory to storage:', error);
  }
};

const loadFromStorage = async (): Promise<InventoryItem[]> => {
  try {
    if (Capacitor.isNativePlatform()) {
      const result = await Preferences.get({ key: 'inventory' });
      return result.value ? JSON.parse(result.value) : [];
    } else {
      const stored = localStorage.getItem('inventory');
      return stored ? JSON.parse(stored) : [];
    }
  } catch (error) {
    console.error('Failed to load inventory from storage:', error);
    return [];
  }
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  stats: { total: 0, lowStock: 0, outOfStock: 0, expiringSoon: 0, categories: {} },

  loadFromStorage: async () => {
    set({ isLoading: true });
    try {
      const items = await loadFromStorage();
      set({ 
        items,
        stats: calculateInventoryStats(items),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to load inventory',
        isLoading: false 
      });
    }
  },

  addItem: async (item: InventoryItem) => {
    const state = get();
    const newItems = [...state.items, item];
    await saveToStorage(newItems);
    set({ 
      items: newItems,
      stats: calculateInventoryStats(newItems)
    });
  },

  updateItem: async (id: string, updates: Partial<InventoryItem>) => {
    const state = get();
    const newItems = state.items.map(item => 
      item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
    );
    await saveToStorage(newItems);
    set({ 
      items: newItems,
      stats: calculateInventoryStats(newItems)
    });
  },

  removeItem: async (id: string) => {
    const state = get();
    const newItems = state.items.filter(item => item.id !== id);
    await saveToStorage(newItems);
    set({ 
      items: newItems,
      stats: calculateInventoryStats(newItems)
    });
  },

  updateQuantity: async (id: string, change: number) => {
    const state = get();
    const newItems = state.items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.stockQuantity + change);
        return { 
          ...item, 
          stockQuantity: newQuantity,
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    });
    await saveToStorage(newItems);
    set({ 
      items: newItems,
      stats: calculateInventoryStats(newItems)
    });
  },

  getItemByBarcode: (barcode: string) => {
    return get().items.find(item => item.barcode === barcode);
  },

  calculateStats: () => {
    const state = get();
    set({
      stats: calculateInventoryStats(state.items)
    });
  }
}));