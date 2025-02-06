import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderHome from '../components/HeaderHome';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [suggestionType, setSuggestionType] = useState('book');
  const [suggestionError, setSuggestionError] = useState(null);
  const [suggestionSuccess, setSuggestionSuccess] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  useEffect(() => { 
    const checkAdmin = () => { 
      const token = localStorage.getItem('token'); 
      
      if (!token) { 
        return; 
      } 
      
      const decodedToken = JSON.parse(atob(token.split('.')[1])); 
      
      if (decodedToken.role === 'admin') { 
        setUserId(decodedToken.userId); 
      } 
    }; 
    
    checkAdmin(); 
  }, []);

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

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    setSuggestionError(null);
    setSuggestionSuccess(false);
  
    const token = localStorage.getItem('token');
    let userId = null;
  
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      userId = decodedToken.userId;
    }
  
    try {
      const suggestionData = {
        suggestion,
        type: suggestionType
      };
  
      if (userId) {
        suggestionData.submittedBy = userId;
      }
  
      const response = await axios.post('http://localhost:5554/suggestions', suggestionData);
      
      setSuggestionSuccess(true);
      setSuggestion('');
      setSuggestionType('book');
      setShowSuggestionForm(false);
  
      setTimeout(() => {
        setSuggestionSuccess(false);
      }, 3000);
    } catch (error) {
      setSuggestionError(error.response?.data?.message || 'Failed to submit suggestion');
    }
  };

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
    height: '100%', 
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

  const styles = {
    suggestionContainer: {
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: '30px'
    },
    suggestionButton: {
      backgroundColor: '#734f96',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontFamily: 'against',
      fontSize: '18px'
    },
    suggestionForm: {
      maxWidth: '500px',
      margin: '20px auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    textarea: {
      minHeight: '100px',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    error: {
      color: '#f44336'
    },
    success: {
      color: '#4CAF50'
    }
  };

  return (
    <div style={{ padding: '10px', minHeight: '100vh', paddingTop: '20px' }}>
      <HeaderHome />
      <h1 style={{ fontFamily: 'against', fontSize: '30px', fontWeight: 'bold', marginTop: '50px' }}>BookCorner</h1>

      <h2 style={{ fontFamily: 'against', fontSize: '24px', fontWeight: 'bold' }}>Recently added books:</h2>

      {books.length === 0 ? <p>No books available</p> : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', marginTop: '5px' }}>
          {books.map((book) => (
            <div key={book._id} style={{ border: '1px solid #ccc', fontFamily: 'against', padding: '1rem', borderRadius: '8px', cursor: 'pointer' }} onClick={() => navigate(`/books/${book._id}`)}>
              <img src={book.bookCover} alt={book.title} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              <h3>{book.title}</h3>
            </div>
          ))}
        </div>
      )}

      {userId && (
        <div style={buttonContainerStyle}>
          <button onClick={() => navigate('/add-book')} style={{ padding: '0.5rem 1rem', backgroundColor: '#734f96', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Add Book
          </button>
        </div>
      )}

      <div style={buttonContainerStyle}>
        <button onClick={() => navigate('/books')} style={{ padding: '0.5rem 1rem', fontFamily : 'against', backgroundColor: '#B47EE5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          View All Books
        </button>
      </div>

      <h2 style={{ fontFamily: 'against', fontSize: '24px', fontWeight: 'bold', marginTop: "10px" }}>Recently added authors:</h2>

      {authors.length === 0 ? <p>No authors available</p> : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', marginTop: '5px' }}>
          {authors.map((author) => (
            <div key={author._id} style={{ border: '1px solid #ccc', padding: '1rem', fontFamily : 'against', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate(`/authors/${author._id}`)}>
              <h3>{author.name}</h3>
              <p style={{ fontSize: '14px', color: '#555',  }}>{author.bio ? author.bio.substring(0, 100) + '...' : 'No bio available'}</p>
            </div>
          ))}
        </div>
      )}

      {userId && (
        <div style={buttonContainerStyle}>
          <button onClick={() => navigate('/add-author')} style={{ padding: '0.5rem 1rem', backgroundColor: '#734f96', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Add Author
          </button>
        </div>
      )}

      <div style={buttonContainerStyle}>
        <button onClick={() => navigate('/authors')} style={{ padding: '0.5rem 1rem', fontFamily : 'against', backgroundColor: '#B47EE5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          View All Authors
        </button>
      </div>

      <div style={styles.suggestionContainer}>
        <button 
          onClick={() => setShowSuggestionForm(!showSuggestionForm)}
          style={styles.suggestionButton}
        >
          Have a suggestion? Leave it here!
        </button>

        {showSuggestionForm && (
          <form onSubmit={handleSuggestionSubmit} style={styles.suggestionForm}>
            <select 
              value={suggestionType}
              onChange={(e) => setSuggestionType(e.target.value)}
              style={styles.select}
            >
              <option value="book">Book</option>
              <option value="author">Author</option>
              <option value="webpage">Webpage</option>
            </select>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Enter your suggestion here..."
              style={styles.textarea}
              required
              minLength={10}
              maxLength={500}
            />
            <button type="submit" style={styles.submitButton}>
              Submit {userId ? 'as ' + localStorage.getItem('username') : 'Anonymously'}
            </button>
            {suggestionError && <div style={styles.error}>{suggestionError}</div>}
            {suggestionSuccess && (
              <div style={styles.success}>
                Thank you for your suggestion! {userId ? 'We\'ll notify you when it\'s reviewed.' : ''}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Home;
