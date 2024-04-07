import React from 'react';
import { useNavigate } from 'react-router-dom';


const RequireLogin = ({ children }) => {
  const email = localStorage.getItem('email');
  const navigate=useNavigate();

  if (!email) {
    // Redirect to login route if email is not present
    return navigate('/login');
  }

  return children;
};

export default RequireLogin;
