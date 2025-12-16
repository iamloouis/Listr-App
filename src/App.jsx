import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Contact from './components/Contact';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // Router State
  const [currentPage, setCurrentPage] = useState(null); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // --- ROUTING LOGIC ---
  
  // Updated: Pass onOpenAuth and onNavigate to all pages
  if (currentPage === 'privacy') return <Privacy onOpenAuth={handleOpenAuth} onNavigate={setCurrentPage} />;
  if (currentPage === 'terms') return <Terms onOpenAuth={handleOpenAuth} onNavigate={setCurrentPage} />;
  if (currentPage === 'contact') return <Contact onOpenAuth={handleOpenAuth} onNavigate={setCurrentPage} />;

  return (
    <>
      {session ? (
        <Dashboard 
          key={session.user.id} 
          user={session.user} 
          onLogout={handleLogout}
          onNavigate={setCurrentPage} 
        />
      ) : (
        <>
          <LandingPage 
            onOpenAuth={handleOpenAuth} 
            onNavigate={setCurrentPage} 
          />
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
            initialMode={authMode} 
          />
        </>
      )}
    </>
  );
}

export default App;