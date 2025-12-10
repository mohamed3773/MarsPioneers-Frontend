// NEW FILE: Authentication routes component
// Import this in your App.tsx without modifying existing routes

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthEmail from './AuthEmail';
import AuthCode from './AuthCode';

/**
 * Authentication Routes Component
 * 
 * Add these routes to your App.tsx like this:
 * 
 * import AuthRoutes from './components/auth/AuthRoutes';
 * 
 * Then inside your <Routes> component, add:
 * <Route path="/auth/*" element={<AuthRoutes />} />
 * 
 * This keeps your existing routes intact while adding new auth routes.
 */
const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/email" element={<AuthEmail />} />
      <Route path="/code" element={<AuthCode />} />
    </Routes>
  );
};

export default AuthRoutes;

