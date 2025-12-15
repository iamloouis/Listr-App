import { useState } from 'react'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import AuthModal from './components/AuthModal'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Login handler
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <>
          <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      )}
    </>
  )
}

export default App