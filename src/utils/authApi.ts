// Authentication API Helper Functions
// Calls Supabase Edge Functions for email verification

// Import Supabase credentials from existing supabaseClient
import { supabase } from '../supabaseClient';

// Supabase configuration
const SUPABASE_URL = 'https://mwlxeljisdcgzboahxxb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bHhlbGppc2RjZ3pib2FoeHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTEwOTEsImV4cCI6MjA3ODg4NzA5MX0.WnJVbb4vjB3hwYUWSZTreXTZwloVi54w9-pszT6MH1w';

// API Response Types
interface SendCodeResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?: string; // The generated verification code
}

interface VerifyCodeResponse {
  verified: boolean;
  token?: string;
  email?: string;
  message?: string;
  error?: string;
}

/**
 * Send verification code to email
 * Calls the send-verification-code edge function
 */
export async function sendVerificationCode(email: string, code?: string): Promise<SendCodeResponse> {
  try {
    // Check if email already exists in the users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // If email already exists, do not send code
    if (existingUser) {
      console.log('[DEBUG] Email already registered:', email);
      return {
        success: false,
        error: 'This email is already registered. Please log in instead.',
      };
    }

    // Generate 6-digit code if not provided
    const verificationCode = code || Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`[DEBUG] Sending to endpoint: ${SUPABASE_URL}/functions/v1/send-verification-code`);
    console.log(`[DEBUG] Email being sent: "${email}"`);
    console.log(`[DEBUG] Code being sent: "${verificationCode}"`);
    console.log(`[DEBUG] Request body:`, JSON.stringify({ email, code: verificationCode }));

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, code: verificationCode }),
    });

    console.log(`[DEBUG] Response status: ${response.status}`);
    console.log(`[DEBUG] Response headers:`, Object.fromEntries(response.headers.entries()));

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[DEBUG] Non-JSON response:', text);
      throw new Error('Server returned invalid response format');
    }

    const data = await response.json();
    console.log('[DEBUG] Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to send verification code');
    }

    return {
      success: true,
      message: data.message || 'Verification code sent successfully',
      code: verificationCode, // Return the code so frontend can store it
    };
  } catch (error) {
    console.error('[DEBUG] Error sending verification code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error. Please check your connection.',
    };
  }
}

/**
 * Verify the code entered by user
 * Calls the verify-code edge function
 */
export async function verifyCode(email: string, code: string): Promise<VerifyCodeResponse> {
  try {
    console.log(`[authApi] Verifying code for: ${email}, code: ${code}`);

    // Validate input
    if (!email || !code) {
      throw new Error('Email and code are required');
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      throw new Error('Code must be a 6-digit number');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, code }),
    });

    console.log(`[authApi] Verify response status: ${response.status}`);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[authApi] Non-JSON response:', text);
      throw new Error('Server returned invalid response format');
    }

    const data = await response.json();
    console.log('[authApi] Verify response data:', data);

    // Handle different response formats
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Verification failed');
    }

    // Check if verification was successful
    if (data.verified === true || data.success === true) {
      // Store authentication data in localStorage
      const token = data.token || data.jwt || `temp_token_${Date.now()}`;
      const verifiedEmail = data.email || email;

      localStorage.setItem('mars_auth_token', token);
      localStorage.setItem('mars_auth_email', verifiedEmail);
      localStorage.setItem('mars_auth_timestamp', Date.now().toString());

      // Update user profile with verified email
      updateUserProfileEmail(verifiedEmail);

      console.log('[authApi] Verification successful, data stored');

      return {
        verified: true,
        token: token,
        email: verifiedEmail,
        message: data.message || 'Email verified successfully',
      };
    } else {
      // Verification failed
      return {
        verified: false,
        error: data.error || data.message || 'Invalid verification code',
      };
    }
  } catch (error) {
    console.error('[authApi] Error verifying code:', error);
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Network error. Please check your connection.',
    };
  }
}

/**
 * Update user profile with verified email
 * Saves the email to localStorage user profile
 */
function updateUserProfileEmail(email: string): void {
  try {
    const savedUser = localStorage.getItem('marsPioneers_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      parsedUser.email = email;
      localStorage.setItem('marsPioneers_user', JSON.stringify(parsedUser));
      console.log('[authApi] User profile email updated:', email);
    } else {
      // Create new user profile if it doesn't exist
      const newUser = {
        id: `user_${Date.now()}`,
        fullName: '',
        email: email,
        walletAddress: '0x0000000000000000000000000000000000000000',
        bio: '',
        avatar: null,
        preferences: {
          emailNotifications: true,
          pushNotifications: false,
        },
        security: {
          lastLogin: new Date().toISOString(),
        },
      };
      localStorage.setItem('marsPioneers_user', JSON.stringify(newUser));
      console.log('[authApi] New user profile created with email:', email);
    }

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('[authApi] Error updating user profile email:', error);
  }
}

/**
 * Check if user is authenticated
 * Validates token from localStorage
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('mars_auth_token');
  const timestamp = localStorage.getItem('mars_auth_timestamp');

  if (!token || !timestamp) {
    return false;
  }

  // Check if token is expired (7 days)
  const tokenAge = Date.now() - parseInt(timestamp);
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  if (tokenAge > sevenDaysInMs) {
    // Token expired, clear it
    clearAuth();
    return false;
  }

  return true;
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('mars_auth_token');
}

/**
 * Get authenticated user email
 */
export function getAuthEmail(): string | null {
  return localStorage.getItem('mars_auth_email');
}

/**
 * Clear authentication data (logout)
 */
export function clearAuth(): void {
  localStorage.removeItem('mars_auth_token');
  localStorage.removeItem('mars_auth_email');
  localStorage.removeItem('mars_auth_timestamp');
}

/**
 * Validate JWT token format (basic check)
 */
export function isValidTokenFormat(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3;
}

