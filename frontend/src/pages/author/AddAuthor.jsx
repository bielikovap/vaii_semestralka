import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAuthor = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('profilePicture', profilePictureUrl); 

    try {
      await axios.post('http://localhost:5554/authors', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Author added successfully!');
      navigate('/authors'); 
    } catch (error) {
      console.error('Error adding author', error);
      alert('Failed to add author. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={header}>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </header>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ ...styles.header, marginTop: "50px" }}>Add New Author</h2>
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
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
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
