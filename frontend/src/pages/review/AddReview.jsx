import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

const AddReview = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserId(decoded.userId);
    } catch (error) {
      console.error('Token decode error:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5554/reviews', {
        user: userId,
        book: bookId,
        rating,
        reviewText
      });

      if (response.status === 201) {
        navigate(`/books/${bookId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Add Review</h2>
        {error && <p style={styles.error}>{error}</p>}
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Rating:</label>
          <select 
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={styles.select}
          >
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Star' : 'Stars'}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={styles.textarea}
            placeholder="Write your review here..."
          />
        </div>

        <button type="submit" style={styles.button}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '80px auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    textAlign: 'center',
    fontSize: '24px',
    fontFamily: 'against',
    marginBottom: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontFamily: 'against',
    fontSize: '16px',
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minHeight: '120px',
    resize: 'vertical',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'against',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  }
};

export default AddReview;
