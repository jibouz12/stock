import React, { useState } from 'react';
import { Barcode } from 'lucide-react';

interface ManualEntryProps {
  onSubmit: (barcode: string) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onSubmit }) => {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcode) {
      setError('Please enter a barcode');
      return;
    }
    
    // Simple validation - barcodes are typically numeric and 8-14 digits
    if (!/^\d{8,14}$/.test(barcode)) {
      setError('Please enter a valid barcode (8-14 digits)');
      return;
    }
    
    setError('');
    onSubmit(barcode);
    setBarcode('');
  };

  return (
    <div className="card w-full max-w-md mx-auto">
      <div className="card-header">
        <h3 className="card-title flex items-center">
          <Barcode className="w-5 h-5 mr-2" />
          Manual Barcode Entry
        </h3>
        <p className="card-description">
          Enter the product barcode manually
        </p>
      </div>
      
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="barcode" className="block text-sm font-medium mb-1">
              Barcode Number
            </label>
            <input
              type="text"
              id="barcode"
              className="input"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g. 3017620422003"
            />
            {error && <p className="text-error text-sm mt-1">{error}</p>}
          </div>
          
          <button type="submit" className="btn btn-primary w-full">
            Search Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualEntry;