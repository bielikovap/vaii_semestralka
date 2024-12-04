import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewBook = () => {
  window.scrollTo(0, 0);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({
    title: '',
    author: '',
    publishYear: '',
    ISBN: '',
    description: '',
    bookCover: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5554/authors');
        setAuthors(response.data);
        setFilteredAuthors(response.data);
      } catch (err) {
        setError('Failed to fetch authors. Please try again later.');
        console.error('Error fetching authors:', err.message);
      }
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/books/${id}`);
        setBook(response.data);
        setUpdatedBook(response.data);
      } catch (err) {
        setError('Failed to fetch book details. Please try again later.');
        console.error('Error fetching book details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!book) return <p>No book found.</p>;

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this book?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5554/books/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting book:', err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleModal = () => {
    if (isModalOpen) {
      setUpdatedBook(book); 
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationError = '';

    if (!updatedBook.title.trim()) {
      validationError = 'Title is required.';
    } else if (!selectedAuthor && !updatedBook.author) {
      validationError = 'An author must be selected.';
    } else if (
      !updatedBook.publishYear ||
      updatedBook.publishYear < 1000 ||
      updatedBook.publishYear > new Date().getFullYear()
    ) {
      validationError = 'Please provide a valid publish year.';
    } else if (!updatedBook.ISBN || updatedBook.ISBN.length < 10 || updatedBook.ISBN.length > 13) {
      validationError = 'ISBN should be between 10 and 13 digits.';
    } else if (!updatedBook.description.trim()) {
      validationError = 'Description is required.';
    } else if (!updatedBook.longDescription.trim()) {
      validationError = 'Long description is required.';
    }

    if (validationError) {
      
      setError(validationError); // Set error message
      return;
    }

    const payload = {
      ...updatedBook,
      author: selectedAuthor ? selectedAuthor._id : updatedBook.author,
    };

    try {
      await axios.put(`http://localhost:5554/books/${id}`, payload);
      toggleModal(); 
      setBook(updatedBook); 
    } catch (err) {
      console.error('Error updating book:', err.message);
      setError('Failed to update the book. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === '') {
      setFilteredAuthors([]);
    } else {
      const filtered = authors.filter((author) =>
        author.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAuthors(filtered);
    }
  };

  const handleSelectAuthor = (author) => {
    setSearchQuery(author.name);
    setSelectedAuthor(author);
    setFilteredAuthors([]);
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  return (
    <div className="container" style={{ marginTop: '80px' }}>
      <header style={header}>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </header>

      <div className="book-details" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div className="book-cover" style={{ flex: '1', maxWidth: '300px', paddingLeft: '30px', textAlign: 'center' }}>
          <img
            src={book.bookCover}
            alt={book.title}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={toggleModal}
              style={{ marginRight: '1rem', padding: '0.5rem 1rem', fontSize: '14px', color: '#4CAF50' }}
            >
              Edit Book
            </button>
            <button
              onClick={handleDelete}
              style={{
                color: 'red',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Delete Book
            </button>
          </div>
        </div>
        <div className="book-info" style={{ flex: '2', paddingLeft: '20px', minWidth: '300px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>{book.title}</h1>
          <p>
            <strong>Author:</strong>{' '}
            {book.author ? (
              <Link to={`/authors/${book.author._id}`} style={{ textDecoration: 'none' }}>
                {book.author.name}
              </Link>
            ) : (
              'Unknown'
            )}
          </p>
          <p>
            <strong>Published Year:</strong> {book.publishYear}
          </p>
          <p>
            <strong>ISBN:</strong> {book.ISBN}
          </p>
          <p>{book.description}</p>
          <br />
          <br />
          <p>{book.longDescription}</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '25px', fontWeight: 'bold' }}>Edit Book</h2>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
  <div style={formGroupStyle}>
    <label>Title</label>
    <input
      type="text"
      name="title"
      value={updatedBook.title}
      onChange={handleChange}
      required
      style={inputStyle}
    />
  </div>
  <div style={formGroupStyle}>
    <label>Author</label>
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search for author..."
      style={inputStyle}
    />
    {searchQuery && filteredAuthors.length > 0 && (
      <ul style={{ ...dropdownStyle, width: '500px', zIndex: 1050 }}>
        {filteredAuthors.map((author) => (
          <li
            key={author.id}
            onClick={() => handleSelectAuthor(author)}
            style={{ ...dropdownItemStyle, width: '100%' }}
          >
            {author.name}
          </li>
        ))}
      </ul>
    )}
  </div>
              <div style={formGroupStyle}>
                <label>Publish Year</label>
                <input
                  type="number"
                  name="publishYear"
                  value={updatedBook.publishYear}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={formGroupStyle}>
                <label>ISBN</label>
                <input
                  type="text"
                  name="ISBN"
                  value={updatedBook.ISBN}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={formGroupStyle}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={updatedBook.description}
                  onChange={handleChange}
                  style={textareaStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label>Long Description</label>
                <textarea
                  name="description"
                  value={updatedBook.longDescription}
                  onChange={handleChange}
                  style={textareaStyle}
                />
              </div>
              <div style={formGroupStyle}>
                <label>Book Cover URL</label>
                <input
                  type="text"
                  name="bookCover"
                  value={updatedBook.bookCover}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <button type="submit" style={submitButtonStyle}>
                  Update Book
                </button>
              </div>
              <button
                type="button"
                onClick={toggleModal}
                style={closeButtonStyle}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
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

const modalStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  maxWidth: '600px',
  width: '100%',
  maxHeight: '80vh',
  overflowY: 'auto',
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const textareaStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
  minHeight: '100px',
};

const dropdownStyle = {
  position: 'absolute',
  background: 'white',
  border: '1px solid #ccc',
  listStyleType: 'none',
  padding: '0',
  margin: '0',
  maxHeight: '200px',
  overflowY: 'auto',
};

const dropdownItemStyle = {
  padding: '10px',
  cursor: 'pointer',
};

const submitButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  width: '100%',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const closeButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#f44336',
  width: '100%',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

export default ViewBook;
