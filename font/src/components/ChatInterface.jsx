import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import api from '../api';

const ChatInterface = ({ userType, user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello${user ? ` ${user.name || user.first_name}` : ''}! I'm your municipal assistant. I can help you with zoning questions, permit information, city regulations, and more. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    setError('');

    try {
      const response = await api.post('/chat/chatmessages/', {
        message: newMessage.content,
        anonymous: isAnonymous,
        user_type: userType
      });

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response || response.data.message || 'I received your message.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please log in to continue chatting.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many messages. Please wait a moment before sending another.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorResponse]);
      setError(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserStatusText = () => {
    switch (userType) {
      case 'verified':
        return 'Verified • Full Access';
      case 'registered':
        return 'Registered • Enhanced Features';
      default:
        return 'Anonymous • Basic Features';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden border border-white/20">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Municipal Assistant</h2>
                <p className="text-sm text-gray-500">
                  {getUserStatusText()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} userType={userType} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white/50">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about zoning, permits, city services..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                disabled={isTyping}
              />
            </div>
            
            {/* Anonymous checkbox - only show for registered/verified users */}
            {userType !== 'anon' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous-checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isTyping}
                />
                <label htmlFor="anonymous-checkbox" className="text-sm text-gray-600 whitespace-nowrap">
                  Send Anonymously
                </label>
              </div>
            )}
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Usage info for anonymous users */}
          {userType === 'anon' && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Anonymous users have limited access. Sign up for enhanced features!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, userType }) => {
  const isBot = message.type === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isBot 
          ? message.isError 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-gray-100 text-gray-900'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-2 ${
          isBot 
            ? message.isError 
              ? 'text-red-600' 
              : 'text-gray-500'
            : 'text-blue-100'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 px-4 py-3 rounded-2xl max-w-xs">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">Assistant is typing...</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;