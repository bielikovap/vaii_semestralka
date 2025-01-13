import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import sanitize from 'mongo-sanitize';

const ViewBook = () => {
  //window.scrollTo(0, 0);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [review, setReview] = useState({ rating: 1, reviewText: '' });
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
  const [userId, setUserId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);

  const [showReviews, setShowReviews] = useState(false);

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
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/${id}/reviews`);
        console.log(response.data);
        setReviews(response.data.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err.message);
        setError('Failed to fetch reviews. Please try again later.');
      }
    };
  
    fetchReviews();
  }, [id]);

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


  useEffect(() => { 
    const checkUser = () => { 
      const token = localStorage.getItem('token'); 
      if (!token) { 
        return; 
      } 
      const decodedToken = JSON.parse(atob(token.split('.')[1])); 
      if (decodedToken.role === 'admin') { 
        setUserId(decodedToken.userId); 
      } 
    }; 
    checkUser(); 
  }, []);

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
    const sanitizedValue = sanitize(value);
    setUpdatedBook((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));
  };

  const toggleModal = () => {
    if (isModalOpen) {
      setUpdatedBook(book); 
    }
    setIsModalOpen(!isModalOpen);
  };

  const toggleReviews = () => {
    setShowReviews((prevState) => !prevState); 
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

  const handleAddReviewClick = () => {
    navigate(`/books/${id}/add-review`);
  };

  const handleSelectAuthor = (author) => {
    setSearchQuery(author.name);
    setSelectedAuthor(author);
    setFilteredAuthors([]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>No book found.</p>;

  return (
    <div className="container" style={{ marginTop: '80px' }}>
      <Header/>

      <div className="book-details" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div className="book-cover" style={{ flex: '1', maxWidth: '300px', paddingLeft: '30px', textAlign: 'center' }}>
          <img
            src={book.bookCover}
            alt={book.title}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          { userId && (
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={toggleModal}
              style={{ marginRight: '1rem', padding: '0.5rem 1rem', fontSize: '14px', color: '#4CAF50' ,fontFamily: 'against',}}
            >
              Edit Book
            </button>
            <button
              onClick={handleDelete}
              style={{
                fontFamily: 'against',
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
          )}
        </div>
        <div className="book-info" style={{ flex: '2', paddingLeft: '20px', minWidth: '300px' }}>
          <h1 style={{ fontFamily: 'against',fontSize: '30px', fontWeight: 'bold' }}>{book.title}</h1>
          <p>
            <strong>Author:</strong>{' '}
            {book.author ? (
              <Link to={`/authors/${book.author._id}`} style={{ textDecoration: 'none',  }}>
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

          <div style={{ marginTop: '2rem' }}>
          <button
            onClick={handleAddReviewClick}
            style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', fontFamily: 'against', }}
          >
            Add a Review
          </button>
        </div>

          <div className="reviews-section" style={{ marginTop: '2rem' }}>
            <h3 onClick={toggleReviews} style={{ cursor: 'pointer', color: '#4CAF50', fontFamily: 'against', }}>
              Reviews
            </h3>
            {showReviews && (
              <div>
                {reviews.length > 0 ? (
                  <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                    {reviews.map((review, index) => (
                      <li key={index} style={{ marginBottom: '20px' }}>
                        <div style={{ fontWeight: 'bold' }}>
                          Rating: {review.rating} / 5
                        </div>
                        <p>{review.reviewText}</p>
                        <p>
                    <strong>Reviewed by:</strong>{' '}
                    <Link to={`/users/${review.user._id}`} style={{ textDecoration: 'none', color: '#007BFF' }}>
                      {review.user.username}
                    </Link>
                  </p>
                        <p>
                          <strong>Posted on:</strong> {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
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
