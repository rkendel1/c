export const USER_TYPES = {
    ANON: 'anon',
    REGISTERED: 'registered',
    VERIFIED: 'verified'
  };
  
  export const VIEWS = {
    HOME: 'home',
    CHAT: 'chat',
    SERVICES: 'services',
    PROFILE: 'profile'
  };
  
  export const DEMO_RESPONSES = [
    "Based on your location and the current zoning regulations, I can help you with that. Let me check the specific requirements for your area.",
    "That's a great question about municipal regulations. Here's what I found in the city code...",
    "For permit applications in your area, you'll need to follow these steps. Since you're a verified user, I can help you start the application process.",
    "The zoning requirements for your property type include several considerations. Let me break this down for you.",
    "I can help you understand the local ordinances that apply to your situation. Here are the key points...",
    "Municipal services in your area offer several options for this request. Let me walk you through the process."
  ];
  
  export const MUNICIPAL_SERVICES = [
    { 
      icon: 'FileText', 
      title: 'Submit Permit Application', 
      description: 'Apply for building, business, or special event permits', 
      color: 'from-blue-400 to-blue-600' 
    },
    { 
      icon: 'CreditCard', 
      title: 'Pay Property Taxes', 
      description: 'View and pay your real estate tax bills online', 
      color: 'from-green-400 to-green-600' 
    },
    { 
      icon: 'CreditCard', 
      title: 'Pay Water Bill', 
      description: 'Manage your municipal water service payments', 
      color: 'from-cyan-400 to-cyan-600' 
    },
    { 
      icon: 'FileText', 
      title: 'Request Records', 
      description: 'Access public records and official documents', 
      color: 'from-purple-400 to-purple-600' 
    },
    { 
      icon: 'Home', 
      title: 'Property Information', 
      description: 'View zoning, assessments, and property details', 
      color: 'from-orange-400 to-orange-600' 
    },
    { 
      icon: 'Phone', 
      title: 'Schedule Inspection', 
      description: 'Book building or safety inspections', 
      color: 'from-red-400 to-red-600' 
    }
  ];