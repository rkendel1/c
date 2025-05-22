import React, { useState } from 'react';
import { User } from 'lucide-react';
import UserTypeIndicator from './UserTypeIndicator';



const ProfilePanel = ({ user, setUser, userType, setShowVerification }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);
  
    const handleSave = () => {
      setUser(formData);
      setIsEditing(false);
    };
  
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <UserTypeIndicator userType={userType} />
                    {userType !== 'verified' && (
                      <button 
                        onClick={() => setShowVerification(true)}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition-all"
                      >
                        Get Verified
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
  
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>
  
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.address || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.city || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
  
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ProfilePanel;