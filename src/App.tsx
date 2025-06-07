import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCapacitor } from './hooks/useCapacitor';
import { useInventoryStore } from './store/useInventoryStore';
import MobileLayout from './components/layout/MobileLayout';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import InventoryPage from './pages/InventoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import NotFoundPage from './pages/NotFoundPage';
import { NativeToaster } from './components/ui/NativeToast';
import { Loader2 } from 'lucide-react';

function App() {
  const { isNative, isReady } = useCapacitor();
  const { loadFromStorage, isLoading } = useInventoryStore();

  useEffect(() => {
    if (isReady) {
      loadFromStorage();
    }
  }, [isReady, loadFromStorage]);

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Loading StockScan</h2>
          <p className="text-muted-foreground">
            {isNative ? 'Initializing mobile app...' : 'Loading application...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/product/:barcode" element={<ProductDetailPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MobileLayout>
      <NativeToaster />
    </Router>
  );
}

export default App;