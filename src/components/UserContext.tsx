import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '../supabaseClient';

// User type matching Supabase schema
export interface User {
  id: string;
  wallet_address: string;
  fullName: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  preferences: any;
  security: any;
  last_login: string;
  role?: string;
  created_at?: string;
  xp?: number;
  level?: number;
}

// Profile data for local storage (used by Profile page)
export interface ProfileData {
  fullName: string;
  avatar: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: (walletAddress?: string) => Promise<void>;
  clearUser: () => void;
  // Fix: Add profile data and update function for global avatar/username sync
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Fix: Initialize user state directly from localStorage to avoid delay
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('marsPioneers_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing saved user:', error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const { address, isConnected, status } = useAccount();

  // Fix: Initialize profile data directly from localStorage
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    try {
      const savedUser = localStorage.getItem('marsPioneers_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        return {
          fullName: parsedUser.fullName || '',
          avatar: parsedUser.avatar || null,
        };
      }
    } catch (error) {
      console.error('Error parsing saved profile data:', error);
    }
    return { fullName: '', avatar: null };
  });



  // Ensure user exists in Supabase before fetching/updating
  const ensureUserExists = async (walletAddress: string): Promise<boolean> => {
    try {
      // Normalize wallet address to lowercase
      const normalized = walletAddress?.toLowerCase();

      // Check if user exists - get all matching rows to handle duplicates
      const { data: rows, error: checkError } = await supabase
        .from('users')
        .select('*')
        .ilike('wallet_address', normalized);

      if (checkError) {
        console.error('[UserContext] Error checking user existence:', checkError);
        return false;
      }

      // If any rows exist (even duplicates), user already exists - return true
      if (rows && rows.length >= 1) {
        console.log(`[UserContext] User already exists (found ${rows.length} row(s))`);
        return true;
      }

      // User doesn't exist, create new user with default values
      console.log('[UserContext] User not found, creating new user:', normalized);

      const defaultFullName = '';
      const newUserData: any = {
        wallet_address: normalized,
        fullName: defaultFullName,
        username: defaultFullName,
        email: null,
        bio: '',
        avatar: null,
        preferences: JSON.stringify({
          emailNotifications: true,
          pushNotifications: false,
        }),
        security: JSON.stringify({}),
        last_login: new Date().toISOString(),
      };

      console.log('[UserContext] INSERT user with data:', newUserData);

      const { error: insertError } = await supabase
        .from('users')
        .insert(newUserData);

      if (insertError) {
        console.error('[UserContext] Error creating user:', insertError);
        return false;
      }

      console.log('[UserContext] ✅ Successfully created new user in Supabase');
      return true;
    } catch (error) {
      console.error('[UserContext] Exception in ensureUserExists:', error);
      return false;
    }
  };

  // Fetch user data from Supabase
  const fetchUser = async (walletAddress: string) => {
    try {
      // Normalize wallet address to lowercase
      const normalized = walletAddress?.toLowerCase();

      // Ensure user exists before fetching
      const userExists = await ensureUserExists(normalized);
      if (!userExists) {
        console.error('[UserContext] Failed to ensure user exists');
        return null;
      }

      // Get all matching rows and always return the first one
      const { data: rows, error } = await supabase
        .from('users')
        .select('*')
        .ilike('wallet_address', normalized);

      if (error) {
        console.error('[UserContext] Error fetching user:', error);
        return null;
      }

      if (!rows || rows.length === 0) {
        console.error('[UserContext] No user data returned');
        return null;
      }

      // Always pick the first record
      const userRecord = rows[0];
      console.log(`[UserContext] Fetched user data (using first of ${rows.length} row(s)):`, userRecord);

      // Parse JSON fields if they are strings
      let parsedPreferences = userRecord.preferences;
      let parsedSecurity = userRecord.security;

      if (typeof userRecord.preferences === 'string') {
        try {
          parsedPreferences = JSON.parse(userRecord.preferences);
        } catch (e) {
          console.warn('[UserContext] Failed to parse preferences:', e);
          parsedPreferences = { emailNotifications: true, pushNotifications: false };
        }
      }

      if (typeof userRecord.security === 'string') {
        try {
          parsedSecurity = JSON.parse(userRecord.security);
        } catch (e) {
          console.warn('[UserContext] Failed to parse security:', e);
          parsedSecurity = {};
        }
      }

      // Map Supabase columns to User interface - always preserve id
      const mappedUser: User = {
        id: userRecord.id || '',
        wallet_address: userRecord.wallet_address,
        fullName: userRecord.fullName || userRecord.username || '',
        username: userRecord.username || userRecord.fullName || '',
        email: userRecord.email || null,
        bio: userRecord.bio || null,
        avatar: userRecord.avatar || null,
        preferences: parsedPreferences,
        security: parsedSecurity,
        last_login: userRecord.last_login || new Date().toISOString(),
        role: userRecord.role,
        created_at: userRecord.created_at,
        xp: userRecord.xp,
        level: userRecord.level,
      };

      // Update last_login timestamp - find user by ID first, then update by ID
      const { data: idRows } = await supabase
        .from('users')
        .select('id')
        .ilike('wallet_address', normalized);

      if (idRows && idRows.length > 0) {
        const userId = idRows[0].id;
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId);
      }

      console.log('[UserContext] Mapped user:', mappedUser);
      return mappedUser;
    } catch (error) {
      console.error('Error in fetchUser:', error);
      return null;
    }
  };

  // Refresh user data manually
  const refreshUser = async (walletAddress?: string, forceRefresh: boolean = false) => {
    const normalized = walletAddress || address?.toLowerCase();

    if (!normalized || !isConnected) {
      return; // Don't clear user data, just exit
    }

    // Always show loading when forcing a refresh (e.g., on login)
    if (forceRefresh) {
      setLoading(true);
    }

    const userData = await fetchUser(normalized);

    // Always set user with id - never overwrite existing id if userData is null
    if (userData) {
      // Immediately update state to show profile data without delay
      setUser(userData);

      // IMMEDIATELY update profileData when user data is refreshed from Supabase
      const newProfileData = {
        fullName: userData.fullName || userData.username || '',
        avatar: userData.avatar || null,
      };
      setProfileData(newProfileData);

      // Also update localStorage to keep it in sync - always preserve id
      try {
        // Always save fresh data on login to prevent stale cache
        localStorage.setItem('marsPioneers_user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error updating localStorage after refresh:', error);
      }
    }

    setLoading(false);
  };

  // Clear user data on logout
  const clearUser = () => {
    setUser(null);
    setProfileData({
      fullName: '',
      avatar: null,
    });
    localStorage.removeItem('marsPioneers_user');
  };

  // Fix: Update profile data globally and persist to localStorage
  const updateProfile = (data: Partial<ProfileData>) => {
    setProfileData((prev) => {
      const updated = { ...prev, ...data };

      // Persist the updated profile data to localStorage
      try {
        const savedUser = localStorage.getItem('marsPioneers_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const updatedUser = {
            ...parsedUser,
            wallet_address: parsedUser.wallet_address || user?.wallet_address,
            fullName: updated.fullName,
            avatar: updated.avatar,
          };
          localStorage.setItem('marsPioneers_user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }

      return updated;
    });
  };

  // Auto-fetch user when wallet connects
  useEffect(() => {
    // Fix: Prevent clearing user data while wallet is reconnecting on page load
    if (status === 'reconnecting' || status === 'connecting') {
      return;
    }

    // Only refresh if we have a valid connection
    if (isConnected && address) {
      const normalized = address.toLowerCase();

      // Force immediate refresh on login to prevent delay
      // Check if this is a new login (wallet address changed)
      const isNewLogin = !user || user.wallet_address.toLowerCase() !== normalized;

      if (isNewLogin) {
        console.log('[UserContext] New login detected, forcing immediate refresh');
        // Clear any stale cached data
        setUser(null);
        setProfileData({ fullName: '', avatar: null });
      }

      // Always force refresh on connection to get latest data
      refreshUser(normalized, true);
    }
  }, [isConnected, address, status]);

  // ADDED: Listen for storage events to clear user state on logout
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
      // Check if it's a storage event for our key, or a custom event
      if (
        (e instanceof StorageEvent && e.key === 'marsPioneers_user' && e.newValue === null) ||
        (e.type === 'storage' && !localStorage.getItem('marsPioneers_user'))
      ) {
        console.log('[UserContext] Detected logout via storage event, clearing state');
        setUser(null);
        setProfileData({
          fullName: '',
          avatar: null,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        clearUser,
        profileData,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
