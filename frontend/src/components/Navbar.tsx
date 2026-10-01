import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Day Status
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-300">Calendar View</Link>
          {user ? (
            <>
              <Link to="/grid" className="hover:text-blue-300">Edit Data</Link>
              <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
