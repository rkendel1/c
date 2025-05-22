import React from 'react';
import { Home, MessageCircle, User, Shield } from 'lucide-react';
import UserTypeIndicator from './UserTypeIndicator';


const Header = ({ userType, user, onLogin, onSignup, onLogout, currentView, setCurrentView }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CivicAI
                </h1>
                <p className="text-xs text-gray-500">Municipal Assistant</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView('chat')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'chat' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Chat
            </button>
            {userType === 'verified' && (
              <button 
                onClick={() => setCurrentView('services')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'services' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Services
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <UserTypeIndicator userType={userType} />
            {user ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onLogin}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={onSignup}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



export default Header;