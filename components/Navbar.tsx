
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  onAdmin: () => void;
  isAdmin: boolean;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdmin, isAdmin, user }) => {
  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="gradient-blue text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-white text-blue-800 p-2 rounded-lg font-bold text-xl">RF</div>
          <span className="text-2xl font-bold tracking-tight">RailFlow</span>
        </div>
        <div className="hidden md:flex space-x-8 font-medium">
          <a href="#" className="hover:text-blue-200 border-b-2 border-white pb-1 transition">Trains</a>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onAdmin}
            className="text-sm font-semibold border border-white/30 px-4 py-1.5 rounded-full hover:bg-white hover:text-blue-800 transition"
          >
            {isAdmin ? 'Back to Booking' : 'Admin Insights'}
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold border-2 border-white/20 shadow-inner" title={user?.name}>
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </nav>
  );
};
