import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ChatInterface = ({ userType, user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello${user ? ` ${user.name}` : ''}! I'm your municipal assistant. I can help you with zoning questions, permit information, city regulations, and more. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [jwtToken, setJwtToken] = useLocalStorage('jwtToken', '');
  const [isAnonymous, setIsAnonymous] = useState(false);
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
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Send message to backend
    try {
      const response = await fetch('http://localhost:8000/api/chatmessages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          user: isAnonymous ? null : user.id,
          message: newMessage.content,
          anonymous: isAnonymous
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
                  {userType === 'verified' ? 'Verified • Full Access' : 
                   userType === 'registered' ? 'Registered • Enhanced Features' : 
                   'Anonymous • Basic Features'}
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
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label className="text-sm text-gray-600">Send Anonymously</label>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
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
          ? 'bg-gray-100 text-gray-900' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-2 ${isBot ? 'text-gray-500' : 'text-blue-100'}`}>
          {message.timestamp.toLocaleTimeString()}
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
