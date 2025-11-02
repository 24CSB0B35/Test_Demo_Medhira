import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requireEmailVerification = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Allow access but show banner if email not verified
  if (requireEmailVerification && !user.emailVerified) {
    // You can choose to redirect to a verification page or just show a banner
    // For now, we'll allow access but show the banner in Dashboard
    return children;
  }

  return children;
};

export default ProtectedRoute;
