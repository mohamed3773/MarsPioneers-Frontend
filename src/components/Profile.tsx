import React, { useState, useEffect, useRef, ChangeEvent, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Fix: Import UserContext to sync avatar/username globally
import { useDisconnect } from 'wagmi';
import { supabase } from '../supabaseClient';

// User profile interface
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  wallet_address: string;
  bio: string;
  avatar: string | null;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  security: {
    lastLogin: string;
    // ADDED: Track email verification resend attempts
    emailVerification?: {
      resendAttempts: number;
      lastResendDate: string;
    };
  };
}

// Validation errors interface
interface ValidationErrors {
  fullName?: string;
  email?: string;
  bio?: string;
}

// Toast notification interface
interface ToastNotification {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

// Email verification interface
interface EmailVerification {
  isVerifying: boolean;
  verificationCode: string;
  enteredCode: string;
  newEmail: string;
  error: string;
}


// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// UPDATED: Reduced character limits per requirements
const MAX_BIO_LENGTH = 200; // Changed from 500 to 200
const MAX_NAME_LENGTH = 20; // UPDATED: Changed from 15 to 20
const MAX_EMAIL_LENGTH = 50; // ADDED: Max email length 50
const MIN_NAME_LENGTH = 2;
const VERIFICATION_CODE_LENGTH = 6;
const TOAST_DURATION = 3000;
const MAX_RESEND_ATTEMPTS = 3; // ADDED: Max resend attempts per day

// Default user profile values - UPDATED: Removed random/default values
const DEFAULT_USER: UserProfile = {
  id: '',
  fullName: '',
  email: '',
  wallet_address: '',
  bio: '',
  avatar: null,
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
  },
  security: {
    lastLogin: '', // UPDATED: Empty default, will be populated from Supabase
  },
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix: Get clearUser from UserContext
  const { updateProfile, user: globalUser, clearUser } = useUser();
  const { disconnect } = useDisconnect();

