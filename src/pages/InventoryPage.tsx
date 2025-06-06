import React from 'react';
import { Link } from 'react-router-dom';
import { useInventoryStore } from '../store/useInventoryStore';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryList from '../components/inventory/InventoryList';
import { Package, Plus } from 'lucide-react';

const InventoryPage: React.FC = () => {
  const { items } = useInventoryStore();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Link to="/add-product" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>
      
      {items.length > 0 ? (
        <>
          <InventoryStats />
          <InventoryList />
        </>
      ) : (
        <div className="card p-8 text-center max-w-2xl mx-auto animate-fade-in">
          <div className="bg-muted p-6 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/70" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Your inventory is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start by scanning product barcodes or manually adding products to your inventory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scan" className="btn btn-primary btn-lg">
              Scan Products
            </Link>
            <Link to="/add-product" className="btn btn-outline btn-lg">
              Add Manually
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;