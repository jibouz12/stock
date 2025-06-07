import React, { useState } from 'react';
import NativeBarcodeScanner from '../components/scanner/NativeBarcodeScanner';
import ManualEntry from '../components/scanner/ManualEntry';
import { fetchProductByBarcode } from '../services/api';
import { Product } from '../types';
import ProductForm from '../components/product/ProductForm';
import { useInventoryStore } from '../store/useInventoryStore';
import { useToastStore } from '../store/useToastStore';
import { useHaptics } from '../hooks/useHaptics';
import { ScanLine, Search, Loader2 } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const { getItemByBarcode } = useInventoryStore();
  const { addToast } = useToastStore();
  const { triggerNotification } = useHaptics();
  const [existingItem, setExistingItem] = useState<ReturnType<typeof getItemByBarcode>>(undefined);
  
  const handleScan = async (barcode: string) => {
    setLoading(true);
    
    try {
      // Check if already in inventory
      const existing = getItemByBarcode(barcode);
      setExistingItem(existing);
      
      // Fetch product data
      const productData = await fetchProductByBarcode(barcode);
      
      if (productData) {
        setProduct(productData);
        await triggerNotification('success');
        
        if (existing) {
          addToast({
            title: 'Product Found',
            description: `${productData.name} is already in your inventory`,
            type: 'info'
          });
        }
      } else {
        await triggerNotification('error');
        addToast({
          title: 'Product Not Found',
          description: 'No product information found for this barcode',
          type: 'error'
        });
      }
    } catch (error) {
      await triggerNotification('error');
      addToast({
        title: 'Error',
        description: 'Failed to fetch product data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleError = async (error: string) => {
    await triggerNotification('error');
    addToast({
      title: 'Scanner Error',
      description: error,
      type: 'error'
    });
  };
  
  // Reset the state
  const handleReset = () => {
    setProduct(null);
    setExistingItem(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Scan Product Barcode</h1>
        <p className="text-muted-foreground text-sm">
          Scan a product barcode to fetch information and add it to your inventory
        </p>
      </div>
      
      {!product && !loading && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ScanLine className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">Barcode Scanner</h2>
            </div>
            <NativeBarcodeScanner onScan={handleScan} onError={handleError} />
          </div>
          
          <div className="text-center my-4">
            <p className="text-muted-foreground text-sm">Or</p>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-center gap-2 mb-2 pt-4 px-4">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">Manual Entry</h2>
            </div>
            <ManualEntry onSubmit={handleScan} />
          </div>
        </>
      )}
      
      {loading && (
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 className="text-lg font-medium mb-2">Fetching Product Information</h2>
          <p className="text-muted-foreground text-sm">
            Looking up product details in the database...
          </p>
        </div>
      )}
      
      {product && !loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {existingItem ? 'Product Already in Inventory' : 'Product Found'}
            </h2>
            <button 
              onClick={handleReset}
              className="btn btn-outline btn-sm"
            >
              Scan Another
            </button>
          </div>
          
          <div className="card p-4">
            <ProductForm 
              product={product} 
              existingItem={existingItem} 
              isEdit={!!existingItem} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;