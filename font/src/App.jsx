import React, { useState } from 'react';
import { useMemo } from 'react';
import { getUserType } from './utils/user';
import useAuth from './hooks/useAuth';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ChatInterface from './components/ChatInterface';
import ServicesPanel from './components/ServicesPanel';
import ProfilePanel from './components/ProfilePanel';
import LoginModal from './components/modals/LoginModal';
import SignupModal from './components/modals/SignupModal';
import VerificationModal from './components/modals/VerificationModal';

import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const {
    user,
    login,
    logout,
    signup,
    updateUser,
    isAuthenticated,
    authLoading
  } = useAuth();

 

  const userType = useMemo(() => getUserType(user), [user]);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.email, credentials.password);
      setShowLogin(false);
      setCurrentView('chat');
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const handleSignup = async (userData) => {
    try {
      await signup(userData);
      setShowSignup(false);
      setCurrentView('chat');
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    }
  };

  const handleVerification = async (verificationData) => {
    try {
      const updatedUser = { ...user, verified: true };
      updateUser(updatedUser);
      setShowVerification(false);
      setCurrentView('chat');
    } catch (err) {
      console.error('Verification failed:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        user={user} 
        onLogin={() => setShowLogin(true)}
        onSignup={() => setShowSignup(true)}
        onLogout={handleLogout}
      />

      <main className="pt-16">
        {currentView === 'home' && (
          <HomePage setCurrentView={setCurrentView} />
        )}
        
        {currentView === 'chat' && (
          <ChatInterface userType={userType} user={user} setCurrentView={setCurrentView} />
        )}

        {currentView === 'services' && userType === 'verified' && (
          <ServicesPanel user={user} />
        )}

        {currentView === 'profile' && isAuthenticated && (
          <ProfilePanel
            user={user}
            userType={userType}
            onUpdateUser={updateUser}
            onShowVerification={() => setShowVerification(true)}
          />
        )}
      </main>


      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSignup={handleSignup}
        />
      )}

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