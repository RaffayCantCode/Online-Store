import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, ShieldAlert, CheckCircle, UserCheck } from 'lucide-react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    login, 
    logout, 
    isAdmin,
    defaultAdminUser,
    defaultCustomerUser,
    setCurrentView
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-md w-full mx-auto shadow-2xl overflow-hidden border border-gray-100 z-50 animate-fade-in p-6 sm:p-8">
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          /* User Logged In Screen */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">{user.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              <div className="mt-2">
                <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isAdmin ? "bg-brand-black text-brand-orange border border-brand-orange" : "bg-gray-100 text-gray-700"
                }`}>
                  Role: {user.role}
                </span>
              </div>
            </div>

            {isAdmin && (
              <button 
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setCurrentView('admin');
                }}
                className="w-full bg-brand-black hover:bg-gray-900 text-brand-orange font-bold text-xs py-3 rounded-xl transition border border-brand-orange shadow"
              >
                Go to Admin Dashboard
              </button>
            )}

            <button 
              onClick={() => {
                logout();
                setIsAuthModalOpen(false);
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Login Form */
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-brand-black text-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-black shadow-md">
                T
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Taskeen Store Account</h3>
              <p className="text-xs text-gray-500 mt-1">Sign in to manage orders, wishlist, or admin controls</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 rounded-xl shadow transition text-sm"
              >
                Sign In
              </button>
            </form>

            {/* Quick Authentication Shortcut Switcher */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
                Quick Role Credentials Switcher
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    setEmail('admin@taskeen.com');
                    setPassword('admin123');
                    login('admin@taskeen.com', 'admin123');
                  }}
                  className="bg-brand-black text-brand-orange hover:bg-gray-900 text-xs font-bold py-2 px-3 rounded-xl transition text-center border border-brand-orange"
                >
                  Sign In as Admin
                </button>
                <button 
                  onClick={() => {
                    setEmail('customer@gmail.com');
                    setPassword('user123');
                    login('customer@gmail.com', 'user123');
                  }}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs font-bold py-2 px-3 rounded-xl transition text-center"
                >
                  Sign In as Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
