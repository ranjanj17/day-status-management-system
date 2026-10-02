import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm transition-all duration-300 rounded-b-2xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="group flex items-center gap-3 hover:opacity-100 transition-all">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-[14px] blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-white to-slate-50/90 rounded-[14px] shadow-sm border border-white flex items-center justify-center overflow-hidden z-10">
              <svg className="w-6 h-6 transform rotate-45 group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500 ease-out drop-shadow-sm" viewBox="0 0 24 24" fill="url(#flyhigh_plane_grad)">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                <defs>
                  <linearGradient id="flyhigh_plane_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0284C7" />
                    <stop offset="1" stopColor="#4F46E5" />
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
