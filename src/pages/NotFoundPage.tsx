import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="text-9xl font-bold text-primary/20">404</h1>
      <h2 className="text-3xl font-bold mt-6 mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="btn btn-primary">
          <Home className="w-5 h-5 mr-2" />
          Go to Home
        </Link>
        <Link to="/inventory" className="btn btn-outline">
          <Search className="w-5 h-5 mr-2" />
          Browse Inventory
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;