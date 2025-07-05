import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axios';

const RequireAuth = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/auth/verify')
      .then(() => setAuth(true))
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // or a spinner
  return auth ? children : <Navigate to="/auth" replace />;
};

export default RequireAuth;
