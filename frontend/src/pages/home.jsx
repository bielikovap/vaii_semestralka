import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch books and authors data
  useEffect(() => {
    const fetchBooksAndAuthors = async () => {
      try {
        const booksResponse = await axios.get('http://localhost:5554/books');
        setBooks(booksResponse.data.data.slice(0, 7)); 
        const authorsResponse = await axios.get('http://localhost:5554/authors');
        setAuthors(authorsResponse.data.slice(0, 7)); 
      } catch (err) {
        setError('Failed to fetch books or authors. Please try again later.');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndAuthors();
  }, []);

  if (loading) return <p>Loading books and authors...</p>;
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

  const authorCardStyle = {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // ensures the card takes full height
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center', 
    marginTop: '20px',
    justifyContent: 'flex-start', 
  };

  const tinyButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#734f96',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '5px',
  };

  const deleteButtonStyle = {
    ...tinyButtonStyle,
    backgroundColor: '#E74C3C',
  };

  return (
    <div
      style={{
        padding: '10px',
        marginTop: '0',
        height: 'auto',
        minHeight: '100vh',
        display: 'block',
        paddingTop: '20px',
      }}
    >
      <h1 style={{ margin: '0', fontSize: '30px', fontWeight: 'bold' }}>BookCorner</h1>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Recently added books:</h2>

      {/* Books Section */}
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            marginTop: '5px',
          }}
        >
          {books.map((book) => (
            <div
              key={book._id}
              style={bookCardStyle}
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <img src={book.bookCover} alt={book.title} style={imgStyle} />
              <div style={{ marginTop: '5px' }}>
                <h3>{book.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book-related Buttons */}
      <div style={buttonContainerStyle}>
        <button
          onClick={() => navigate('/add-book')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#734f96',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add Book
        </button>
        <button
          onClick={() => navigate('/books')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#B47EE5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          View All Books
        </button>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: "10px"}}>Recently added authors:</h2>

      {/* Authors Section */}
      {authors.length === 0 ? (
        <p>No authors available</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            marginTop: '5px',
          }}
        >
          {authors.map((author) => (
            <div
              key={author._id}
              style={authorCardStyle}
              // Handle navigation when clicking the author card itself
              onClick={() => navigate(`/authors/${author._id}`)} 
            >
              <h3>{author.name}</h3>
              <p style={{ fontSize: '14px', color: '#555' }}>
                {author.bio ? author.bio.substring(0, 100) + '...' : 'No bio available'}
              </p>

              {/* Edit and Delete Buttons */}
              <div style={{ marginTop: 'auto' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up
                    navigate(`/edit-author/${author._id}`);
                  }}
                  style={tinyButtonStyle}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up
                    const confirmDelete = window.confirm('Are you sure you want to delete this author?');
                    if (confirmDelete) {
                      axios
                        .delete(`http://localhost:5554/authors/${author._id}`)
                        .then(() => {
                          setAuthors(authors.filter((a) => a._id !== author._id));
                        })
                        .catch((err) => {
                          alert('Error deleting author');
                          console.error(err);
                        });
                    }
                  }}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Author-related Buttons */}
      <div style={buttonContainerStyle}>
        <button
          onClick={() => navigate('/add-author')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#734f96',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add Author
        </button>
        <button
          onClick={() => navigate('/authors')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#B47EE5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          View All Authors
        </button>
      </div>
    </div>
  );
};

export default Home;
