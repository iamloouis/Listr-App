import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: Reset state and set correct mode whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setError(null);
      // Optional: Clear fields on reopen if you prefer
      // setEmail(''); setPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // --- SIGN UP LOGIC ---
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        if (!firstName.trim() || !lastName.trim()) {
            throw new Error("Please enter your full name");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`
            }
          }
        });
        if (error) throw error;
        alert('Account created! Check your email to confirm.');
      }
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 w-full max-w-sm p-8 rounded-3xl border border-neutral-800 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
        
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          {isLogin ? 'Enter your details to sign in' : 'Start your productivity journey'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* --- GOOGLE BUTTON --- */}
        <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl mb-4 flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                <path d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] bg-neutral-800 flex-1"></div>
            <span className="text-gray-600 text-xs uppercase">Or with email</span>
            <div className="h-[1px] bg-neutral-800 flex-1"></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-3">
          
          {/* NAME FIELDS (Only for Sign Up) */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                  required
                />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              required
            />
          </div>

          {/* CONFIRM PASSWORD (Only for Sign Up) */}
          {!isLogin && (
             <div>
               <input
                 type="password"
                 placeholder="Confirm Password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                 required
               />
             </div>
          )}
          
          <button 
            disabled={loading}
            className="w-full bg-[#6600FF] hover:bg-[#5000c2] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={switchMode}
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}