  // Show notification toast - moved before loadUserData to avoid dependency issues
  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setShowToast({ visible: true, message, type });
    setTimeout(() => {
      setShowToast({ visible: false, message: '', type: '' });
    }, TOAST_DURATION);
  }, []);

  // Confirm wallet disconnect and logout
  const confirmDisconnectWallet = useCallback(async () => {
    try {
      // 1. Sign out from Supabase
      await supabase.auth.signOut();

      // 2. Disconnect from Wallet (RainbowKit/Wagmi)
      disconnect();
      localStorage.removeItem('wagmi.store');
      localStorage.removeItem('wagmi.wallet');
      localStorage.removeItem('wagmi.connected');

      // 3. Clear all user/session data
      localStorage.removeItem('marsPioneers_user');
      localStorage.removeItem('sb-mwlxeljisdcgzboahxxb-auth-token');

      // 4. Reset UserContext state explicitly
      if (clearUser) {
        clearUser();
      }

      // 5. Dispatch storage event to update other components immediately
      window.dispatchEvent(new Event('storage'));

      showNotification('Logged out successfully', 'success');

      // 6. Redirect to homepage immediately
      navigate('/');



    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    }
  }, [navigate, showNotification, clearUser, disconnect]);

  // User state with safe defaults
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  const [originalUser, setOriginalUser] = useState<UserProfile>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showToast, setShowToast] = useState<ToastNotification>({ visible: false, message: '', type: '' });
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Email verification state
  const [emailVerification, setEmailVerification] = useState<EmailVerification>({
    isVerifying: false,
    verificationCode: '',
    enteredCode: '',
    newEmail: '',
    error: ''
  });

  // ADDED: Track if email has been changed to show verify button
  const [emailChanged, setEmailChanged] = useState(false);

  // ADDED: Track if email is verified
  const [emailVerified, setEmailVerified] = useState(true);



  // Load user data on component mount
  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fix: Sync local state with global user context when it updates
  useEffect(() => {
    if (globalUser) {
      console.log('[Profile] Syncing with global user:', globalUser);

      setUser(prev => {
        // Avoid unnecessary updates if data hasn't changed
        if (prev.wallet_address === globalUser.wallet_address &&
          prev.fullName === (globalUser.fullName || '') &&
          prev.avatar === globalUser.avatar) {
          return prev;
        }

        const safePreferences = globalUser.preferences || DEFAULT_USER.preferences;
        const safeSecurity = globalUser.security || {};

        return {
          ...prev,
          id: globalUser.id || prev.id,
          fullName: globalUser.fullName || globalUser.username || '',
          email: globalUser.email || '',
          wallet_address: globalUser.wallet_address || prev.wallet_address,
          bio: globalUser.bio || '',
          avatar: globalUser.avatar || null,
          preferences: {
            emailNotifications: safePreferences.emailNotifications ?? prev.preferences.emailNotifications,
            pushNotifications: safePreferences.pushNotifications ?? prev.preferences.pushNotifications
          },
          security: {
            lastLogin: globalUser.last_login || prev.security.lastLogin,
            emailVerification: safeSecurity.emailVerification || prev.security.emailVerification
          }
        };
      });

      if (globalUser.avatar) {
        setAvatarPreview(globalUser.avatar);
      }
    }
  }, [globalUser]);

  // Memoized formatted wallet address with null safety
  const formattedWalletAddress = useMemo(() => {
    // Fix: Use wallet_address from globalUser or fallback to user state
    const walletAddress = globalUser?.wallet_address || user.wallet_address;
    if (!walletAddress || walletAddress.length < 14) {
      return 'Invalid Address';
    }
    return `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`;
  }, [globalUser?.wallet_address, user.wallet_address]);

  // Memoized formatted date with error handling
  const formattedLastLogin = useMemo(() => {
    try {
      // Fix: Safely parse date with error handling
      if (!user.security?.lastLogin) {
        return 'Never';
      }
      const date = new Date(user.security.lastLogin);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Never'; // Return Never if invalid date
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Never';
    }
  }, [user.security?.lastLogin]);

  // Memoized bio character count with warning color
  const bioCharacterCount = useMemo(() => {
    const count = user.bio?.length || 0;
    return {
      count,
      isNearLimit: count > MAX_BIO_LENGTH - 20, // Updated threshold for 200 char limit
      isAtLimit: count >= MAX_BIO_LENGTH
    };
  }, [user.bio]);

  // ADDED: Memoized name character count
  const nameCharacterCount = useMemo(() => {
    const count = user.fullName?.length || 0;
    return {
      count,
      isNearLimit: count > MAX_NAME_LENGTH - 3, // Warn when 3 chars left
      isAtLimit: count >= MAX_NAME_LENGTH
    };
  }, [user.fullName]);

  // Load user data from localStorage with safe error handling
  const loadUserData = useCallback(async () => {
    try {
      // Fetch latest last_sign_in_at from Supabase Auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const lastSignIn = authUser?.last_sign_in_at || new Date().toISOString();

      const savedUser = localStorage.getItem('marsPioneers_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as UserProfile;
        // Fix: Validate parsed user data before setting state
        if (parsedUser && typeof parsedUser === 'object') {
          // Ensure all required fields exist with safe defaults
          const safeUser: UserProfile = {
            id: parsedUser.id || DEFAULT_USER.id,
            fullName: parsedUser.fullName || DEFAULT_USER.fullName,
            email: parsedUser.email || DEFAULT_USER.email,
            wallet_address: parsedUser.wallet_address || DEFAULT_USER.wallet_address,
            bio: parsedUser.bio || DEFAULT_USER.bio,
            avatar: parsedUser.avatar || null,
            preferences: {
              emailNotifications: parsedUser.preferences?.emailNotifications ?? DEFAULT_USER.preferences.emailNotifications,
              pushNotifications: parsedUser.preferences?.pushNotifications ?? DEFAULT_USER.preferences.pushNotifications,
            },
            security: {
              // UPDATED: Always use Supabase auth last sign in if available, or fallback to saved
              lastLogin: lastSignIn,
              emailVerification: parsedUser.security?.emailVerification
            },
          };
          setUser(safeUser);
          setOriginalUser(safeUser);

          // Fix: Sync profile data with UserContext on load so other components get the data
          updateProfile({
            fullName: safeUser.fullName,
            avatar: safeUser.avatar
          });

          // Fix: Safely set avatar preview only if avatar exists
          if (safeUser.avatar) {
            setAvatarPreview(safeUser.avatar);
          }
        }
      } else {
        // If no saved user, ensure we still set the last login from auth
        setUser(prev => ({
          ...prev,
          security: {
            ...prev.security,
            lastLogin: lastSignIn
          }
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fix: Use setShowToast directly to avoid dependency on showNotification
      setShowToast({ visible: true, message: 'Failed to load profile data', type: 'error' });
      setTimeout(() => {
        setShowToast({ visible: false, message: '', type: '' });
      }, TOAST_DURATION);
    }
  }, [updateProfile]);


  // Save user data to Supabase with proper error handling and state updates
  const saveUserData = useCallback(async (userData: UserProfile) => {
    setIsLoading(true);
    try {
      // Always use the correct wallet address
      const walletAddress = (globalUser?.wallet_address || user.wallet_address || "").toLowerCase();
      if (!walletAddress) {
        console.error('[Profile] Cannot save: wallet_address is missing');
        showNotification('Cannot save profile: wallet address is missing', 'error');
        setIsLoading(false);
        return;
      }

      // Build updateData correctly - only include defined fields
      const updateData: any = {};

      if (userData.fullName !== undefined && userData.fullName !== null) {
        updateData.fullName = userData.fullName.trim();
        updateData.username = userData.fullName.trim(); // Keep username in sync
      }

      if (userData.email !== undefined && userData.email !== null && userData.email.trim()) {
        updateData.email = userData.email.trim();
      }

      if (userData.bio !== undefined && userData.bio !== null) {
        updateData.bio = userData.bio;
      }

      if (userData.avatar !== undefined && userData.avatar !== null) {
        updateData.avatar = userData.avatar;
      }

      if (user.preferences) {
        updateData.preferences = typeof user.preferences === 'string'
          ? user.preferences
          : JSON.stringify(user.preferences);
      }

      if (user.security) {
        updateData.security = typeof user.security === 'string'
          ? user.security
          : JSON.stringify(user.security);
      }

      console.log('[Profile] UPDATE user with data:', {
        wallet_address: walletAddress,
        updateData,
      });

      // Optimistically update UI immediately
      const optimisticProfile: UserProfile = {
        id: globalUser?.id || user.id,
        fullName: updateData.fullName || user.fullName,
        email: updateData.email || user.email,
        wallet_address: walletAddress,
        bio: updateData.bio || user.bio || '',
        avatar: updateData.avatar || user.avatar || null,
        preferences: user.preferences,
        security: user.security,
      };

      // Update UI state immediately for instant feedback
      setUser(optimisticProfile);
      setOriginalUser(optimisticProfile);
      setAvatarPreview(optimisticProfile.avatar);
      setIsEditing(false);

      // Update UserContext immediately
      updateProfile({
        fullName: optimisticProfile.fullName,
        avatar: optimisticProfile.avatar,
      });

      // Update localStorage immediately
      localStorage.setItem('marsPioneers_user', JSON.stringify(optimisticProfile));

      // Show success notification immediately
      showNotification('Profile updated successfully!', 'success');
      setIsLoading(false);

      // Save to database in the background (non-blocking)
      (async () => {
        try {
          // Check for duplicate email if email is being updated
          if (updateData.email) {
            const { data: existingUser } = await supabase
              .from("users")
              .select("id, wallet_address")
              .eq("email", updateData.email)
              .maybeSingle();

            // If email exists and belongs to a different wallet, reject
            if (existingUser && existingUser.wallet_address.toLowerCase() !== walletAddress.toLowerCase()) {
              showNotification('This email is already registered. Please use a different email.', 'error');
              // Revert the optimistic update
              loadUserData();
              return;
            }
          }

          const { data: rows, error } = await supabase
            .from('users')
            .upsert({ ...updateData, wallet_address: walletAddress }, { onConflict: 'wallet_address' })
            .select();

          if (error) {
            console.error('[Profile] Supabase update error:', error);
            // Revert optimistic update on error
            showNotification(`Failed to sync profile: ${error.message}`, 'error');
            return;
          }

          const data = rows?.[0];
          if (data) {
            console.log('[Profile] ✅ Successfully synced to Supabase:', data);

            // Parse JSON fields if they are strings
            let parsedPreferences = data.preferences || user.preferences;
            let parsedSecurity = data.security || user.security;

            if (typeof parsedPreferences === 'string') {
              try {
                parsedPreferences = JSON.parse(parsedPreferences);
              } catch (e) {
                console.warn('[Profile] Failed to parse preferences:', e);
                parsedPreferences = user.preferences;
              }
            }

            if (typeof parsedSecurity === 'string') {
              try {
                parsedSecurity = JSON.parse(parsedSecurity);
              } catch (e) {
                console.warn('[Profile] Failed to parse security:', e);
                parsedSecurity = user.security;
              }
            }

            // Update with actual server response
            const serverProfile: UserProfile = {
              id: data.id || optimisticProfile.id,
              fullName: data.fullName || data.username || optimisticProfile.fullName,
              email: data.email || optimisticProfile.email,
              wallet_address: walletAddress,
              bio: data.bio || optimisticProfile.bio || '',
              avatar: data.avatar || optimisticProfile.avatar || null,
              preferences: parsedPreferences,
              security: {
                lastLogin: data.last_login || optimisticProfile.security?.lastLogin || new Date().toISOString(),
                emailVerification: parsedSecurity?.emailVerification
              },
            };

            // Silently update with server data
            setUser(serverProfile);
            setOriginalUser(serverProfile);
            localStorage.setItem('marsPioneers_user', JSON.stringify(serverProfile));
          }
        } catch (error: any) {
          console.error('[Profile] Exception saving to Supabase:', error);
        }
      })();

    } catch (error) {
      console.error('[Profile] Exception saving user data:', error);
      showNotification('Failed to update profile. Please try again.', 'error');
      setIsLoading(false);
    }
  }, [user, updateProfile, showNotification, globalUser?.id, globalUser?.wallet_address]);

  // Validate form inputs with improved logic
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // UPDATED: Improved validation with stricter character limits
    const trimmedName = user.fullName?.trim() || '';
    if (!trimmedName) {
      errors.fullName = 'Full name is required';
    } else if (trimmedName.length < MIN_NAME_LENGTH) {
      errors.fullName = `Full name must be at least ${MIN_NAME_LENGTH} characters`;
    } else if (trimmedName.length > MAX_NAME_LENGTH) {
      errors.fullName = `Full name must be ${MAX_NAME_LENGTH} characters or less`;
    }

    // UPDATED: Email validation now checks for verification status
    const trimmedEmail = user.email?.trim() || '';
    if (!trimmedEmail) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    } else if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      errors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or less`;
    } else if (emailChanged && !emailVerified) {
      errors.email = 'Please verify your email before saving';
    }

    // UPDATED: Bio validation with stricter limit
    const bioLength = user.bio?.length || 0;
    if (bioLength > MAX_BIO_LENGTH) {
      errors.bio = `Bio must be ${MAX_BIO_LENGTH} characters or less`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [user, emailChanged, emailVerified]);

  // Handle save button click
  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    // Fix: Ensure avatarPreview is used correctly
    const userToSave: UserProfile = {
      ...user,
      avatar: avatarPreview || user.avatar,
    };

    saveUserData(userToSave);
  }, [user, avatarPreview, validateForm, saveUserData]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    // Fix: Reset to original user state safely
    setUser(originalUser);
    setAvatarPreview(originalUser.avatar || null);
    setIsEditing(false);
    setValidationErrors({});
    setEmailVerification({
      isVerifying: false,
      verificationCode: '',
      enteredCode: '',
      newEmail: '',
      error: ''
    });
  }, [originalUser]);

  // Handle avatar image change with improved error handling
  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      // Fix: Reset file input if no file selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      showNotification(`Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 'error');
      // Fix: Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file', 'error');
      // Fix: Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Read and preview image with null safety
    const reader = new FileReader();
    reader.onload = () => {
      // Fix: Safely handle FileReader result
      const result = reader.result;
      if (result && typeof result === 'string') {
        setAvatarPreview(result);
        setIsEditing(true);
      } else {
        showNotification('Failed to read image file', 'error');
      }
      // Fix: Reset file input after successful read
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      showNotification('Error reading image file', 'error');
      // Fix: Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  }, [showNotification]);

  // Handle input field changes - fixed to only accept string fields
  const handleInputChange = useCallback((field: 'fullName' | 'bio', value: string) => {
    // UPDATED: Enforce character limits - prevent typing beyond max length
    let limitedValue = value;

    if (field === 'fullName' && value.length > MAX_NAME_LENGTH) {
      limitedValue = value.slice(0, MAX_NAME_LENGTH);
    } else if (field === 'bio' && value.length > MAX_BIO_LENGTH) {
      limitedValue = value.slice(0, MAX_BIO_LENGTH);
    }

    setUser(prev => ({ ...prev, [field]: limitedValue }));
    setIsEditing(true);

    // Clear validation error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [validationErrors]);

  // Handle preference toggle changes
  const handlePreferenceChange = useCallback((field: keyof UserProfile['preferences'], value: boolean) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
    setIsEditing(true);
  }, []);

  // Generate 6-digit verification code
  const generateVerificationCode = useCallback((): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  // FIXED: Real email sending function (was mock before)
  const sendEmail = useCallback(async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`[Profile] Calling sendVerificationCode with email: "${email}" and code: "${code}"`);

      // Import the actual API function
      const { sendVerificationCode } = await import('../utils/authApi');

      // Call the real Supabase Edge Function
      const result = await sendVerificationCode(email, code);

      console.log(`[Profile] sendVerificationCode result:`, result);

      if (result.success) {
        console.log(`[Profile] ✅ Email sent successfully to: ${email}`);
        return { success: true };
      } else {
        console.error(`[Profile] ❌ Failed to send email:`, result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error(`[Profile] ❌ Exception sending email:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to send verification code' };
    }
  }, []);

  // UPDATED: Handle email input change - now just tracks changes, doesn't auto-verify
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value.trim();

    // Enforce max length
    if (newEmail.length > MAX_EMAIL_LENGTH) return;

    setUser(prev => ({ ...prev, email: newEmail }));
    setIsEditing(true);

    // ADDED: Track if email has been changed from original
    if (newEmail !== originalUser.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailChanged(true);
      setEmailVerified(false);
    } else if (newEmail === originalUser.email) {
      setEmailChanged(false);
      setEmailVerified(true);
      // Reset verification state if email reverted to original
      setEmailVerification({
        isVerifying: false,
        verificationCode: '',
        enteredCode: '',
        newEmail: '',
        error: ''
      });
    }

    // Clear validation error when user starts typing
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [originalUser.email, validationErrors.email]);

  // ADDED: Start email verification when user clicks "Verify Email" button
  const startEmailVerification = useCallback(async () => {
    // Fix: Add null-safety check for user.email
    const newEmail = user.email?.trim();

    // Validate email exists and format before starting verification
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // ADDED: Check resend limits
    const today = new Date().toISOString().split('T')[0];
    const lastResendDate = user.security?.emailVerification?.lastResendDate?.split('T')[0];
    const resendAttempts = user.security?.emailVerification?.resendAttempts || 0;

    if (lastResendDate === today && resendAttempts >= MAX_RESEND_ATTEMPTS) {
      showNotification('You have reached the daily limit for verification code requests.', 'error');
      return;
    }

    const verificationCode = generateVerificationCode();
    setEmailVerification({
      isVerifying: true,
      verificationCode,
      enteredCode: '',
      newEmail,
      error: ''
    });

    // Send verification code
    const result = await sendEmail(newEmail, verificationCode);
    if (result.success) {
      showNotification(`Verification code sent to ${newEmail}`, 'success');

      // ADDED: Update resend attempts in state and save to DB
      const newAttempts = lastResendDate === today ? resendAttempts + 1 : 1;
      const updatedSecurity = {
        ...user.security,
        emailVerification: {
          resendAttempts: newAttempts,
          lastResendDate: new Date().toISOString()
        }
      };

      // Update local state
      setUser(prev => ({ ...prev, security: updatedSecurity }));

      // Save to Supabase immediately to persist count
      // We do a silent update here just for the security field
      const walletAddress = (globalUser?.wallet_address || user.wallet_address || "").toLowerCase();
      if (walletAddress) {
        supabase.from('users').update({
          security: JSON.stringify(updatedSecurity)
        }).ilike('wallet_address', walletAddress).then(({ error }) => {
          if (error) console.error('Failed to update resend attempts:', error);
        });
      }

    } else {
      const errorMessage = result.error || 'Failed to send verification code';
      setEmailVerification(prev => ({ ...prev, error: errorMessage }));
      showNotification(errorMessage, 'error');
    }
  }, [user.email, user.security, user.wallet_address, globalUser?.wallet_address, generateVerificationCode, sendEmail, showNotification]);

  // Handle verification code input change
  const handleVerificationCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and limit to verification code length
    if (/^\d*$/.test(value) && value.length <= VERIFICATION_CODE_LENGTH) {
      setEmailVerification(prev => ({
        ...prev,
        enteredCode: value,
        error: ''
      }));
    }
  }, []);

  // UPDATED: Verify the entered code
  const verifyEmailCode = useCallback(() => {
    // Improved verification logic
    if (!emailVerification.enteredCode || !emailVerification.verificationCode) {
      setEmailVerification(prev => ({ ...prev, error: 'Please enter the verification code' }));
      return;
    }

    if (emailVerification.enteredCode === emailVerification.verificationCode) {
      // UPDATED: Mark email as verified and close verification UI
      setEmailVerified(true);
      setEmailChanged(false);
      setEmailVerification({
        isVerifying: false,
        verificationCode: '',
        enteredCode: '',
        newEmail: '',
        error: ''
      });
      showNotification('Email verified successfully!', 'success');
    } else {
      setEmailVerification(prev => ({ ...prev, error: 'Invalid verification code. Please try again.' }));
    }
  }, [emailVerification.enteredCode, emailVerification.verificationCode, showNotification]);

  // Cancel email verification
  const cancelEmailVerification = useCallback(() => {
    setUser(prev => ({ ...prev, email: originalUser.email }));
    setEmailChanged(false);
    setEmailVerified(true);
    setEmailVerification({
      isVerifying: false,
      verificationCode: '',
      enteredCode: '',
      newEmail: '',
      error: ''
    });
  }, [originalUser.email]);

  // ADDED: Handle disconnect wallet - clears user data and redirects to home
  const handleDisconnect = useCallback(() => {
    // Show confirmation modal instead of immediate disconnect
    setShowDisconnectModal(true);
  }, []);



  // Confirm wallet disconnect and logout
  // Removed duplicate definition - now defined at top of component
  // const confirmDisconnectWallet = ...

  // Copy wallet address to clipboard with error handling
  const copyWalletAddress = useCallback(() => {
    // Fix: Use wallet_address from globalUser or fallback to user state
    const walletAddress = globalUser?.wallet_address || user.wallet_address;
    if (!walletAddress) {
      showNotification('No wallet address to copy', 'error');
      return;
    }

    navigator.clipboard.writeText(walletAddress).then(() => {
      showNotification('Wallet address copied!', 'success');
    }).catch(() => {
      showNotification('Failed to copy wallet address', 'error');
    });
  }, [globalUser?.wallet_address, user.wallet_address, showNotification]);

  // Reset avatar
  const resetAvatar = useCallback(() => {
    // Fix: Safely reset avatar to original
    setAvatarPreview(originalUser.avatar || null);
    setIsEditing(true);
  }, [originalUser.avatar]);

  // Fix: Get safe initial for avatar display
  const getAvatarInitial = useCallback(() => {
    if (!user.fullName || user.fullName.trim().length === 0) {
      return '?';
    }
    return user.fullName.charAt(0).toUpperCase();
  }, [user.fullName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pt-32 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showToast.visible && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border transform transition-all duration-300 ${showToast.type === 'success'
          ? 'bg-green-900/90 border-green-600 text-green-100'
          : 'bg-red-900/90 border-red-600 text-red-100'
          }`}>
          <div className="flex items-center">
            {showToast.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {showToast.message}
          </div>
        </div>
      )}

      {/* Wallet Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Are you sure you want to logout?</h3>
            </div>
            <p className="text-gray-300 mb-6">
              You will be disconnected from your wallet and redirected to the homepage.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmDisconnectWallet}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-gray-400 mt-2">Manage your account preferences and settings</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Avatar Section */}
          <div className="p-8 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => {
                        // Fix: Handle image load errors gracefully
                        setAvatarPreview(null);
                        showNotification('Failed to load avatar image', 'error');
                      }}
                    />
                  ) : user.fullName ? (
                    getAvatarInitial()
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-white">{user.fullName || 'Unknown User'}</h2>
                <p className="text-gray-400 text-sm mt-1">{user.email || 'No email'}</p>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <div className="bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                    <span className="text-xs text-gray-400">Wallet: </span>
                    <span className="text-xs text-orange-400 font-mono">
                      {formattedWalletAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  aria-label="Profile picture upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-200 rounded-lg hover:bg-orange-500/30 transition-colors text-sm font-medium"
                >
                  Change Photo
                </button>
                {avatarPreview && avatarPreview !== originalUser.avatar && (
                  <button
                    onClick={resetAvatar}
                    className="px-4 py-2 bg-gray-600/20 border border-gray-600/40 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-colors text-sm font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="p-8 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={user.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full bg-gray-900/50 border ${validationErrors.fullName ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors`}
                  placeholder="Enter your full name"
                  maxLength={MAX_NAME_LENGTH}
                  aria-describedby={validationErrors.fullName ? "fullName-error" : "fullName-count"}
                />
                {/* ADDED: Character counter for name */}
                <div className="flex justify-between mt-1">
                  {validationErrors.fullName && (
                    <p id="fullName-error" className="text-red-400 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.fullName}
                    </p>
                  )}
                  <p id="fullName-count" className={`text-sm ml-auto ${nameCharacterCount.isAtLimit ? 'text-red-400' :
                    nameCharacterCount.isNearLimit ? 'text-orange-400' : 'text-gray-400'
                    }`}>
                    {nameCharacterCount.count}/{MAX_NAME_LENGTH}
                  </p>
                </div>
              </div>

              {/* Email Input with Verification */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="flex gap-2">
                  <input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    onChange={handleEmailChange}
                    className={`flex-1 bg-gray-900/50 border ${validationErrors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors`}
                    placeholder="Enter your email"
                    maxLength={MAX_EMAIL_LENGTH}
                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                  />
                  {/* ADDED: Verify Email button appears when email is changed */}
                  {emailChanged && !emailVerification.isVerifying && (
                    <button
                      onClick={startEmailVerification}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Verify Email
                    </button>
                  )}
                  {/* ADDED: Show verified checkmark */}
                  {emailVerified && !emailChanged && user.email && (
                    <div className="flex items-center px-3 py-2 bg-green-500/20 border border-green-500/40 rounded-lg">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {validationErrors.email && (
                  <p id="email-error" className="text-red-400 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors.email}
                  </p>
                )}

                {/* UPDATED: Email Verification Section */}
                {emailVerification.isVerifying && (
                  <div className="mt-4 p-4 bg-gray-900/50 border border-orange-500/30 rounded-lg">
                    <p className="text-orange-400 text-sm font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Enter Verification Code
                    </p>
                    <p className="text-gray-400 text-sm mb-3">
                      A 6-digit code was sent to {emailVerification.newEmail}
                    </p>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={emailVerification.enteredCode}
                        onChange={handleVerificationCodeChange}
                        placeholder="000000"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-center text-lg font-mono tracking-widest focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                        maxLength={VERIFICATION_CODE_LENGTH}
                        aria-label="Enter verification code"
                      />
                      <button
                        onClick={verifyEmailCode}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        Confirm Code
                      </button>
                    </div>
                    {/* ADDED: Resend Code Button */}
                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={startEmailVerification}
                        className="text-orange-400 text-sm hover:text-orange-300 transition-colors underline"
                      >
                        Resend Verification Code
                      </button>
                    </div>

                    {emailVerification.error && (
                      <p className="text-red-400 text-sm flex items-center mb-2">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {emailVerification.error}
                      </p>
                    )}
                    <button
                      onClick={cancelEmailVerification}
                      className="text-gray-400 text-sm hover:text-gray-300 transition-colors"
                    >
                      Cancel and revert to original email
                    </button>
                  </div>
                )}
              </div>

              {/* Bio Textarea */}
              <div className="lg:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={user.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className={`w-full bg-gray-900/50 border ${validationErrors.bio ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors resize-none`}
                  placeholder="Tell us about yourself..."
                  maxLength={MAX_BIO_LENGTH}
                  aria-describedby={validationErrors.bio ? "bio-error" : "bio-count"}
                />
                <div className="flex justify-between mt-1">
                  {validationErrors.bio && (
                    <p id="bio-error" className="text-red-400 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.bio}
                    </p>
                  )}
                  <p id="bio-count" className={`text-sm ml-auto ${bioCharacterCount.isAtLimit ? 'text-red-400' :
                    bioCharacterCount.isNearLimit ? 'text-orange-400' : 'text-gray-400'
                    }`}>
                    {bioCharacterCount.count}/{MAX_BIO_LENGTH}
                  </p>
                </div>
              </div>

              {/* Wallet Address Section */}
              <div className="lg:col-span-2">
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Address
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="walletAddress"
                    type="text"
                    value={globalUser?.wallet_address || user.wallet_address || ''}
                    readOnly
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed font-mono text-sm"
                  />
                  <button
                    onClick={copyWalletAddress}
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                    aria-label="Copy wallet address"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {/* UPDATED: Removed the disconnect button from here as requested */}
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="p-8 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Settings
            </h3>

            <div className="space-y-4">
              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive email updates about your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user.preferences?.emailNotifications ?? false}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                    aria-label="Toggle email notifications"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {/* Push Notifications Toggle */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-gray-400 text-sm">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user.preferences?.pushNotifications ?? false}
                    onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                    aria-label="Toggle push notifications"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Information Section */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Security Information
            </h3>

            <div className="space-y-4">
              <div className="py-3 border-b border-gray-700/50">
                <p className="text-white font-medium mb-1">Last Login</p>
                <p className="text-gray-400 text-sm">{formattedLastLogin}</p>
              </div>

              {/* ADDED: Disconnect button under Last Login */}
              <div className="py-3">
                <button
                  onClick={handleDisconnect}
                  className="w-full px-6 py-3 bg-red-900/40 border border-orange-500/40 text-orange-200 rounded-lg hover:bg-red-900/60 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect & Logout
                </button>
                <p className="text-gray-500 text-xs mt-2 text-center">
                  This will clear your data and redirect you to the homepage
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="p-8 bg-gray-900/50 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleCancel}
                disabled={isLoading || !isEditing}
                className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !isEditing || (emailChanged && !emailVerified)}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium relative flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
