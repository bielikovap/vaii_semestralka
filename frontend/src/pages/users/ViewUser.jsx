import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';

const ViewAccount = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const styles = {
    viewAccount: {

       fontFamily: 'against',
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontFamily: 'against',
      textAlign: 'center',
      fontSize: '2rem',
      color: '#333',
      marginBottom: '20px',
    },
    accountDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    accountItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    errorMessage: {
      color: '#ff4d4f',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.5rem',
      color: '#007bff',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.errorMessage}>{error}</div>;
  }

  return (
    <div style={styles.viewAccount}>
      <Header />
      <h1 style={styles.title}>Account Details</h1>
      {user && (
        <div style={styles.accountDetails}>
          <div style={styles.accountItem}>
            <strong>Username:</strong> <span>{user.username}</span>
          </div>
          <div style={styles.accountItem}>
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div style={styles.accountItem}>
            <strong>First Name:</strong> <span>{user.firstName}</span>
          </div>
          <div style={styles.accountItem}>
            <strong>Last Name:</strong> <span>{user.lastName}</span>
          </div>
          <div style={styles.accountItem}>
            <strong>Role:</strong> <span>{user.role}</span>
          </div>
          <div style={styles.accountItem}>
            <strong>Joined:</strong> <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAccount;
