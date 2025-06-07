import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useHaptics } from '../../hooks/useHaptics';
import { 
  Barcode, 
  Home, 
  Package, 
  ScanLine, 
  Plus, 
  Menu, 
  X,
  ChevronLeft 
} from 'lucide-react';

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { triggerSelection } = useHaptics();
  const isNative = Capacitor.isNativePlatform();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMenu = async () => {
    await triggerSelection();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = async () => {
    await triggerSelection();
    setIsMenuOpen(false);
  };

  const canGoBack = location.pathname !== '/';

  return (
    <>
      <header className={`bg-primary text-white shadow-md ${isNative ? 'pt-safe-top' : ''}`}>
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {canGoBack && (
                <button
                  onClick={() => window.history.back()}
                  className="p-2 mr-2 rounded-full hover:bg-primary-light"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <Link to="/" className="flex items-center space-x-2" onClick={handleNavClick}>
                <Barcode className="w-6 h-6" />
                <span className="font-bold text-xl">StockScan</span>
              </Link>
            </div>
            
            <button 
              className="p-2 rounded-full hover:bg-primary-light focus:outline-none" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={toggleMenu}>
          <div 
            className="absolute top-0 right-0 w-80 max-w-[80vw] h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-4 bg-primary text-white ${isNative ? 'pt-safe-top' : ''}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-primary-light">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                <MobileNavLink to="/" active={isActive('/')} onClick={handleNavClick}>
                  <Home className="w-6 h-6 mr-4" />
                  <span className="text-lg">Home</span>
                </MobileNavLink>
                
                <MobileNavLink to="/scan" active={isActive('/scan')} onClick={handleNavClick}>
                  <ScanLine className="w-6 h-6 mr-4" />
                  <span className="text-lg">Scan Barcode</span>
                </MobileNavLink>
                
                <MobileNavLink to="/inventory" active={isActive('/inventory')} onClick={handleNavClick}>
                  <Package className="w-6 h-6 mr-4" />
                  <span className="text-lg">Inventory</span>
                </MobileNavLink>
                
                <MobileNavLink to="/add-product" active={isActive('/add-product')} onClick={handleNavClick}>
                  <Plus className="w-6 h-6 mr-4" />
                  <span className="text-lg">Add Product</span>
                </MobileNavLink>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

interface MobileNavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, active, children, onClick }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-4 rounded-lg text-base font-medium transition-colors ${
      active 
        ? 'bg-primary text-white' 
        : 'hover:bg-muted text-foreground'
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default MobileNavbar;