import React from 'react';
import { Capacitor } from '@capacitor/core';
import MobileNavbar from './MobileNavbar';
import { Barcode } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const isNative = Capacitor.isNativePlatform();

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isNative ? 'pt-safe-top pb-safe-bottom' : ''}`}>
      <MobileNavbar />
      
      <main className="flex-1 px-4 py-6 overflow-auto">
        {children}
      </main>
      
      {!isNative && (
        <footer className="bg-muted py-4 px-4">
          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center mb-1">
              <Barcode className="w-4 h-4 mr-2" />
              <span className="font-medium">StockScan Mobile</span>
            </div>
            <p>Barcode inventory management</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MobileLayout;