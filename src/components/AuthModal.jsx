import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null; // Don't render if closed

  const toggleMode = () => setMode(mode === 'signup' ? 'login' : 'signup');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend server.
    // For now, we simulate a successful login/signup.
    const userName = mode === 'signup' ? formData.firstName : 'Returning User';
    
    // Pass the user data back up to App.jsx
    onLoginSuccess({ name: userName, email: formData.email });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      {/* Stop click propagation so clicking the form doesn't close it */}
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-black">{mode === 'signup' ? 'Sign Up' : 'Welcome Back'}</h2>
            <p className="text-gray-400 text-sm mt-1">{mode === 'signup' ? 'Get started with Listr' : 'Sign in to your account'}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-200 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="First Name" 
                required 
                className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-black"
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                required 
                className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-black"
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="Email address" 
            required 
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 text-black"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder={mode === 'signup' ? "Password (min 6 characters)" : "Password"} 
            required 
            minLength={6}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 text-black"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />

          <button type="submit" className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 font-semibold transition-all duration-200 shadow-lg shadow-black/10">
            {mode === 'signup' ? 'Create Account' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-400">or continue with</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Button (Visual Only) */}
        <button type="button" onClick={() => onLoginSuccess({ name: 'Demo User' })} className="w-full py-3.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 font-medium transition flex items-center justify-center gap-3 text-black">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>

        {/* Toggle Mode */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={toggleMode} className="text-black font-semibold hover:underline ml-1">
            {mode === 'signup' ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}