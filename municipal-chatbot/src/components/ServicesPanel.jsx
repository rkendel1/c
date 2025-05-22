import React from 'react';
import { FileText, CreditCard, Home, Phone } from 'lucide-react';



// Services Panel Component (Verified Users Only)
const ServicesPanel = ({ user }) => {
    const services = [
      { icon: FileText, title: 'Submit Permit Application', description: 'Apply for building, business, or special event permits', color: 'from-blue-400 to-blue-600' },
      { icon: CreditCard, title: 'Pay Property Taxes', description: 'View and pay your real estate tax bills online', color: 'from-green-400 to-green-600' },
      { icon: CreditCard, title: 'Pay Water Bill', description: 'Manage your municipal water service payments', color: 'from-cyan-400 to-cyan-600' },
      { icon: FileText, title: 'Request Records', description: 'Access public records and official documents', color: 'from-purple-400 to-purple-600' },
      { icon: Home, title: 'Property Information', description: 'View zoning, assessments, and property details', color: 'from-orange-400 to-orange-600' },
      { icon: Phone, title: 'Schedule Inspection', description: 'Book building or safety inspections', color: 'from-red-400 to-red-600' }
    ];
  
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Municipal Services</h2>
            <p className="text-gray-600">Complete transactions and access verified services with your authenticated account.</p>
          </div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Service Card Component
  const ServiceCard = ({ service }) => {
    const Icon = service.icon;
    
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/80 transition-all hover:shadow-lg group cursor-pointer">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
      </div>
    );
  };

export default ServicesPanel;