import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  UserCheck, 
  ShoppingBag, 
  Sliders, 
  UserPlus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    login, 
    register, 
    logout, 
    isAdmin,
    setCurrentView,
    orders,
    showToast
  } = useStore();

  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast("Please fill in your Name, Email, and Password", "error");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    register(regName, regPhone, regEmail, regPassword);
  };

  // Filter orders for logged in user
  const userOrders = user ? orders.filter(o => o.email?.toLowerCase() === user.email?.toLowerCase() || o.phone === user.phone) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
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
          /* User Logged In Profile Screen */
          <div className="space-y-5">
            <div className="text-center space-y-2 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto shadow-inner">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900">{user.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{user.email}</p>
              {user.phone && <p className="text-xs text-gray-500 font-mono">📞 {user.phone}</p>}
              
              <div className="pt-1">
                <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  isAdmin ? "bg-brand-black text-brand-orange border border-brand-orange" : "bg-gray-100 text-gray-700"
                }`}>
                  Role: {user.role}
                </span>
              </div>
            </div>

            {/* Admin Dashboard Quick Nav */}
            {isAdmin && (
              <button 
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setCurrentView('admin');
                }}
                className="w-full bg-brand-black hover:bg-gray-900 text-brand-orange font-black text-xs py-3.5 rounded-xl transition border-2 border-brand-orange shadow-md flex items-center justify-center space-x-2"
              >
                <Sliders className="w-4 h-4 text-brand-orange" />
                <span>Open Admin Dashboard</span>
              </button>
            )}

            {/* User Order History Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center justify-between">
                <span>My Recent Orders ({userOrders.length})</span>
              </h4>

              {userOrders.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-center text-xs text-gray-500 font-bold">
                  You haven't placed any orders yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {userOrders.map(order => (
                    <div key={order.id} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs flex justify-between items-center font-bold">
                      <div>
                        <span className="font-mono font-black text-brand-orange block">{order.id}</span>
                        <span className="text-[10px] text-gray-500">{order.date || 'Recent'}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-gray-900 block">Rs. {(order.totalAmount || order.total || 0).toLocaleString()}</span>
                        <span className="text-[10px] text-green-700 font-extrabold">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                logout();
                setIsAuthModalOpen(false);
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-black text-xs py-3 rounded-xl transition border border-red-200"
            >
              Sign Out Account
            </button>
          </div>
        ) : (
          /* Login / Register Tab View */
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-brand-black text-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-black shadow-md border border-brand-orange">
                T
              </div>
              <h3 className="text-xl font-black text-gray-900">Taskeen Store Account</h3>
              <p className="text-xs text-gray-500 mt-1 font-bold">Sign in or create a new account to manage orders</p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
              <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
                  mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setMode('register')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
                  mode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="email" 
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3 py-3 text-xs font-bold bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-3 text-xs font-bold bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-3.5 rounded-xl shadow-md transition active:scale-98 text-xs uppercase tracking-wider"
                >
                  Sign In
                </button>

                <div className="pt-3 text-center border-t border-gray-100">
                  <p className="text-xs text-gray-600 font-bold">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => setMode('register')}
                      className="text-brand-orange hover:underline font-black"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* REGISTER / CREATE ACCOUNT FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Fatima Khan"
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-bold bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Mobile Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="tel" 
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 0300-1234567"
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-bold bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="email" 
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. yourname@email.com"
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-bold bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-black text-gray-800 mb-1">Password *</label>
                    <input 
                      type="password" 
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 text-xs font-bold bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-800 mb-1">Confirm Password *</label>
                    <input 
                      type="password" 
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 text-xs font-bold bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-3.5 rounded-xl shadow-md transition active:scale-98 text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create New Account</span>
                </button>

                <div className="pt-2 text-center border-t border-gray-100">
                  <p className="text-xs text-gray-600 font-bold">
                    Already registered?{' '}
                    <button 
                      type="button" 
                      onClick={() => setMode('login')}
                      className="text-brand-orange hover:underline font-black"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
