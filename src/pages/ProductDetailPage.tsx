import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductByBarcode } from '../services/api';
import { useInventoryStore } from '../store/useInventoryStore';
import { useToastStore } from '../store/useToastStore';
import ProductForm from '../components/product/ProductForm';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const navigate = useNavigate();
  const { getItemByBarcode, removeItem } = useInventoryStore();
  const { addToast } = useToastStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!barcode) {
        setError('No barcode provided');
        setLoading(false);
        return;
      }
      
      // Check if product is in inventory
      const inventoryItem = getItemByBarcode(barcode);
      
      if (!inventoryItem) {
        setError('Product not found in inventory');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch fresh product data from API
        const productData = await fetchProductByBarcode(barcode);
        
        if (productData) {
          setProduct(productData);
        } else {
          // If API doesn't have the product, create a minimal product object from inventory data
          setProduct({
            id: inventoryItem.id,
            code: inventoryItem.barcode,
            name: inventoryItem.name,
            brand: inventoryItem.brand,
            image_url: inventoryItem.image_url,
            quantity: inventoryItem.quantity,
            categories: inventoryItem.categories,
            nutriments: {},
            nutrient_levels: {},
            ingredients_text: '',
            ingredients: [],
            allergens: '',
            labels: '',
            stores: '',
          });
        }
      } catch (err) {
        console.error('Error fetching product data:', err);
        // Still create a minimal product object from inventory data if API fails
        setProduct({
          id: inventoryItem.id,
          code: inventoryItem.barcode,
          name: inventoryItem.name,
          brand: inventoryItem.brand,
          image_url: inventoryItem.image_url,
          quantity: inventoryItem.quantity,
          categories: inventoryItem.categories,
          nutriments: {},
          nutrient_levels: {},
          ingredients_text: '',
          ingredients: [],
          allergens: '',
          labels: '',
          stores: '',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [barcode, getItemByBarcode]);
  
  const handleDelete = () => {
    if (!barcode) return;
    
    const inventoryItem = getItemByBarcode(barcode);
    
    if (!inventoryItem) {
      addToast({
        title: 'Error',
        description: 'Product not found in inventory',
        type: 'error'
      });
      return;
    }
    
    if (confirm('Are you sure you want to remove this item from inventory?')) {
      removeItem(inventoryItem.id);
      
      addToast({
        title: 'Item Removed',
        description: `${inventoryItem.name} has been removed from inventory`,
        type: 'info'
      });
      
      navigate('/inventory');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        
        <button
          onClick={handleDelete}
          className="btn btn-ghost text-error"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Item
        </button>
      </div>
      
      {loading && (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-medium mb-2">Loading Product</h2>
          <p className="text-muted-foreground">
            Fetching product details...
          </p>
        </div>
      )}
      
      {error && !loading && (
        <div className="card p-8 text-center">
          <h2 className="text-xl font-medium text-error mb-4">{error}</h2>
          <p className="mb-6">
            The product you're looking for was not found in your inventory.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/inventory')}
              className="btn btn-primary"
            >
              Go to Inventory
            </button>
            <button
              onClick={() => navigate('/scan')}
              className="btn btn-outline"
            >
              Scan Products
            </button>
          </div>
        </div>
      )}
      
      {product && !loading && barcode && (
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Inventory Item</h2>
          <ProductForm 
            product={product} 
            existingItem={getItemByBarcode(barcode)} 
            isEdit={true} 
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;