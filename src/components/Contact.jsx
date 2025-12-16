import React, { useState } from 'react';

export default function Contact({ onOpenAuth, onNavigate }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const response = await fetch("https://formspree.io/f/xldqkdaz", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

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
      <div className="flex-1 w-full max-w-2xl mx-auto px-6 pt-32 pb-12 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">Contact Us</h1>
        <p className="text-gray-500 mb-10 text-center text-lg">Have a question or feedback? We'd love to hear from you.</p>

        {status === 'success' ? (
           <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-8 rounded-3xl text-center shadow-xl">
             <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
             <p className="mb-4 text-green-300">Thank you for reaching out. We will get back to you shortly.</p>
             <button onClick={() => setStatus('')} className="text-sm font-bold uppercase tracking-wider underline hover:text-white transition">Send another</button>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                required
                type="text" 
                placeholder="Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#6600FF] focus:bg-black outline-none transition-all"
              />
              <input 
                required
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#6600FF] focus:bg-black outline-none transition-all"
              />
            </div>
            <textarea 
              required
              placeholder="How can we help?" 
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#6600FF] focus:bg-black outline-none transition-all resize-none"
            ></textarea>

            <button 
              disabled={status === 'sending'}
              className="w-full bg-[#6600FF] hover:bg-[#5000c2] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 text-lg mt-2"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'error' && <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>}
          </form>
        )}
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
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms</button>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-white">Contact</button>
              </div>
              <span className="text-gray-500 text-sm">© 2025 Listr. All rights reserved.</span>
          </div>
      </footer>
    </div>
  );
}