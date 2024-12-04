import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewBook = () => {
  window.scrollTo(0, 0); 
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // State for storing book data
  const [authors, setAuthors] = useState([]); // State for authors list
  const [filteredAuthors, setFilteredAuthors] = useState([]); // State for filtered authors
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [updatedBook, setUpdatedBook] = useState({
    title: '',
    author: '', // Store author's id or reference
    publishYear: '',
    ISBN: '',
    description: '',
    bookCover: '',
  }); // State for holding updated book data
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedAuthor, setSelectedAuthor] = useState(null); // State for selected author
  const navigate = useNavigate(); // For navigation

  // Fetch authors list
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5554/authors');
        setAuthors(response.data);
        setFilteredAuthors(response.data); // Initially display all authors
      } catch (err) {
        setError('Failed to fetch authors. Please try again later.');
        console.error('Error fetching authors:', err.message);
      }
    };
    fetchAuthors();
  }, []);

  // Fetch book data using the ID from the URL
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/books/${id}`);
        setBook(response.data);
        setUpdatedBook(response.data); // Pre-fill form with existing book data
      } catch (err) {
        setError('Failed to fetch book details. Please try again later.');
        console.error('Error fetching book details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // If data is still being fetched, show loading message
  if (loading) return <p>Loading book details...</p>;

  // If there’s an error, display the error message
  if (error) return <p>{error}</p>;

  // If the book data exists, render it
  if (!book) return <p>No book found.</p>;

  // Function to handle delete action
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this book?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5554/books/${id}`);
        navigate('/'); // Redirect to the homepage after deletion
      } catch (err) {
        console.error('Error deleting book:', err.message);
      }
    }
  };

  // Function to handle the modal open/close
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to handle form changes for the edit form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle the form submission for updating the book
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5554/books/${id}`, updatedBook);
      toggleModal(); // Close the modal after successful update
      setBook(updatedBook); // Update the displayed book with the new values
    } catch (err) {
      console.error('Error updating book:', err.message);
      setError('Failed to update the book. Please try again.');
    }
  };

  // Function to handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter authors based on search query
    if (query === '') {
      setFilteredAuthors([]);
    } else {
      const filtered = authors.filter((author) =>
        author.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAuthors(filtered);
    }
  };

  // Function to handle author selection from dropdown
  const handleSelectAuthor = (author) => {
    setSearchQuery(author.name); // Set the selected author's name in the input field
    setSelectedAuthor(author); // Store the selected author
    setFilteredAuthors([]); // Hide the dropdown
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  return (
    <div className="container" style={{ marginTop: '0px' }}>
      <Link to="/">Back to Library</Link>
      <div className="book-details" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div className="book-cover" style={{ flex: '1', maxWidth: '300px', paddingLeft: "30px" }}>
          <img
            src={book.bookCover}
            alt={book.title}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
        <div className="book-info" style={{ flex: '2', paddingLeft: '20px', minWidth: '300px' }}>
          <h1>{book.title}</h1>
          <p><strong>Author:</strong> {book.author ? book.author.name : 'Unknown'}</p>
          <p><strong>Published Year:</strong> {book.publishYear}</p>
          <p><strong>ISBN:</strong> {book.ISBN}</p>
          <p>{book.description}</p>
          <div>
            <button onClick={toggleModal} style={{ marginRight: '1rem' }}>Edit Book</button>
            <button onClick={handleDelete} style={{ color: 'red', border: 'none', background: 'none' }}>Delete Book</button>
          </div>
        </div>
      </div>

      {/* Modal for editing book */}
{isModalOpen && (
  <div className="modal" style={modalStyle}>
    <div style={modalContentStyle}>
      <h2>Edit Book</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
          {/* Display filtered authors as dropdown only if search query is not empty */}
          {searchQuery && filteredAuthors.length > 0 && (
            <ul style={{ ...dropdownStyle, width: '500px', zIndex: 1050 }}>
              {filteredAuthors.map((author) => (
                <li
                  key={author.id}
                  onClick={() => handleSelectAuthor(author)}
                  style={{ ...dropdownItemStyle, width: '100%' }} // Make the list item fill the dropdown
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


const dropdownStyle = {
  position: 'absolute',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  width: '100%',
  zIndex: 1000,
  maxHeight: '200px',
  overflowY: 'auto',
  listStyle: 'none',
  paddingLeft: '0',
};

const dropdownItemStyle = {
  padding: '8px',
  cursor: 'pointer',
};

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};


const modalContentStyle = {
  padding: '20px',
  paddingRight: '30px', 
  backgroundColor: 'white',
  maxWidth: '600px',
  margin: 'auto',
  borderRadius: '10px',
  position: 'relative',
  maxHeight: '80vh',
  overflowY: 'auto',  
};


const formGroupStyle = {
  marginBottom: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
};

const textareaStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  height: '100px',
};

const submitButtonStyle = {
  padding: '10px 15px',
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
};

const closeButtonStyle = {
  marginTop: '10px',
  backgroundColor: 'red',
  color: 'white',
  padding: '5px 10px',
  border: 'none',
};

export default ViewBook;
