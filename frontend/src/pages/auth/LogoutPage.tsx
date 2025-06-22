import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    Cookies.remove('auth');
  }, [logout]);
  return <Navigate to="/login" replace />;
};

export default LogoutPage;
