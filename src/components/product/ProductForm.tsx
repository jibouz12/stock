import React, { useState } from 'react';
import { Product, InventoryItem } from '../../types';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../store/useToastStore';
import { Package, Calendar } from 'lucide-react';

interface ProductFormProps {
  product: Product;
  existingItem?: InventoryItem;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, existingItem, isEdit = false }) => {
  const navigate = useNavigate();
  const { addItem, updateItem } = useInventoryStore();
  const { addToast } = useToastStore();
  
  const [stockQuantity, setStockQuantity] = useState(existingItem?.stockQuantity || 1);
  const [minStockLevel, setMinStockLevel] = useState(existingItem?.minStockLevel || 5);
  const [expiryDate, setExpiryDate] = useState(existingItem?.expiryDate || '');
  const [location, setLocation] = useState(existingItem?.location || '');
  const [notes, setNotes] = useState(existingItem?.notes || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && existingItem) {
      // Update existing item
      updateItem(existingItem.id, {
        stockQuantity,
        minStockLevel,
        expiryDate,
        location,
        notes,
        lastUpdated: new Date().toISOString()
      });
      
      addToast({
        title: 'Item Updated',
        description: `${product.name} has been updated in your inventory`,
        type: 'success'
      });
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: crypto.randomUUID(),
        barcode: product.code,
        name: product.name,
        brand: product.brand,
        image_url: product.image_url,
        quantity: product.quantity,
        categories: product.categories,
        stockQuantity,
        minStockLevel,
        expiryDate,
        location,
        notes,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      addItem(newItem);
      
      addToast({
        title: 'Item Added',
        description: `${product.name} has been added to your inventory`,
        type: 'success'
      });
    }
    
    // Navigate back to inventory
    navigate('/inventory');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full rounded-lg object-contain bg-white border shadow-sm h-64"
            />
          ) : (
            <div className="w-full rounded-lg bg-muted flex items-center justify-center h-64">
              <Package className="w-16 h-16 text-muted-foreground/40" />
            </div>
          )}
          
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              Barcode: {product.code}
            </p>
            {product.brand && (
              <p className="text-sm text-muted-foreground">
                Brand: {product.brand}
              </p>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stockQuantity"
                className="input"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Math.max(0, parseInt(e.target.value)))}
                required
              />
            </div>
            
            <div>
              <label htmlFor="minStockLevel" className="block text-sm font-medium mb-1">
                Minimum Stock Level
              </label>
              <input
                type="number"
                id="minStockLevel"
                className="input"
                min="0"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(Math.max(0, parseInt(e.target.value)))}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                You'll receive alerts when stock falls below this level
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
              Expiry Date (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                id="expiryDate"
                className="input pl-10"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Storage Location (Optional)
            </label>
            <input
              type="text"
              id="location"
              className="input"
              placeholder="e.g. Kitchen Pantry, Shelf 2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              className="input min-h-[100px]"
              placeholder="Add any additional notes about this product"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg flex-1"
            >
              {isEdit ? 'Update Item' : 'Add to Inventory'}
            </button>
            
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;