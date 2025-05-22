import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ChatInterface from './components/ChatInterface';
import ServicesPanel from './components/ServicesPanel';
import ProfilePanel from './components/ProfilePanel';
import LoginModal from './components/modals/LoginModal';
import SignupModal from './components/modals/SignupModal';
import VerificationModal from './components/modals/VerificationModal';
import "./App.css";

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [userType, setUserType] = useState('anon'); // anon, registered, verified
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setUserType(userData.verified ? 'verified' : 'registered');
    setShowLogin(false);
    setCurrentView('chat');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setUserType('registered');
    setShowSignup(false);
    setCurrentView('chat');
  };

  const handleVerification = (userData) => {
    setUser({ ...userData, verified: true });
    setUserType('verified');
    setShowVerification(false);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setUserType('anon');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header 
        userType={userType} 
        user={user} 
        onLogin={() => setShowLogin(true)}
        onSignup={() => setShowSignup(true)}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <main className="pt-16">
        {currentView === 'home' && <HomePage setCurrentView={setCurrentView} />}
        {currentView === 'chat' && <ChatInterface userType={userType} user={user} />}
        {currentView === 'services' && userType === 'verified' && <ServicesPanel user={user} />}
        {currentView === 'profile' && user && (
          <ProfilePanel 
            user={user} 
            setUser={setUser} 
            userType={userType} 
            setShowVerification={setShowVerification} 
          />
        )}
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSignup={handleSignup} />}
      {showVerification && (
        <VerificationModal 
          onClose={() => setShowVerification(false)} 
          onVerify={handleVerification} 
          user={user} 
        />
      )}
    </div>
  );
};

export default App;