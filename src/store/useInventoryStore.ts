import { create } from 'zustand';
import { InventoryItem, StockStats } from '../types';

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

// Load initial data from localStorage if available
const loadInitialState = (): { items: InventoryItem[] } => {
  try {
    const storedItems = localStorage.getItem('inventory');
    return { 
      items: storedItems ? JSON.parse(storedItems) : [] 
    };
  } catch (error) {
    console.error('Failed to load inventory from localStorage:', error);
    return { items: [] };
  }
};

const initialState = loadInitialState();

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: initialState.items,
  isLoading: false,
  error: null,
  stats: calculateInventoryStats(initialState.items),

  addItem: (item: InventoryItem) => {
    set(state => {
      const newItems = [...state.items, item];
      // Save to localStorage
      localStorage.setItem('inventory', JSON.stringify(newItems));
      return { 
        items: newItems,
        stats: calculateInventoryStats(newItems)
      };
    });
  },

  updateItem: (id: string, updates: Partial<InventoryItem>) => {
    set(state => {
      const newItems = state.items.map(item => 
        item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
      );
      // Save to localStorage
      localStorage.setItem('inventory', JSON.stringify(newItems));
      return { 
        items: newItems,
        stats: calculateInventoryStats(newItems)
      };
    });
  },

  removeItem: (id: string) => {
    set(state => {
      const newItems = state.items.filter(item => item.id !== id);
      // Save to localStorage
      localStorage.setItem('inventory', JSON.stringify(newItems));
      return { 
        items: newItems,
        stats: calculateInventoryStats(newItems)
      };
    });
  },

  updateQuantity: (id: string, change: number) => {
    set(state => {
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
      // Save to localStorage
      localStorage.setItem('inventory', JSON.stringify(newItems));
      return { 
        items: newItems,
        stats: calculateInventoryStats(newItems)
      };
    });
  },

  getItemByBarcode: (barcode: string) => {
    return get().items.find(item => item.barcode === barcode);
  },

  calculateStats: () => {
    set(state => ({
      stats: calculateInventoryStats(state.items)
    }));
  }
}));