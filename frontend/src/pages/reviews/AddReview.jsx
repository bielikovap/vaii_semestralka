import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddReview = () => { 
  const { id: bookId } = useParams(); 
  const [review, setReview] = useState({ 
    user: '', 
    rating: 1, 
    reviewText: ''
   });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5554/books/${bookId}/reviews`, review);
      alert('Review added successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('There was an error adding the review:', error);
      alert('Failed to add review.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="user">User ID:</label>
        <input type="text" id="user" name="user" value={review.user} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="rating">Rating:</label>
        <select id="rating" name="rating" value={review.rating} onChange={handleChange} required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div>
        <label htmlFor="reviewText">Review Text:</label>
        <textarea id="reviewText" name="reviewText" value={review.reviewText} onChange={handleChange}></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default AddReview;
