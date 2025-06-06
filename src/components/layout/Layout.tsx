import React from 'react';
import Navbar from './Navbar';
import { Barcode, PackageSearch } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center mb-2">
            <Barcode className="w-5 h-5 mr-2" />
            <span className="font-medium">StockScan</span>
          </div>
          <p>A barcode scanning inventory management system</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;