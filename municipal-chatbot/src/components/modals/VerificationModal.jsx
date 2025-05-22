import React, { useState } from 'react';
import { Shield, Mail, MapPin, CheckCircle } from 'lucide-react';


const VerificationModal = ({ onClose, onVerify, user }) => {
    const [step, setStep] = useState(1); // 1: Request, 2: Enter OTP
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleRequestVerification = () => {
      setIsLoading(true);
      // Simulate sending OTP via mail
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 2000);
    };
  
    const handleVerifyOTP = (e) => {
      e.preventDefault();
      if (otp === '123456') { // Demo OTP
        onVerify({
          ...user,
          verified: true,
          verificationDate: new Date()
        });
      } else {
        alert('Invalid OTP. Please try 123456 for demo purposes.');
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          {step === 1 ? (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Verified</h2>
                <p className="text-gray-600">
                  Verify your identity to access premium municipal services and complete transactions.
                </p>
              </div>
  
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Verification Process:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. We'll send a verification code to your registered address</li>
                  <li>2. Enter the code when you receive it (2-3 business days)</li>
                  <li>3. Gain access to verified services and transactions</li>
                </ol>
              </div>
  
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Verification will be sent to:</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.address}</p>
                      <p className="text-sm text-gray-600">{user.city}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestVerification}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Request Verification'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
                <p className="text-gray-600">
                  We've sent a verification code to your registered address. Enter it below to complete verification.
                </p>
              </div>
  
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Verification code sent successfully!</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  For demo purposes, use code: <strong>123456</strong>
                </p>
              </div>
  
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono"
                    maxLength="6"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    Verify
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default VerificationModal;