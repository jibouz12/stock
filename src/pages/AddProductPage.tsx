import React, { useState } from 'react';
import { searchProducts, fetchProductByBarcode } from '../services/api';
import { Product } from '../types';
import ProductForm from '../components/product/ProductForm';
import ManualEntry from '../components/scanner/ManualEntry';
import { useToastStore } from '../store/useToastStore';
import { Search, Barcode, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToast } = useToastStore();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      addToast({
        title: 'Error',
        description: 'Please enter a search term',
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const results = await searchProducts(searchTerm);
      setProducts(results);
      
      if (results.length === 0) {
        addToast({
          title: 'No Results',
          description: 'No products found for your search',
          type: 'info'
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to search products',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBarcodeSubmit = async (barcode: string) => {
    setLoading(true);
    
    try {
      const product = await fetchProductByBarcode(barcode);
      
      if (product) {
        setSelectedProduct(product);
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
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {selectedProduct ? (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="btn btn-ghost flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </button>
          </div>
          
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Add to Inventory</h2>
            <ProductForm product={selectedProduct} />
          </div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Add Products</h1>
            <p className="text-muted-foreground">
              Search for products or enter a barcode manually
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search Products
                </h2>
                <p className="card-description">
                  Find products by name, brand, or keywords
                </p>
              </div>
              
              <div className="card-content">
                <form onSubmit={handleSearch}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="e.g., organic milk, chocolate..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div>
              <ManualEntry onSubmit={handleBarcodeSubmit} />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Search Results</h2>
            <Link to="/scan" className="btn btn-outline btn-sm">
              <Barcode className="w-4 h-4 mr-2" />
              Scan Instead
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>Searching products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="h-40 bg-white flex items-center justify-center p-4">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="max-h-full object-contain"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-muted-foreground/40" />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-medium truncate">{product.name}</h3>
                    {product.quantity && (
                      <p className="text-sm text-muted-foreground mt-1">{product.quantity}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 
                "No products found. Try a different search term or enter a barcode." : 
                "Search for products or enter a barcode to get started."
              }
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddProductPage;