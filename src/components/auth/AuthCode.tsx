// NEW FILE: Verification code input page
// Part of the email verification system - does NOT modify existing files

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyCode, sendVerificationCode } from '../../utils/authApi';
import { Rocket, Shield, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const AuthCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('auth_email');
    if (!storedEmail) {
      // No email found, redirect back to email page
      navigate('/auth/email');
      return;
    }
    setEmail(storedEmail);

    // Focus input on mount
    inputRef.current?.focus();

    // Start countdown timer for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setCode(value);
      setError('');

      // Auto-submit when 6 digits entered
      if (value.length === 6) {
        handleVerify(value);
      }
    }
  };

  const handleVerify = async (codeToVerify: string = code) => {
    // Validate code format
    if (!codeToVerify || codeToVerify.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    if (!/^\d+$/.test(codeToVerify)) {
      setError('Code must contain only numbers');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[AuthCode] Starting verification for email:', email, 'code:', codeToVerify);
      const result = await verifyCode(email, codeToVerify);
      console.log('[AuthCode] Verification result:', result);

      // Check for successful verification
      if (result.verified === true) {
        setSuccess(true);
        // Clear the temporary email from session storage
        sessionStorage.removeItem('auth_email');
        
        console.log('[AuthCode] Verification successful, redirecting to dashboard...');
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // Show specific error message
        const errorMessage = result.error || 'Invalid verification code. Please try again.';
        console.error('[AuthCode] Verification failed:', errorMessage);
        setError(errorMessage);
        setCode('');
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error('[AuthCode] Exception during verification:', err);
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      setCode('');
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');
    setCode('');

    try {
      console.log('[AuthCode] Resending verification code to:', email);
      const result = await sendVerificationCode(email);
      console.log('[AuthCode] Resend result:', result);

      if (result.success) {
        // Store new code in session storage
        if (result.code) {
          sessionStorage.setItem('auth_verification_code', result.code);
          console.log('[AuthCode] New code generated and stored:', result.code);
        }
        
        setCanResend(false);
        setCountdown(60);
        
        // Show success feedback
        console.log('[AuthCode] ✅ Code resent successfully to:', email);
        
        // Restart countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const errorMessage = result.error || 'Failed to resend code. Please try again.';
        console.error('[AuthCode] ❌ Resend failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('[AuthCode] ❌ Exception during resend:', err);
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('auth_email');
    navigate('/auth/email');
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
          <p className="text-gray-400 text-lg">Email Verification</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
          {success ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
              <p className="text-gray-400">Redirecting to dashboard...</p>
              <div className="mt-4">
                <div className="w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF1E56] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  Enter Verification Code
                </h2>
                <p className="text-gray-400 text-center text-sm">
                  We sent a 6-digit code to
                  <br />
                  <span className="text-[#FF4500] font-semibold">{email}</span>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Code Input */}
              <div className="mb-6">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-4 text-white text-center text-3xl font-mono tracking-[1em] placeholder-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
                <p className="text-gray-500 text-xs text-center mt-2">
                  Enter the 6-digit code from your email
                </p>
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleVerify()}
                disabled={isLoading || code.length !== 6}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#FF4500]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className="text-[#FF4500] hover:text-[#FF6A3D] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                </button>
              </div>

              {/* Divider */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white transition-colors text-sm w-full text-center"
                >
                  ← Use a different email
                </button>
              </div>
            </>
          )}
        </div>

        {/* Back to Home */}
        {!success && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-[#FF4500] transition-colors text-sm"
            >
              ← Back to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCode;

