// NEW FILE: Email input page for authentication
// Part of the email verification system - does NOT modify existing files

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendVerificationCode } from '../../utils/authApi';
import { Rocket, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const AuthEmail: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email format
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[AuthEmail] Sending verification code to:', trimmedEmail);
      const result = await sendVerificationCode(trimmedEmail);
      console.log('[AuthEmail] Send result:', result);

      if (result.success) {
        // Store email and code temporarily to pass to code page
        sessionStorage.setItem('auth_email', trimmedEmail);
        if (result.code) {
          sessionStorage.setItem('auth_verification_code', result.code);
          console.log('[AuthEmail] Code generated and stored:', result.code);
        }
        console.log('[AuthEmail] ✅ Code sent successfully to:', trimmedEmail);
        // Navigate to code entry page
        navigate('/auth/code');
      } else {
        const errorMessage = result.error || 'Failed to send verification code. Please try again.';
        console.error('[AuthEmail] ❌ Send failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('[AuthEmail] ❌ Exception during send:', err);
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rocket className="w-10 h-10 text-[#FF4500]" />
            <h1 className="text-3xl font-bold text-white">
              Mars<span className="text-[#FF4500]">Pioneers</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Welcome Back, Pioneer</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF1E56] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Email Verification
            </h2>
            <p className="text-gray-400 text-center text-sm">
              Enter your email to receive a verification code
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pioneer@marscolony.com"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#FF4500]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Info Text */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-xs text-center">
              You'll receive a 6-digit code that expires in 5 minutes
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-[#FF4500] transition-colors text-sm"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthEmail;

