import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sanitize from 'mongo-sanitize';
import Header from '../../components/Header';


const EditAuthor = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState({
    name: '',
    bio: '',
    profilePicture: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        console.log("Author ID from URL:", id);
        const response = await axios.get(`http://localhost:5554/authors/${id}`);
        const sanitizedData = {
          name: sanitize(response.data.name),
          bio: sanitize(response.data.bio),
          profilePicture: sanitize(response.data.profilePicture),
        };
        setAuthor(sanitizedData);
      } catch (err) {
        setError('Failed to fetch author details. Please try again later.');
        console.error('Error fetching author details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitize(value);
    setAuthor((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));
  };

  const validateFields = () => {
    if (!author.name.trim()) {
      return 'Name is required.';
    }
    if (!author.bio.trim()) {
      return 'Bio is required.';
    }
    if (!author.profilePicture.trim() || !isValidURL(author.profilePicture)) {
      return 'Please provide a valid profile picture URL.';
    }
    return '';
  };

  const isValidURL = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      setShowModal(true);
      return;
    }

    try {
      const sanitizedAuthor = {
        name: sanitize(author.name),
        bio: sanitize(author.bio),
        profilePicture: sanitize(author.profilePicture),
      };
      await axios.put(`http://localhost:5554/authors/${id}`, sanitizedAuthor);
      navigate(`/authors/${id}`); 
    } catch (err) {
      setError('Failed to update author details. Please try again.');
      setShowModal(true);
      console.error('Error updating author:', err.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  if (loading) return <p>Loading...</p>;
  if (error && !showModal) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container" style={containerStyle}>
      <Header/>
      <h1 style={headingStyle}>Edit Author</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            name="name"
            value={author.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            value={author.bio}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Profile Picture URL</label>
          <input
            type="text"
            name="profilePicture"
            value={author.profilePicture}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="submit" style={submitButtonStyle}>
          Update Author
        </button>
      </form>

      {showModal && (
        <div style={modalBackdropStyle}>
          <div style={modalStyle}>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={closeModal} style={modalButtonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  marginTop: '50px',
  padding: '20px',
  maxWidth: '100%',
  width: '100%',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const backButtonStyle = {
  padding: '8px 16px',
  fontSize: '16px',
  color: '#4CAF50',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'underline',
  marginBottom: '20px',
};

const headingStyle = {
  textAlign: 'center',
  fontFamily: 'against',
  color: '#333',
};

const formStyle = {
  fontFamily: 'against',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box',
};

const textareaStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  minHeight: '120px',
  width: '100%',
  boxSizing: 'border-box',
};

const submitButtonStyle = {
  padding: '12px 20px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  width: '100%',
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

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1001,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
  textAlign: 'center',
};

const modalButtonStyle = {
  padding: '8px 16px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};

export default EditAuthor;
