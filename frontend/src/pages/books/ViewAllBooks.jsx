import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';  

import Header from '../../components/Header';

const ViewBooks = () => {
  const [books, setBooks] = useState([]);  
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');  
  const [bookFilter, setBookFilter] = useState(''); 
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [showAuthorsFilter, setShowAuthorsFilter] = useState(false);
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookResponse = await axios.get('http://localhost:5554/books');
        setBooks(bookResponse.data.data || []);  

        const authorResponse = await axios.get('http://localhost:5554/authors');
        setAuthors(authorResponse.data || []); 
      } catch (err) {
        setError('Error fetching data');
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

  const handleAuthorChange = (authorId) => {
    setSelectedAuthors((prevSelectedAuthors) => {
      if (prevSelectedAuthors.includes(authorId)) {
        return prevSelectedAuthors.filter((id) => id !== authorId);  
      } else {
        return [...prevSelectedAuthors, authorId]; 
      }
    });
  };

  const filteredBooks = books.filter((book) => {
    const matchesBookFilter = bookFilter.trim() === '' 
      || book.title.trim().toLowerCase().includes(bookFilter.trim().toLowerCase());

    const matchesAuthorFilter = selectedAuthors.length === 0 
      || selectedAuthors.includes(book.author?._id); 

    return matchesBookFilter && matchesAuthorFilter;
  });

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
    fontFamily: 'against',
    fontSize: '15px'
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

  return (
    <div>
      <Header/>

      <h1 style={{ textAlign: 'center', fontFamily: 'against', }}>All Books</h1>
      <button onClick={toggleView} style={{fontFamily: 'against', marginTop: "50px", marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
      </button>

      <div style={{ padding: '20px', marginTop: '0px', fontFamily: 'against', }}> 
        <input 
          type="text" 
          placeholder="Filter by book name..." 
          value={bookFilter} 
          onChange={(e) => {
            console.log('BookFilter updated:', e.target.value); // Debug log
            setBookFilter(e.target.value);
          }} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid #ccc', 
            marginBottom: '0px', 
            }} 
          /> 
      </div>

      <button onClick={() => setShowAuthorsFilter(!showAuthorsFilter)} style={{fontFamily: 'against', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
        Filter by Authors
      </button>

      {showAuthorsFilter && (
      <div style={{ marginBottom: '20px' }}>
        {authors.map((author) => (
          <label key={author._id} style={{ marginRight: '10px' }}>
            <input 
              type="checkbox" 
              checked={selectedAuthors.includes(author._id)} 
              onChange={() => handleAuthorChange(author._id)} 
            />
            {author.name}
          </label>
        ))}
      </div>
      )}


      <div style={viewMode === 'grid' ? gridStyles : listStyles}>
        {filteredBooks.length === 0 ? (
          <p>No books available</p>
        ) : (
          filteredBooks.map((book) => (
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
