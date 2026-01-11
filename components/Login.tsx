
import React, { useState } from 'react';
import { User } from '../types';

export const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="gradient-blue w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">RF</div>
          <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Login to manage your bookings</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
              placeholder="john@example.com"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full gradient-blue text-white font-extrabold py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg"
          >
            LOGIN TO RAILFLOW
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">Don't have an account? <a href="#" className="text-blue-600 font-bold hover:underline">Sign up for free</a></p>
        </div>
      </div>
    </div>
  );
};
