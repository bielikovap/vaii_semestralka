import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const HeaderHome = () => {
  const [userId, setUserId] = useState(null); 
  const [username, setUsername] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
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
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      {username ? (
        <div 
          style={styles.userMenu}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span style={styles.welcome}>Welcome, {username}</span>
          {showDropdown && (
            <div style={styles.dropdown}>
              <Link to={`/users/${userId}`} style={styles.dropdownItem}>
                My Profile
              </Link>
              <button 
                onClick={handleLogout} 
                style={styles.dropdownItem}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => navigate('/login')} style={styles.loginButton}>
          Login
        </button>
      )}
    </header>
  );
};

const styles = {
  header: {
    fontFamily: 'against',
    padding: '10px',
    //backgroundColor: '#f0f0f0',
    backgroundColor: '#734f96',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 1000,
    color: 'white'
    },
  userMenu: {
    position: 'relative',
    cursor: 'pointer',
  },
  welcome: {
    fontFamily: 'against',
    color: 'white',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 1000,
    minWidth: '150px',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    fontFamily: 'against',
    color: '#333',
    textDecoration: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
  },
  loginButton: {
    fontFamily: 'against',
    padding: '8px 16px',
    backgroundColor: '#DFC5FE',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default HeaderHome;
