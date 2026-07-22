import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldAlert, Lock, LogIn, ArrowLeft } from 'lucide-react';

export const AdminGuard = ({ children }) => {
  const { user, isAdmin, setIsAuthModalOpen, setCurrentView } = useStore();

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-6 sm:p-10 bg-white rounded-3xl border border-red-100 shadow-xl text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900">Access Denied - Security Restriction</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          The Taskeen Store Admin Dashboard is strictly restricted to authorized Administrator accounts. You must be signed in with an admin account to view or alter store configurations.
        </p>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-gray-700 max-w-sm mx-auto space-y-1">
          <p className="font-bold">Current Auth Status:</p>
          <p className="font-mono text-red-600">User: {user ? user.email : 'Unauthenticated Guest'}</p>
          <p className="font-mono text-red-600">Role: {user ? user.role : 'None'}</p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-black hover:bg-gray-900 text-brand-orange font-extrabold text-xs px-6 py-3.5 rounded-xl border border-brand-orange transition shadow"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In as Admin</span>
          </button>

          <button 
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-6 py-3.5 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
