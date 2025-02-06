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
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
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

    if (!author.name.trim() || !author.bio.trim()) {
      setError('Name and bio are required.');
      setShowModal(true);
      return;
    }

    try {
      // First update the basic author information
      const response = await axios.patch(`http://localhost:5554/authors/${id}`, {
        name: author.name,
        bio: author.bio
      });

      // If there's a new image, update it separately
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        await axios.patch(`http://localhost:5554/authors/${id}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      navigate(`/authors/${id}`);
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update author details. Please try again.');
      setShowModal(true);
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
          <label style={labelStyle}>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={fileInputStyle}
          />
          {(previewUrl || author.profileImage) && (
            <div style={imagePreviewStyle}>
              <img
                src={previewUrl || author.profilePicture}
                alt="Profile preview"
                style={previewImageStyle}
              />
            </div>
          )}
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

const fileInputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box'
};

const imagePreviewStyle = {
  marginTop: '10px',
  width: '200px',
  height: '200px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  overflow: 'hidden'
};

const previewImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
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
