import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Barcode, Home, Package, ScanLine, Plus, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Barcode className="w-6 h-6" />
            <span className="font-bold text-xl">StockScan</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" active={isActive('/')}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </NavLink>
            
            <NavLink to="/scan" active={isActive('/scan')}>
              <ScanLine className="w-4 h-4 mr-2" />
              Scan
            </NavLink>
            
            <NavLink to="/inventory" active={isActive('/inventory')}>
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </NavLink>
            
            <NavLink to="/add-product" active={isActive('/add-product')}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </NavLink>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none" 
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
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-primary-dark py-2 px-4 animate-fade-in">
          <div className="flex flex-col space-y-1">
            <MobileNavLink to="/" active={isActive('/')} onClick={toggleMenu}>
              <Home className="w-5 h-5 mr-3" />
              Home
            </MobileNavLink>
            
            <MobileNavLink to="/scan" active={isActive('/scan')} onClick={toggleMenu}>
              <ScanLine className="w-5 h-5 mr-3" />
              Scan Barcode
            </MobileNavLink>
            
            <MobileNavLink to="/inventory" active={isActive('/inventory')} onClick={toggleMenu}>
              <Package className="w-5 h-5 mr-3" />
              Inventory
            </MobileNavLink>
            
            <MobileNavLink to="/add-product" active={isActive('/add-product')} onClick={toggleMenu}>
              <Plus className="w-5 h-5 mr-3" />
              Add Product
            </MobileNavLink>
          </div>
        </nav>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-primary-dark' 
        : 'hover:bg-primary-light'
    }`}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, active, children, onClick }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
      active 
        ? 'bg-primary-light' 
        : 'hover:bg-primary-light/50'
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;