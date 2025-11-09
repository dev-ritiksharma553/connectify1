import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering before redirect

  return <>{children}</>;
};

export default ProtectedRoutes;
