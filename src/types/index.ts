export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  image_url: string;
  quantity: string;
  categories: string;
  nutriments: {
    [key: string]: number | string;
  };
  nutrient_levels: {
    [key: string]: string;
  };
  ingredients_text: string;
  ingredients: Ingredient[];
  allergens: string;
  labels: string;
  stores: string;
}

export interface Ingredient {
  id: string;
  text: string;
  percent?: number;
}

export interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  image_url: string;
  quantity: string;
  categories: string;
  stockQuantity: number;
  minStockLevel: number;
  expiryDate?: string;
  location?: string;
  dateAdded: string;
  lastUpdated: string;
  notes?: string;
}

export interface StockStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
  categories: {
    [key: string]: number;
  };
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export type ScannerStatus = 'idle' | 'scanning' | 'success' | 'error';