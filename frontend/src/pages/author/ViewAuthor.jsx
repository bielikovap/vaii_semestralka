import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ViewAuthor = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/authors/${authorId}`);
        setAuthor(response.data);
        setBooks(response.data.books || []);
      } catch (error) {
        console.error('Error fetching author details', error);
        alert('Failed to fetch author details. Please try again.');
      }
    };

    fetchAuthorDetails();
  }, [authorId]);

  const handleEdit = () => {
    navigate(`/edit-author/${authorId}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this author?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5554/authors/${authorId}`);
        navigate('/authors'); 
      } catch (error) {
        console.error('Error deleting author', error);
        alert('Failed to delete author. Please try again.');
      }
    }
  };

  if (!author) {
    return <div>Loading author details...</div>;
  }

  return (
    <div style={styles.detailsContainer}>
      <header style={header}>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </header>
      <div style={styles.imageContainer}>
        {author.profilePicture && (
          <img
            src={author.profilePicture}
            alt={author.name}
            style={styles.profilePicture}
          />
        )}
        <div style={styles.buttonContainer}>
          <button onClick={handleEdit} style={styles.editButton}>
            Edit Author
          </button>
          <button onClick={handleDelete} style={styles.deleteButton}>
            Delete Author
          </button>
        </div>
      </div>
      <div style={styles.infoContainer}>
        <h2 style={{ ...styles.header, fontWeight: 'bold' }}>{author.name}</h2>
        <div style={styles.bio}>
          <h3 style={{ fontWeight: 'bold' }}>Biography</h3>
          <p>{author.bio || 'No biography available.'}</p>
        </div>
        {author.dateOfBirth && (
          <div style={styles.dateOfBirth}>
            <strong>Date of Birth:</strong> {new Date(author.dateOfBirth).toLocaleDateString()}
          </div>
        )}
        <div style={styles.books}>
          <h3 style={{ fontWeight: 'bold' }}>Books by {author.name}</h3>
          {books.length > 0 ? (
            <ul>
              {books.map((book) => (
                <li key={book._id}>
                  <a href={`/books/${book._id}`} style={styles.bookLink}>
                    {book.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No books found for this author.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
  },
  imageContainer: {
    flex: 1,
    maxWidth: '33.33%',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '70px',
    flexDirection: 'column', 
  },
  profilePicture: {
    maxWidth: '100%',
    height: '400px',
    width: 'auto',
    borderRadius: '8px',
  },
  buttonContainer: {
    marginTop: '15px', 
    display: 'flex',
    flexDirection: 'row',
    gap: '8px', 
  },
  editButton: {
    padding: '8px 16px',  
    fontSize: '14px',
    color: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  deleteButton: {
    padding: '8px 16px',  
    fontSize: '14px', 
    color: '#f44336',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  infoContainer: {
    flex: 2,
    maxWidth: '66.66%',  
    display: 'flex',
    flexDirection: 'column',
    marginTop: '70px',
  },
  header: {
    textAlign: 'left',
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  bookLink: {
    textDecoration: 'none',
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

export default ViewAuthor;
