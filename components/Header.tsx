import React from 'react';
import { SpecGuardIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-5 md:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SpecGuardIcon className="w-10 h-10 text-indigo-500" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              SpecGuard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Automated CAD Design Review & Compliance
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;