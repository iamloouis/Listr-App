import React from 'react';
import DotGrid from './DotGrid'; // Import the animation component

export default function LandingPage({ onOpenAuth, onNavigate }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col relative overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-2xl">
        <div className="flex justify-between items-center pl-4 pr-2 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full w-full shadow-2xl shadow-black/50">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-lg shadow-black/20 text-white border border-white/5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white ml-1">Listr</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onOpenAuth('login')} 
              className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => onOpenAuth('signup')} 
              className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-all shadow-lg shadow-black/20"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full max-w-6xl mx-auto px-6 pt-40 pb-24 md:pt-48 md:pb-36 text-center z-10">
        
        {/* INTERACTIVE BACKGROUND (Updated Opacity to 90%) */}
        <DotGrid 
            baseColor="#262626"    
            activeColor="#6600FF"  
            dotSize={2} 
            gap={32} 
            className="opacity-90" 
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8 shadow-inner shadow-white/5 relative z-20">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Simple. Focused. Effective.</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white relative z-20">
          Get <span className="text-purple-400">Sh!t Done</span>
        </h1>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed relative z-20">
          A smarter way to manage tasks without drowning in features.
        </p>
        
        {/* CTA Button */}
        <div className="flex justify-center relative z-20">
            <button onClick={() => onOpenAuth('signup')} className="px-8 py-4 bg-white text-black rounded-2xl hover:bg-gray-200 font-semibold text-lg transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2">
                Start For Free
            </button>
        </div>

        {/* App Preview Image/Card */}
        <div className="mt-24 flex justify-center relative z-20">
            <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full opacity-30"></div>
            <div className="bg-neutral-950/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 max-w-xl w-full border border-white/10 text-left relative">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="ml-4 text-gray-500 text-sm font-medium">My Tasks</span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                        <div className="w-5 h-5 rounded-md bg-purple-500/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        </div>
                        <span className="text-gray-500 line-through flex-1">Review project proposal</span>
                        <span className="text-sm text-gray-600 font-mono">9:00 AM</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                        <div className="w-5 h-5 rounded-md border-2 border-gray-600 group-hover:border-purple-400 transition-colors"></div>
                        <span className="text-gray-200 flex-1">Team standup meeting</span>
                        <span className="text-sm text-gray-500 font-mono">10:30 AM</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                        <div className="w-5 h-5 rounded-md border-2 border-gray-600 group-hover:border-purple-400 transition-colors"></div>
                        <span className="text-gray-200 flex-1">Update SSL certificates</span>
                        <span className="text-sm text-gray-500 font-mono">2:00 PM</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10 flex-1">
          <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for productivity</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Everything you need to stay focused and efficient, with nothing to slow you down.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 text-center flex flex-col items-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">Lightning Fast</h3>
                  <p className="text-gray-400 leading-relaxed">Add and manage tasks in seconds. No complex setup, no learning curve. Just instant productivity.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 text-center flex flex-col items-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">Daily Insights</h3>
                  <p className="text-gray-400 leading-relaxed">Visualize your progress with simple, effective daily reports that help you understand your habits.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 text-center flex flex-col items-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">Dark by Design</h3>
                  <p className="text-gray-400 leading-relaxed">A beautiful dark interface that's easy on the eyes, perfect for focused work sessions day or night.</p>
              </div>
          </div>
      </section>

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