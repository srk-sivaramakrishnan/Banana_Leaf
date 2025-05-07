'use client';

import { useState } from 'react';
import { Leaf, Bell, User, Search, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="flex flex-col bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <div className={`flex items-center ${showMobileSearch ? 'hidden' : 'flex'}`}>
          <Leaf className="text-emerald-600 mr-2" />
          <span className="font-bold text-lg text-emerald-800">BananaLeaf AI</span>
        </div>

        {/* Desktop search */}
        <div className="hidden md:flex relative rounded-full bg-gray-50 px-4 py-2 items-center w-64 border border-gray-100 focus-within:border-emerald-300 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent focus:outline-none text-sm w-full text-black"
          />
        </div>

        {/* Mobile search toggle button */}
        <div className="md:hidden flex">
          {!showMobileSearch && (
            <button 
              onClick={() => setShowMobileSearch(true)}
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-full"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Right section with notifications and user profile */}
        <div className="flex items-center space-x-4">
          <button className="relative hover:bg-gray-50 p-2 rounded-full transition-colors">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-emerald-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">User</p>
              <p className="text-xs text-gray-500">user@gmail.com</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden md:block" />
          </div>
        </div>
      </div>

      {/* Mobile search bar - expanded view */}
      {showMobileSearch && (
        <div className="px-4 pb-4 md:hidden">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-emerald-300 focus:border-emerald-300 block w-full pl-10 pr-12 p-2.5"
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                className="px-3 text-sm text-emerald-600 font-medium"
                onClick={() => setShowMobileSearch(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
