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

export default HomePage;