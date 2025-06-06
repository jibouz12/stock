import React from 'react';
import { Link } from 'react-router-dom';
import { useInventoryStore } from '../store/useInventoryStore';
import InventoryStats from '../components/inventory/InventoryStats';
import { ScanLine, Package, Plus, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  const { items, stats } = useInventoryStore();
  
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">StockScan Inventory Manager</h1>
        <p className="text-xl text-muted-foreground">
          Scan barcodes, track inventory, and manage your stock with ease
        </p>
      </div>
      
      {items.length > 0 ? (
        <>
          <InventoryStats />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link 
              to="/scan" 
              className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <ScanLine className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Scan Products</h3>
              <p className="text-muted-foreground">
                Scan product barcodes to quickly find and add items to your inventory
              </p>
            </Link>
            
            <Link 
              to="/inventory" 
              className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <Package className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-medium mb-2">Manage Inventory</h3>
              <p className="text-muted-foreground">
                View your complete inventory, adjust quantities, and update product details
              </p>
            </Link>
            
            <Link 
              to="/add-product" 
              className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="bg-success/10 p-4 rounded-full mb-4">
                <Plus className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-medium mb-2">Add Products</h3>
              <p className="text-muted-foreground">
                Manually add products by searching or entering barcode information
              </p>
            </Link>
          </div>
          
          {stats.lowStock > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-warning" />
                <h3 className="text-xl font-medium">Low Stock Alert</h3>
              </div>
              <p className="mb-4">
                You have <strong>{stats.lowStock}</strong> item{stats.lowStock !== 1 ? 's' : ''} with low stock levels.
              </p>
              <Link to="/inventory" className="btn btn-warning">
                View Low Stock Items
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="card p-8 text-center max-w-2xl mx-auto animate-fade-in">
          <div className="bg-primary/10 p-6 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Your inventory is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start by scanning product barcodes or manually adding products to your inventory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scan" className="btn btn-primary btn-lg">
              <ScanLine className="w-5 h-5 mr-2" />
              Scan Products
            </Link>
            <Link to="/add-product" className="btn btn-outline btn-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Manually
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;