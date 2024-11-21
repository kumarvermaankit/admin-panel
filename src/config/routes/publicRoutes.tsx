import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth';

const PublicRoute: React.FC = () => {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
