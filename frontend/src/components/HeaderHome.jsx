import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HeaderHome = () => {
  const [userId, setUserId] = useState(null); 
  const [username, setUsername] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userIdFromToken = decodedToken.userId; 
        setUserId(userIdFromToken);
        if (userIdFromToken) {
          fetchUsername(userIdFromToken); 
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserId(null);
        setUsername(null);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUsername(userId); 
    }
  }, [userId]);

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5554/users/${userId}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error('Failed to fetch username:', error);
      setUsername(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserId(null);
    setUsername(null);
    setDropdownVisible(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <header style={headerStyle}>
      <div style={userSectionStyle}>
        {username ? (
          <div style={{ position: 'relative', fontFamily: 'against' }}>
            <span 
              style={userNameStyle} 
              onClick={toggleDropdown}
            >
              Welcome, {username} ▼
            </span>

            {dropdownVisible && (
              <div style={dropdownStyle}>
                <button 
                  style={dropdownItemStyle} 
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
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
  fontFamily: 'against',
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
  cursor: 'pointer',
};

const loginButtonStyle = {
  fontFamily: 'against',
  padding: '8px 16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const buttonStyle = {
  fontFamily: 'against',
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

const dropdownStyle = {
  fontFamily: 'against',
  position: 'absolute',
  top: '100%',
  right: '0',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',
  overflow: 'hidden',
  zIndex: 1000,
};

const dropdownItemStyle = {
  fontFamily: 'against',
  padding: '10px 20px',
  backgroundColor: '#fff',
  color: '#333',
  border: 'none',
  textAlign: 'left',
  width: '100%',
  cursor: 'pointer',
};

export default HeaderHome;
