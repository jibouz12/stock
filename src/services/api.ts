import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = 'https://world.openfoodfacts.org/api/v2';

export const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/${barcode}`);
    
    if (response.data.status === 1) {
      const productData = response.data.product;
      
      // Map the API response to our Product type
      const product: Product = {
        id: productData._id || barcode,
        code: barcode,
        name: productData.product_name || 'Unknown Product',
        brand: productData.brands || 'Unknown Brand',
        image_url: productData.image_url || '',
        quantity: productData.quantity || '',
        categories: productData.categories || '',
        nutriments: productData.nutriments || {},
        nutrient_levels: productData.nutrient_levels || {},
        ingredients_text: productData.ingredients_text || '',
        ingredients: productData.ingredients || [],
        allergens: productData.allergens || '',
        labels: productData.labels || '',
        stores: productData.stores || '',
      };
      
      return product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product data');
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // Try searching by brand first using brands_tags
    let response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        brands_tags: query.toLowerCase(),
        page_size: 24,
        json: true
      }
    });
    
    // If no results with brand search, fallback to general search
    if (!response.data.products || response.data.products.length === 0) {
      response = await axios.get(`${API_BASE_URL}/search`, {
        params: {
          search_terms: query,
          page_size: 24,
          json: true
        }
      });
    }
    
    if (response.data.products && Array.isArray(response.data.products)) {
      return response.data.products.map((item: any) => ({
        id: item._id || '',
        code: item.code || '',
        name: item.product_name || 'Unknown Product',
        brand: item.brands || 'Unknown Brand',
        image_url: item.image_url || '',
        quantity: item.quantity || '',
        categories: item.categories || '',
        nutriments: item.nutriments || {},
        nutrient_levels: item.nutrient_levels || {},
        ingredients_text: item.ingredients_text || '',
        ingredients: item.ingredients || [],
        allergens: item.allergens || '',
        labels: item.labels || '',
        stores: item.stores || '',
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};