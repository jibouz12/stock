import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import InventoryItemCard from './InventoryItem';
import { Search, Filter, Package } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const InventoryList: React.FC = () => {
  const { items } = useInventoryStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out' | 'expiring'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'date'>('name');
  
  const [filteredItems, setFilteredItems] = useState(items);
  
  // Initialize filter from URL params
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'low' || filterParam === 'out' || filterParam === 'expiring') {
      setFilterType(filterParam);
    }
  }, [searchParams]);
  
  // Apply filters, search and sort whenever the dependencies change
  useEffect(() => {
    let result = [...items];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.barcode.includes(searchTerm)
      );
    }
    
    // Apply stock filter
    if (filterType === 'low') {
      result = result.filter(
        item => item.stockQuantity <= item.minStockLevel && item.stockQuantity > 0
      );
    } else if (filterType === 'out') {
      result = result.filter(item => item.stockQuantity === 0);
    } else if (filterType === 'expiring') {
      const today = new Date();
      const fiveDaysFromNow = new Date();
      fiveDaysFromNow.setDate(today.getDate() + 5);
      
      result = result.filter(item => {
        if (!item.expiryDate) return false;
        const expiryDate = new Date(item.expiryDate);
        return expiryDate <= fiveDaysFromNow && expiryDate >= today;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'quantity') {
        return b.stockQuantity - a.stockQuantity;
      } else {
        // Sort by date (newest first)
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });
    
    setFilteredItems(result);
  }, [items, searchTerm, filterType, sortBy]);

  const handleFilterChange = (newFilter: 'all' | 'low' | 'out' | 'expiring') => {
    setFilterType(newFilter);
    // Update URL params
    if (newFilter === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', newFilter);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="input pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select
              className="input appearance-none pr-8"
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value as any)}
            >
              <option value="all">All Items</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="expiring">Expiring Soon</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none w-4 h-4" />
          </div>
          
          <div className="relative">
            <select
              className="input appearance-none pr-8"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="date">Sort by Updated</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none w-4 h-4" />
          </div>
        </div>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="inventory-grid">
          {filteredItems.map(item => (
            <InventoryItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground max-w-md">
            {items.length === 0
              ? "Your inventory is empty. Start by scanning products or adding them manually."
              : "No products match your current filters. Try adjusting your search or filter settings."}
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryList;