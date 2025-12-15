import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import the connection
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  const [session, setSession] = useState(null); // Stores the logged-in user
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // 1. Check active session when app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen for changes (login, logout, signup)
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

  return (
    <>
{session ? (
  <Dashboard 
    key={session.user.id} // Forces a refresh when user changes
    user={session.user}   // <--- CHANGE THIS: Pass the whole user object
    onLogout={handleLogout} 
  />
) : (
        <>
          <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
          />
        </>
      )}
    </>
  );
}

export default App;