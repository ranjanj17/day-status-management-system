import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight hover:opacity-80 transition-all flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">FlyHigh</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={`font-bold px-5 py-2 rounded-xl text-sm transition-all active:scale-95 border ${isActive('/') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-blue-100 hover:bg-blue-50/50 hover:text-blue-900 hover:border-blue-200'}`}
          >
            Calendar
          </Link>
          {user ? (
            <>
              <Link 
                to="/grid" 
                className={`font-bold px-5 py-2 rounded-xl text-sm transition-all active:scale-95 border ${isActive('/grid') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-blue-100 hover:bg-blue-50/50 hover:text-blue-900 hover:border-blue-200'}`}
              >
                Dashboard
              </Link>
              <button 
                onClick={logout} 
                className="font-bold px-5 py-2 rounded-xl text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95 border border-rose-200 hover:border-rose-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="font-bold px-6 py-2.5 rounded-xl text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all active:scale-95 border border-transparent"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
