
import React from 'react';
import { CogIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-5 md:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CogIcon className="w-10 h-10 text-indigo-500" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Sheet Metal Design AI Inspector
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Automated design validation using Gemini
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
