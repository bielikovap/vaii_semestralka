import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5554/books');
        setBooks(response.data.data);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  const bookCardStyle = {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  };

  const imgStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    transition: 'transform 0.3s ease',
  };

  return (
    <div
      style={{
        padding: '10px',
        marginTop: '0',
        height: 'auto',
        minHeight: '100vh', // Ensure the container takes full height of the viewport
        display: 'block', // Default block-level layout (no flexbox)
        paddingTop: '20px', // Add some top padding to the first element if needed
      }}
    >
      <h1 style={{ margin: '0' }}>Book Library</h1>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            marginTop: '20px', // Adds space between the header and the cards
          }}
        >
          {books.map((book) => (
            <div
              key={book._id}
              style={bookCardStyle}
              onClick={() => navigate(`/books/${book._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              }}
            >
              <img
                src={book.bookCover}
                alt={book.title}
                style={imgStyle}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
