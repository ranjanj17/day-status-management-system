import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { email, password });
      login(res.data.data.token, res.data.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || (isLogin ? 'Invalid credentials' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-4 overflow-hidden relative">
      {/* Background ambient glow just for login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-5 sm:p-8 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/60 relative z-10 max-h-full flex flex-col justify-center">

        <div className="text-center mb-4 sm:mb-6 relative z-10">
          <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-5 shadow-xl shadow-blue-500/20 transform transition-transform hover:scale-105">
            {isLogin ? (
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
            ) : (
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium leading-tight">{isLogin ? 'Enter your details to access your dashboard' : 'Sign up to start tracking your daily status'}</p>
        </div>
        
        {error && (
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-50 p-3 bg-red-50/95 backdrop-blur-md border border-red-200 text-red-600 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-red-500/10 flex items-center justify-center animate-in slide-in-from-top-2 duration-300">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl sm:rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 text-slate-800 font-bold text-sm sm:text-base shadow-sm"
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl sm:rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 text-slate-800 font-bold text-sm sm:text-base shadow-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-sm sm:text-base"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            {isLogin ? (
              <>Don't have an account? <span className="text-blue-600 font-bold ml-1">Sign up</span></>
            ) : (
              <>Already have an account? <span className="text-blue-600 font-bold ml-1">Sign in</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
