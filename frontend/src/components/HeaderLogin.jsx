import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const HeaderLogin = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const headerStyle = {
    backgroundColor: '#734f96',
    padding: '2px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  const sectionStyle = {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '6px 16px',
    borderRadius: '4px',
    fontFamily: 'against',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#734f96',
    borderRadius: '4px',
    minWidth: '150px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1000,
  };

  const dropdownItemStyle = {
    color: '#fff',
    padding: '10px 15px',
    display: 'block',
    textDecoration: 'none',
    fontFamily: 'against',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  };

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5554/users/${userId}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error('Failed to fetch username:', error);
      setUsername(null);
    }
  };

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

  return (
    <header style={headerStyle}>
      <div style={sectionStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
      </div>
    </header>
  );
};

export default HeaderLogin;