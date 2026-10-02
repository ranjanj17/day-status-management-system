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
        <Link to="/" className="group flex items-center gap-3 hover:opacity-100 transition-all">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/50 flex items-center justify-center overflow-hidden z-10">
              <svg className="w-5 h-5 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 ease-out" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10.5L22 2L13.5 22L11 13L2 10.5Z" fill="url(#flyhigh_grad1)" stroke="url(#flyhigh_grad2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 13L22 2" stroke="url(#flyhigh_grad2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="flyhigh_grad1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" stopOpacity="0.15"/>
                    <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.4"/>
                  </linearGradient>
                  <linearGradient id="flyhigh_grad2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[22px] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-colors duration-500">
              FlyHigh
            </span>
            <span className="text-[10px] leading-none font-extrabold tracking-[0.25em] text-slate-400 uppercase mt-[3px] group-hover:text-blue-500 transition-colors duration-500">
              System
            </span>
          </div>
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
