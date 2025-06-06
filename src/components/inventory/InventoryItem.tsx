import React from 'react';
import { InventoryItem } from '../../types';
import { Edit, Trash2, Plus, Minus, Package, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useToastStore } from '../../store/useToastStore';

interface InventoryItemCardProps {
  item: InventoryItem;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useInventoryStore();
  const { addToast } = useToastStore();

  const handleIncrement = () => {
    updateQuantity(item.id, 1);
    addToast({
      title: 'Quantity Updated',
      description: `Added 1 to ${item.name}`,
      type: 'success',
    });
  };

  const handleDecrement = () => {
    if (item.stockQuantity > 0) {
      updateQuantity(item.id, -1);
      addToast({
        title: 'Quantity Updated',
        description: `Removed 1 from ${item.name}`,
        type: 'success',
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this item from inventory?')) {
      removeItem(item.id);
      addToast({
        title: 'Item Removed',
        description: `${item.name} has been removed from inventory`,
        type: 'info',
      });
    }
  };

  // Determine stock status
  const getStockStatus = () => {
    if (item.stockQuantity === 0) {
      return { label: 'Out of Stock', color: 'bg-error text-white' };
    } else if (item.stockQuantity <= item.minStockLevel) {
      return { label: 'Low Stock', color: 'bg-warning text-foreground' };
    } else {
      return { label: 'In Stock', color: 'bg-success text-white' };
    }
  };

  // Check if item is expiring soon
  const getExpiryStatus = () => {
    if (!item.expiryDate) return null;
    
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(today.getDate() + 5);
    
    if (expiryDate < today) {
      return { label: 'Expired', color: 'bg-red-600 text-white', urgent: true };
    } else if (expiryDate <= fiveDaysFromNow) {
      return { label: 'Expires Soon', color: 'bg-orange-500 text-white', urgent: true };
    }
    
    return null;
  };

  const stockStatus = getStockStatus();
  const expiryStatus = getExpiryStatus();

  return (
    <div className="card animate-fade-in overflow-hidden">
      <div className="relative">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-40 object-contain bg-white"
          />
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-muted">
            <Package className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.label}
          </div>
          {expiryStatus && (
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${expiryStatus.color} ${expiryStatus.urgent ? 'animate-pulse' : ''}`}>
              {expiryStatus.label}
            </div>
          )}
        </div>
      </div>
      
      <div className="card-header">
        <h3 className="card-title truncate">{item.name}</h3>
        <p className="card-description truncate">{item.brand}</p>
      </div>
      
      <div className="card-content grid gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Quantity:</span>
          <span className="text-sm font-medium">{item.quantity}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">In Stock:</span>
          <span className="text-sm font-medium">{item.stockQuantity} units</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Min Level:</span>
          <span className="text-sm font-medium">{item.minStockLevel} units</span>
        </div>
        
        {item.expiryDate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Expires:
            </span>
            <span className={`text-sm font-medium ${expiryStatus?.urgent ? 'text-orange-600' : ''}`}>
              {new Date(item.expiryDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      
      <div className="card-footer justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrement}
            className="btn btn-sm btn-outline p-1"
            disabled={item.stockQuantity === 0}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="text-lg font-semibold w-8 text-center">
            {item.stockQuantity}
          </span>
          
          <button
            onClick={handleIncrement}
            className="btn btn-sm btn-outline p-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/product/${item.barcode}`}
            className="btn btn-sm btn-ghost p-1"
          >
            <Edit className="w-4 h-4" />
          </Link>
          
          <button
            onClick={handleDelete}
            className="btn btn-sm btn-ghost p-1 text-error"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;