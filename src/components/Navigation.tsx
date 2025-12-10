import { useState, useEffect } from 'react';
import { Menu, X, Rocket, Bell, Wallet } from 'lucide-react'; // Added Wallet icon for address display
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { supabase } from '../supabaseClient';
import { Link } from "react-router-dom";
import { useUser } from './UserContext'; // Fix: Import UserContext to get global avatar/username

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  // Fix: Track if avatar failed to load so we can show fallback initial
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notifications - will be replaced with real data later
  const notifications: any[] = [];

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // Fix: Get profile data from UserContext for global avatar/username display
  const { profileData, user, loading } = useUser();

  const navLinks = [
    { label: 'Home', href: '/', isRoute: true },
    { label: 'NFT Collection', href: '/#nft-collection', isRoute: true },
    { label: 'Lore', href: '/#lore', isRoute: true },
    { label: 'Community', href: '/#community', isRoute: true },
    { label: 'OpenSea', href: 'https://opensea.io/0x0a9037401fd7fa6c0937c89a5d504ddb684c4be8', isRoute: false, external: true },
  ];

  const isUserConnected = isConnected || !!supabaseUser || !!user;

  const handleWeb3Login = () => {
    if (isConnected) {
      disconnect();
      return;
    }
    openConnectModal?.();
  };

  useEffect(() => {
    const saveUser = async () => {
      if (!isConnected || !address) return;

      try {
        const normalizedAddress = address.toLowerCase();

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("wallet_address", normalizedAddress)
          .single();

        if (existingUser) {
          console.log("User already exists, skipping creation:", normalizedAddress);
          return;
        }

        // User does not exist, proceed with signature and creation
        const message =
          "Welcome to MarsPioneers 2040!\nSign this message to verify wallet ownership.";

        const signature = await signMessageAsync({ message });

        // Insert new user with empty defaults
        const { error } = await supabase.from("users").insert({
          wallet_address: normalizedAddress,
          signature,
          fullName: '',
          bio: '',
          email: null,
          avatar: null,
          preferences: JSON.stringify({
            emailNotifications: true,
            pushNotifications: false,
          }),
          security: JSON.stringify({}),
          last_login: new Date().toISOString()
        });

        if (error) {
          console.error("Error creating user:", error);
        } else {
          console.log("New user created in Supabase:", normalizedAddress);
        }
      } catch (error) {
        console.error("Error in saveUser flow:", error);
      }
    };

    saveUser();
  }, [isConnected, address, signMessageAsync]); // Fix: Added signMessageAsync to deps

  useEffect(() => {
    const fetchSupabaseUser = async () => {
      const { data } = await supabase.auth.getUser();
      setSupabaseUser(data.user ?? null);
    };

    fetchSupabaseUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isUserConnected) {
      setUsername('');
      return;
    }

    // Fix: Use fullName from UserContext first (updated from Profile page)
    if (profileData.fullName) {
      setUsername(profileData.fullName);
      return;
    }

    const supabaseName =
      supabaseUser?.user_metadata?.username ||
      supabaseUser?.user_metadata?.name ||
      supabaseUser?.email;

    if (supabaseName) {
      setUsername(supabaseName);
      return;
    }

    if (address) {
      setUsername(`${address.slice(0, 6)}...${address.slice(-4)}`);
      return;
    }

    setUsername('Pioneer');
  }, [supabaseUser, address, isUserConnected, profileData.fullName]);

  const avatarInitial = username ? username.charAt(0).toUpperCase() : 'M';

  // Fix: Reset avatar load error when avatar URL changes
  useEffect(() => {
    setAvatarLoadError(false);
  }, [profileData.avatar]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showNotifications && !target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#FF4500]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 nav-container">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Rocket className="w-7 h-7 text-[#FF4500]/80" />
            <span className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
              Mars<span className="text-[#FF4500]">Pioneers</span>
              <span className="text-[#FF4500] text-sm font-semibold">2040</span>
            </span>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white/80 hover:text-[#FF4500] transition-colors duration-300 text-sm font-medium tracking-wide"
                >
                  {link.label}
                </Link>
              ) : link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#FF4500] transition-colors duration-300 text-sm font-medium tracking-wide"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white/80 hover:text-[#FF4500] transition-colors duration-300 text-sm font-medium tracking-wide cursor-pointer"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* CONNECT BUTTON / USER INFO */}
          <div className="flex items-center gap-4">
            {!isUserConnected && (
              <button
                onClick={handleWeb3Login}
                className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-semibold rounded-lg hover:shadow-md hover:shadow-[#FF4500]/20 transition-all duration-300 transform hover:scale-105 connect-wallet-btn"
              >
                Connect Wallet
              </button>
            )}

            {isUserConnected && (
              <div className="hidden lg:flex items-center gap-4 user-info-desktop">
                <div className="relative notifications-dropdown">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors duration-300 text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[340px] bg-[#0D0D0D] backdrop-blur-xl border border-[#FF4500]/20 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden animate-fade-scale">
                      <div className="px-5 py-4 border-b border-[#FF4500]/10 bg-gradient-to-r from-[#FF4500]/5 to-transparent">
                        <h3 className="text-white font-bold text-sm tracking-wide">Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF4500]/10 to-[#FF1E56]/10 border border-[#FF4500]/20 flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-7 h-7 text-[#FF4500]/60" />
                          </div>
                          <p className="text-gray-400 text-sm font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.map((notif, index) => (
                            <div
                              key={index}
                              className="px-5 py-4 border-b border-[#FF4500]/5 hover:bg-[#FF4500]/5 transition-all duration-200 cursor-pointer group"
                              onClick={() => setShowNotifications(false)}
                            >
                              <p className="text-white text-sm font-medium group-hover:text-[#FF4500]/90 transition-colors">{notif.message}</p>
                              <p className="text-gray-500 text-xs mt-1.5">{notif.time}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {loading && isUserConnected ? (
                  // Loading skeleton
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-20 h-3 bg-white/10 rounded animate-pulse"></div>
                      <div className="w-24 h-2.5 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <Link to="/dashboard" replace className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C2C3E] to-[#1F1F2E] flex items-center justify-center shadow-sm overflow-hidden">
                      {profileData.avatar && !avatarLoadError ? (
                        <img
                          src={profileData.avatar}
                          alt={username || 'User'}
                          className="w-full h-full object-cover"
                          onError={() => {
                            setAvatarLoadError(true);
                          }}
                        />
                      ) : (
                        <img
                          src="/default-avatar.png"
                          alt={username || 'User'}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="max-w-[140px] truncate text-white/90 text-sm font-semibold">
                        {username}
                      </span>
                      {address && (
                        <div className="flex items-center gap-1 text-white/50 text-xs">
                          <Wallet className="w-3 h-3" />
                          <span className="font-mono">
                            {`${address.slice(0, 6)}...${address.slice(-4)}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed top-20 left-0 right-0 z-[9999] bg-[#1A1A1A] border-t border-[#FF4500]/20 shadow-xl animate-slideDown lg:hidden">
          <div className="px-4 py-6 space-y-4">

            {isUserConnected && (
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
                <Link
                  to="/dashboard"
                  replace
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 flex-1"
                >
                  {/* UPDATED: Reduced shadow intensity for mobile menu too */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C2C3E] to-[#1F1F2E] flex items-center justify-center shadow-sm overflow-hidden">
                    {profileData.avatar && !avatarLoadError ? (
                      <img
                        src={profileData.avatar}
                        alt={username || 'User'}
                        className="w-full h-full object-cover"
                        onError={() => {
                          // Fix: Update state to trigger fallback to initial character
                          setAvatarLoadError(true);
                        }}
                      />
                    ) : (
                      <img
                        src="/default-avatar.png"
                        alt={username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {/* UPDATED: Added wallet address display in mobile menu */}
                  <div className="flex flex-col">
                    <span className="max-w-[140px] truncate text-white/90 text-sm font-semibold">
                      {username}
                    </span>
                    {/* ADDED: Wallet address with icon in mobile menu */}
                    {address && (
                      <div className="flex items-center gap-1 text-white/50 text-xs">
                        <Wallet className="w-3 h-3" />
                        <span className="font-mono">
                          {`${address.slice(0, 6)}...${address.slice(-4)}`}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="relative notifications-dropdown">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors duration-300 text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[340px] bg-[#0D0D0D]/98 backdrop-blur-xl border border-[#FF4500]/20 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden animate-fade-scale">
                      <div className="px-5 py-4 border-b border-[#FF4500]/10 bg-gradient-to-r from-[#FF4500]/5 to-transparent">
                        <h3 className="text-white font-bold text-sm tracking-wide">Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF4500]/10 to-[#FF1E56]/10 border border-[#FF4500]/20 flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-7 h-7 text-[#FF4500]/60" />
                          </div>
                          <p className="text-gray-400 text-sm font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.map((notif, index) => (
                            <div
                              key={index}
                              className="px-5 py-4 border-b border-[#FF4500]/5 hover:bg-[#FF4500]/5 transition-all duration-200 cursor-pointer group"
                              onClick={() => setShowNotifications(false)}
                            >
                              <p className="text-white text-sm font-medium group-hover:text-[#FF4500]/90 transition-colors">{notif.message}</p>
                              <p className="text-gray-500 text-xs mt-1.5">{notif.time}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white/80 hover:text-[#FF4500] transition-colors duration-300 py-2 text-left"
                >
                  {link.label}
                </Link>
              ) : link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white/80 hover:text-[#FF4500] transition-colors duration-300 py-2 text-left"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    // Only prevent default and scroll for hash-only links (e.g., #section)
                    // Allow normal navigation for full paths (e.g., /)
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }
                    setIsMenuOpen(false);
                  }}
                  className="block text-white/80 hover:text-[#FF4500] transition-colors duration-300 py-2 text-left cursor-pointer"
                >
                  {link.label}
                </a>
              )
            ))}

            {!isUserConnected && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleWeb3Login();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-semibold rounded-lg hover:shadow-md hover:shadow-[#FF4500]/20 transition-all duration-300"
              >
                Connect Wallet
              </button>
            )}


          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-scale {
          animation: fadeScale 0.2s ease-out forwards;
        }

        /* Fix for Chrome: Force display of user info */
        @media (min-width: 1024px) {
          .user-info-desktop {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        }

        /* Fix for Chrome: Remove any clipping or overflow issues */
        .nav-container {
          overflow: visible !important;
          transform: none !important;
        }

        /* Ensure all child elements are visible in Chrome */
        .nav-container * {
          backface-visibility: visible !important;
          -webkit-backface-visibility: visible !important;
        }

        /* Fix for Chrome: Force display of Connect Wallet button */
        @media (min-width: 768px) {
          .connect-wallet-btn {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </nav>
  );
}
