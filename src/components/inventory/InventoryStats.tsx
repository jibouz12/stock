import React from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { Package, AlertTriangle, ShoppingCart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryStats: React.FC = () => {
  const { stats } = useInventoryStore();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link to="/inventory" className="card p-4 flex items-center hover:shadow-md transition-shadow cursor-pointer">
        <div className="bg-primary/10 p-3 rounded-full mr-4">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Items</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
      </Link>
      
      <Link to="/inventory?filter=low" className="card p-4 flex items-center hover:shadow-md transition-shadow cursor-pointer">
        <div className="bg-warning/10 p-3 rounded-full mr-4">
          <AlertTriangle className="w-6 h-6 text-warning" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Low Stock</p>
          <p className="text-2xl font-bold">{stats.lowStock}</p>
        </div>
      </Link>
      
      <Link to="/inventory?filter=out" className="card p-4 flex items-center hover:shadow-md transition-shadow cursor-pointer">
        <div className="bg-error/10 p-3 rounded-full mr-4">
          <ShoppingCart className="w-6 h-6 text-error" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Out of Stock</p>
          <p className="text-2xl font-bold">{stats.outOfStock}</p>
        </div>
      </Link>
      
      <Link to="/inventory?filter=expiring" className="card p-4 flex items-center hover:shadow-md transition-shadow cursor-pointer">
        <div className="bg-orange-500/10 p-3 rounded-full mr-4">
          <Calendar className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">DLC less 5 jours</p>
          <p className="text-2xl font-bold">{stats.expiringSoon}</p>
        </div>
      </Link>
    </div>
  );
};

export default InventoryStats;