import React, { useState } from 'react';
import BarcodeScanner from '../components/scanner/BarcodeScanner';
import ManualEntry from '../components/scanner/ManualEntry';
import { fetchProductByBarcode } from '../services/api';
import { Product } from '../types';
import ProductDetails from '../components/product/ProductDetails';
import ProductForm from '../components/product/ProductForm';
import { useInventoryStore } from '../store/useInventoryStore';
import { useToastStore } from '../store/useToastStore';
import { ScanLine, Search, Package, Loader2 } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const { getItemByBarcode } = useInventoryStore();
  const { addToast } = useToastStore();
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
        
        if (existing) {
          addToast({
            title: 'Product Found',
            description: `${productData.name} is already in your inventory`,
            type: 'info'
          });
        }
      } else {
        addToast({
          title: 'Product Not Found',
          description: 'No product information found for this barcode',
          type: 'error'
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch product data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleError = (error: string) => {
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Scan Product Barcode</h1>
        <p className="text-muted-foreground">
          Scan a product barcode to fetch information and add it to your inventory
        </p>
      </div>
      
      {!product && !loading && (
        <>
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ScanLine className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-medium">Barcode Scanner</h2>
            </div>
            <BarcodeScanner onScan={handleScan} onError={handleError} />
          </div>
          
          <div className="text-center my-6">
            <p className="text-muted-foreground">Or</p>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-center gap-3 mb-2 pt-6 px-6">
              <Search className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-medium">Manual Entry</h2>
            </div>
            <ManualEntry onSubmit={handleScan} />
          </div>
        </>
      )}
      
      {loading && (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-medium mb-2">Fetching Product Information</h2>
          <p className="text-muted-foreground">
            Looking up product details in the database...
          </p>
        </div>
      )}
      
      {product && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {existingItem ? 'Product Already in Inventory' : 'Product Found'}
            </h2>
            <button 
              onClick={handleReset}
              className="btn btn-outline"
            >
              Scan Another
            </button>
          </div>
          
          <div className="card p-6">
            {existingItem ? (
              // Show product form in edit mode for existing items
              <ProductForm 
                product={product} 
                existingItem={existingItem} 
                isEdit={true} 
              />
            ) : (
              // Show product form in add mode for new items
              <ProductForm product={product} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;