import React from 'react';
import { MessageCircle, User, Shield, HelpCircle } from 'lucide-react';

// User Type Indicator Component
const UserTypeIndicator = ({ userType }) => {
  const configs = {
    anon: {
      icon: MessageCircle,
      label: 'Anonymous',
      color: 'text-gray-500',
      bg: 'bg-gray-100',
    },
    registered: {
      icon: User,
      label: 'Registered',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    verified: {
      icon: Shield,
      label: 'Verified',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    unknown: {
      icon: HelpCircle,
      label: 'Unknown',
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  };

  const config = configs[userType] || configs.unknown;
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
};

export default UserTypeIndicator;