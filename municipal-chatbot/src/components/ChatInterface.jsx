import React from 'react';
import { MessageCircle, User, Shield } from 'lucide-react';

const HomePage = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI-Powered Municipal Assistant</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Navigate Your City
              <br />
              <span className="text-4xl md:text-5xl">Effortlessly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get instant answers about zoning laws, permits, regulations, and municipal services. 
              No more endless searches through complex documents.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => setCurrentView('chat')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Chatting Now
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all">
              Learn More
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard 
              icon={MessageCircle}
              title="Anonymous Chat"
              description="Get quick answers without creating an account"
              color="from-gray-400 to-gray-600"
            />
            <FeatureCard 
              icon={User}
              title="Personalized Experience"
              description="Create a profile for tailored responses and history"
              color="from-blue-400 to-blue-600"
            />
            <FeatureCard 
              icon={Shield}
              title="Verified Services"
              description="Complete transactions like permits and tax payments"
              color="from-green-400 to-green-600"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }) => {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/80 transition-all hover:shadow-lg group">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    );
  };
  
  // Chat Interface Component
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
  
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "Based on your location and the current zoning regulations, I can help you with that. Let me check the specific requirements for your area.",
          "That's a great question about municipal regulations. Here's what I found in the city code...",
          "For permit applications in your area, you'll need to follow these steps. Since you're a verified user, I can help you start the application process.",
          "The zoning requirements for your property type include several considerations. Let me break this down for you."
        ];
        
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };
  
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
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

  
// Export the HomePage component
export default HomePage;