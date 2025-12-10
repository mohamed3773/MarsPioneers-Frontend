// NEW FILE: Protected Route Component
// Wraps routes that require authentication

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * 
 * Usage: Wrap any route that requires authentication
 * 
 * Example in App.tsx:
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  useEffect(() => {
    // Optional: Log authentication checks for debugging
    if (!authenticated) {
      console.log('User not authenticated, redirecting to /auth/email');
    }
  }, [authenticated]);

  if (!authenticated) {
    // Redirect to email auth page, save the attempted location
    return <Navigate to="/auth/email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

