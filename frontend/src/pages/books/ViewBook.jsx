import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';

const ViewBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: 1, reviewText: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [userId, setUserId] = useState('');
  const DEFAULT_PROFILE_IMAGE = 'https://static.vecteezy.com/system/resources/thumbnails/029/470/675/small_2x/ai-generated-ai-generative-purple-pink-color-sunset-evening-nature-outdoor-lake-with-mountains-landscape-background-graphic-art-photo.jpg';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decodedToken.role === 'admin');
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch book data.');
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get(`http://localhost:5554/reviews/book/${id}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    if (id) {
      fetchBook();
      fetchReviews();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5554/books/${id}`);
        navigate('/books');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book.');
      }
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const existingReview = reviews.find(review => {
      return review.user._id === userId || review.user === userId;
    });
  
    if (existingReview) {
      alert("You have already reviewed this.")
      setShowReviewForm(false);
      return;
    }
    
    if (!review.reviewText || !review.rating) {
      setError('Review text and rating are required');
      return;
    }
  
    const reviewData = {
      user: userId,
      book: id,
      reviewText: review.reviewText,
      rating: Number(review.rating)
    };
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(
        'http://localhost:5554/reviews',
        reviewData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setReview({ rating: 1, reviewText: '' });
      setShowReviewForm(false);
      const updatedReviews = await axios.get(`http://localhost:5554/reviews/book/${id}`);
      setReviews(updatedReviews.data);
    } catch (err) {
      console.error('Submit error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleAddReviewClick = () => {
    setShowReviewForm(true);
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const styles = {
    reviewCard: {
      padding: '15px',
      border: '1px solid #eee',
      borderRadius: '8px',
      marginBottom: '15px',
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    reviewerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    reviewerImage: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #734f96',
      marginRight: '10px'
    },
    usernameLink: {
      color: '#734f96',
      textDecoration: 'none',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    rating: {
      color: '#f39c12',
      fontSize: '1.3rem',
      marginBottom: '15px',
      backgroundColor: '#fff9e6',
      padding: '8px 12px',
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '500px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#333'
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px'
  };

  const textareaStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minHeight: '100px',
    fontSize: '14px',
    resize: 'vertical'
  };

  return (
    <div className="container" style={{ marginTop: '80px' }}>
      <Header/>
      <div className="book-details" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div className="book-cover" style={{ flex: '1', maxWidth: '300px', paddingLeft: '30px', textAlign: 'center' }}>
          <img
            src={book?.bookCover}
            alt={book?.title}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          {isAdmin && (
            <div style={{ marginTop: '1rem' }}>
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
          <h1 style={{ fontFamily: 'against',fontSize: '30px', fontWeight: 'bold' }}>{book?.title}</h1>
          <p>
            <strong>Author:</strong>{' '}
            {book?.author ? (
              <Link to={`/authors/${book.author._id}`} style={{ textDecoration: 'none',  }}>
                {book.author.name}
              </Link>
            ) : (
              'Unknown'
            )}
          </p>
          <p>
            <strong>Published Year:</strong> {book?.publishYear}
          </p>
          <p>
            <strong>ISBN:</strong > {book?.ISBN}
          </p>
          <p>{book?.description}</p>
          <br />
          <br />
          <p>{book?.longDescription}</p>

          {userId && (
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={handleAddReviewClick}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#734f96', 
                  color: 'white', 
                  fontFamily: 'against',
                }}
              >
                Add a Review
              </button>
            </div>
          )}

          <div className="reviews-section" style={{ marginTop: '2rem' }}>
            <h3 onClick={toggleReviews} style={{ cursor: 'pointer', color: '#734f96', fontFamily: 'against', }}>
              Reviews
            </h3>
            {showReviews && (
              <div>
                {reviews.length > 0 ? (
                  <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                    {reviews.map((review) => {
                      return (
                        <div key={review._id} style={styles.reviewCard}>
                          <div style={styles.reviewHeader}>
                            <div style={styles.reviewerInfo}>
                              <img 
                                src={review?.user?.profileImage || 'https://static.vecteezy.com/system/resources/thumbnails/029/470/675/small_2x/ai-generated-ai-generative-purple-pink-color-sunset-evening-nature-outdoor-lake-with-mountains-landscape-background-graphic-art-photo.jpg'} 
                                alt={review.user.username} 
                                style={styles.reviewerImage}
                              />
                              <div>
                                <Link to={`/users/${review.user._id}`} style={styles.usernameLink}>
                                  {review.user.username}
                                </Link>
                                <div style={styles.rating}>
                                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p style={styles.reviewText}>{review.text}</p>
                        </div>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      

      {showReviewForm && (
        <form style={formStyle} onSubmit={handleReviewSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Rating</label>
            <select
              name="rating"
              value={review.rating}
              onChange={handleReviewChange}
              style={inputStyle}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Review Text</label>
            <textarea
              name="reviewText"
              value={review.reviewText}
              onChange={handleReviewChange}
              style={textareaStyle}
            ></textarea>
          </div>
          <button type="submit" style={inputStyle}>
            Submit Review
          </button>
        </form>
      )}
      </div>
  );
};

export default ViewBook;