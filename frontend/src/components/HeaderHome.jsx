import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.userId); 
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserid(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserId(null);
    navigate('/');
  };

  return (
    <header style={headerStyle}>
      <div style={userSectionStyle}>
        {userId ? (
          <div>
            <span style={userNameStyle}>Welcome, {userId}</span>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Log Out
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} style={loginButtonStyle}>
            Log In
          </button>
        )}
      </div>
    </header>
  );
};

// Styles
const headerStyle = {
  padding: '10px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: 1000,
};

const userSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const userNameStyle = {
  fontSize: '16px',
  color: '#333',
};

const loginButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const logoutButtonStyle = {
  ...loginButtonStyle,
  backgroundColor: '#FF5252',
};

export default Header;
