import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';  

const ViewBooks = () => {
  const [books, setBooks] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');  
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5554/books');
        setBooks(response.data.data || []);  
      } catch (err) {
        setError('Error fetching books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const toggleView = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  };

  const listStyles = {
    display: 'block',
  };

  const itemStyles = {
    border: '1px solid #ccc',
    padding: '20px',
    backgroundColor: '#f9f9f9',
  };

  const imageStyles = {
    width: '100%',
    height: 'auto',
  };

  const listItemStyles = {
    ...itemStyles,
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const listImageStyles = {
    width: '100px',
    marginRight: '20px',
    height: 'auto',
  };

  const listDetailsStyles = {
    flex: 1,
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
    gap: '15px'
  };

  return (
    <div>
      <header style={header}>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </header>

      <h1 style={{ textAlign: 'center' }}>All Books</h1>
      <button onClick={toggleView} style={{ marginTop: "20px", marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
      </button>

      <div style={viewMode === 'grid' ? gridStyles : listStyles}>
        {books.length === 0 ? (
          <p>No books available</p>
        ) : (
          books.map((book) => (
            <div
              key={book._id}
              style={viewMode === 'grid' ? itemStyles : listItemStyles}
            >
              
              <Link to={`/books/${book._id}`}>
                <img src={book.bookCover} alt={book.title} style={viewMode === 'grid' ? imageStyles : listImageStyles} />
              </Link>

              <div style={viewMode === 'grid' ? null : listDetailsStyles}>
                <h2>
                  <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {book.title}
                  </Link>
                </h2>
                <p>
                  Author: 
                  <Link to={`/authors/${book.author?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {book.author?.name}
                  </Link>
                </p>

                {viewMode === 'list' && (
                  <>
                    <p>ISBN: {book.ISBN}</p>
                    <p>Published Year: {book.publishYear}</p>
                    <p>{book.description}</p>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewBooks;
