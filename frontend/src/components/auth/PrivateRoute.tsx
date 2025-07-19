import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Simple token validation - in a real app, you'd verify the JWT token
  const tokenParts = token.split('-');
  if (tokenParts.length !== 3) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 