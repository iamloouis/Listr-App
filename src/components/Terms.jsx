import React from 'react';

export default function Terms({ onOpenAuth, onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white font-sans flex flex-col">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-2xl">
        <div className="flex justify-between items-center pl-4 pr-2 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full w-full shadow-2xl shadow-black/50">
          <button onClick={() => onNavigate(null)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-lg shadow-black/20 text-white border border-white/5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white ml-1">Listr</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => onOpenAuth('login')} className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 transition-colors">Login</button>
            <button onClick={() => onOpenAuth('signup')} className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-all shadow-lg shadow-black/20">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* --- CONTENT --- */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 pt-32 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Use</h1>
        <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
          <p>
            Welcome to Listr. By accessing or using our website, you agree to be bound by these Terms of Use.
          </p>
          <h2 className="text-2xl text-white font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>
          <h2 className="text-2xl text-white font-semibold mt-8 mb-2">2. User Accounts</h2>
          <p>
             You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
          <h2 className="text-2xl text-white font-semibold mt-8 mb-2">3. Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever.
          </p>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 py-12 mt-auto bg-black/20 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20 text-white font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">Listr</span>
              </div>
              <div className="flex gap-8 text-sm font-medium text-gray-400">
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy</button>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors text-white">Terms</button>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact</button>
              </div>
              <span className="text-gray-500 text-sm">© 2025 Listr. All rights reserved.</span>
          </div>
      </footer>
    </div>
  );
}