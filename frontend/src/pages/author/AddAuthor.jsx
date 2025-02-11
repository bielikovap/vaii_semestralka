import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import sanitize from 'mongo-sanitize';


const AddAuthor = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token')); 
   const [userId, setUserId] = useState('');


   useEffect(() => { 
      const checkAdmin = () => { 
        if (!token) { 
          //console.error('not logged in'); 
          alert('You do not have access to this page'); 
          navigate('/login');
          return;
        }
          
        let decodedToken; try { decodedToken = JSON.parse(atob(token.split('.')[1])); } catch (error) { console.error('Invalid token', error); alert('You do not have access to this page'); navigate('/'); return; }
          console.log('Decoded Token:', decodedToken);
          if (decodedToken.role !== 'admin') { 
            console.error('not an admin'); 
            alert('You do not have access to this page'); 
            navigate('/');
            } else { 
               setUserId(decodedToken.userId);
            } }; 
            checkAdmin(); 
          }, 
          
      [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const authorData = {
      name: name.trim(),
      bio: bio.trim(),
      dateOfBirth: new Date(dateOfBirth).toISOString(),
      profilePicture: profilePicture
    };

    try {
      const response = await axios.post('http://localhost:5554/authors', authorData);
      if (response.status === 201) {
        navigate('/authors');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to add author');
    }
  };

  const handleNavigation = (path) => {
    const confirmation = window.confirm('You must be an admin to access this page. Do you want to continue?');
    if (confirmation) {
      navigate(path);
    }
  };

  

  return (
    <div style={styles.container}>
      <Header/>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ ...styles.header, marginTop: "50px", fontFamily: 'against', }}>Add New Author</h2>
        <div style={styles.inputContainer}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Biography:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Profile Picture URL:</label>
          <input
            type="url"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Adding Author...' : 'Add Author'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    minHeight: '100px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

const header = {
  padding: '10px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: 1000,
  gap: '15px',
};

export default AddAuthor;
