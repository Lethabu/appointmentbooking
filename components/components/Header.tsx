
import React from 'react';
import { IconUserCircle } from '../constants';

const Header: React.FC = () => {
  // In a real app, you'd get the current page title or breadcrumbs from routing context
  const pageTitle = "Salon Dashboard"; 

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center h-16 border-b border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-700">{pageTitle}</h2>
      <div className="flex items-center space-x-3">
        <span className="text-neutral-600">Salon Admin</span>
        <IconUserCircle className="h-8 w-8 text-neutral-500" />
      </div>
    </header>
  );
};

export default Header;
