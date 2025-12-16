import React from 'react';

export default function Privacy({ onOpenAuth, onNavigate }) {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
          <p>Effective Date: 2025-01-01</p>
          <p>
            At Listr, we prioritize your privacy. This policy explains how we handle your data.
            We only collect the information necessary to provide our service, specifically your name, email address, and the tasks you create.
          </p>
          <h2 className="text-2xl text-white font-semibold mt-8 mb-2">1. Data Collection</h2>
          <p>
            We collect data you provide directly to us when you create an account or use our services.
            This includes profile information and the content of your tasks.
          </p>
          <h2 className="text-2xl text-white font-semibold mt-8 mb-2">2. Data Usage</h2>
          <p>
            We use your data solely to provide and improve the Listr experience. We do not sell your data to third parties.
          </p>
        </div>
      </div>

      {/* --- UNIFIED FOOTER --- */}
      <footer className="w-full border-t border-neutral-900 py-8 mt-auto bg-black relative z-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2025 Listr App. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">Privacy</button>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition">Terms</button>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact</button>
            </div>
        </div>
      </footer>
    </div>
  );
}