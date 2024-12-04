import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewAuthor = () => {
  const { authorId } = useParams(); 
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);

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

  if (!author) {
    return <div>Loading author details...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{author.name}</h2>
      {author.profilePicture && (
        <img src={author.profilePicture} alt={author.name} style={styles.profilePicture} />
      )}
      <div style={styles.bio}>
        <h3>Biography</h3>
        <p>{author.bio || 'No biography available.'}</p>
      </div>
      {author.dateOfBirth && (
        <div style={styles.dateOfBirth}>
          <strong>Date of Birth:</strong> {new Date(author.dateOfBirth).toLocaleDateString()}
        </div>
      )}
      <div style={styles.books}>
        <h3>Books by {author.name}</h3>
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
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  profilePicture: {
    display: 'block',
    margin: '0 auto',
    maxWidth: '200px',
    borderRadius: '50%',
  },
  bio: {
    marginTop: '20px',
  },
  dateOfBirth: {
    marginTop: '10px',
    fontStyle: 'italic',
  },
  books: {
    marginTop: '20px',
  },
  bookLink: {
    color: '#4CAF50',
    textDecoration: 'none',
  },
};

export default ViewAuthor;
