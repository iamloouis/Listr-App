import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // NEW: Tracks 'login' or 'signup'

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

  // NEW: specific handler to set mode before opening
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      {session ? (
        <Dashboard 
          key={session.user.id} 
          user={session.user} 
          onLogout={handleLogout} 
        />
      ) : (
        <>
          {/* Pass the new handler to LandingPage */}
          <LandingPage onOpenAuth={handleOpenAuth} />
          
          {/* Pass the mode to AuthModal */}
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