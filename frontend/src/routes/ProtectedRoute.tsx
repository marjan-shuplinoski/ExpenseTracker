import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Cookies from 'js-cookie';

const ProtectedRoute: React.FC = () => {
  const auth = React.useContext(AuthContext);
  const location = useLocation();

  // Debug: log every route access
  // eslint-disable-next-line no-console
  console.log(`ProtectedRoute: requested: ${location.pathname}${location.search}`);

  if (!auth?.user && Cookies.get('auth')) {
    // If cookie exists but no user, reload to trigger AuthProvider effect
    // eslint-disable-next-line no-console
    console.log('ProtectedRoute: Cookie exists but no user, reloading...');
    window.location.reload();
    return null;
  }

  if (!auth?.user) {
    // eslint-disable-next-line no-console
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    // Redirect to login with intended path for post-login redirect
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  // eslint-disable-next-line no-console
  console.log('ProtectedRoute: Authenticated, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;
