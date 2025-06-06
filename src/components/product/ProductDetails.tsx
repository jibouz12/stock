import React from 'react';
import { Product } from '../../types';
import { Package, ShoppingBasket, Wheat, AlarmClock } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full rounded-lg object-contain bg-white border shadow-sm h-64 md:h-80"
            />
          ) : (
            <div className="w-full rounded-lg bg-muted flex items-center justify-center h-64 md:h-80">
              <Package className="w-20 h-20 text-muted-foreground/40" />
            </div>
          )}
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {product.brand || 'Unknown Brand'}
            </p>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.quantity && (
              <p className="text-muted-foreground">{product.quantity}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-2 items-center">
              <ShoppingBasket className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Categories</p>
                <p className="text-sm text-muted-foreground">
                  {product.categories || 'Not categorized'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <Wheat className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Allergens</p>
                <p className="text-sm text-muted-foreground">
                  {product.allergens || 'None listed'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <AlarmClock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Labels</p>
                <p className="text-sm text-muted-foreground">
                  {product.labels || 'None listed'}
                </p>
              </div>
            </div>
            
            {product.stores && (
              <div className="flex gap-2 items-center">
                <ShoppingBasket className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Stores</p>
                  <p className="text-sm text-muted-foreground">{product.stores}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Ingredients</h3>
            <p className="text-sm text-muted-foreground">
              {product.ingredients_text || 'No ingredients information available'}
            </p>
          </div>
          
          {Object.keys(product.nutriments).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Nutrition Facts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {Object.entries(product.nutriments)
                  .filter(([key, value]) => key !== 'nutrition-score-fr' && typeof value === 'number')
                  .slice(0, 9)
                  .map(([key, value]) => (
                    <div key={key} className="bg-muted p-2 rounded-md">
                      <p className="font-medium">{key.replace(/_/g, ' ')}</p>
                      <p className="text-muted-foreground">{value}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;