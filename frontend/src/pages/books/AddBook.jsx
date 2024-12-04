import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishYear: '',
    ISBN: '',
    description: '',
    bookCover: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/books', formData); // Adjust the endpoint
      setMessage('Book created successfully!');
      setFormData({
        title: '',
        author: '',
        publishYear: '',
        ISBN: '',
        description: '',
        bookCover: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while creating the book.');
    }
  };

  return (
    <div>
      <h1>Create a New Book</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author ID:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="publishYear">Publish Year:</label>
          <input
            type="number"
            id="publishYear"
            name="publishYear"
            value={formData.publishYear}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ISBN">ISBN:</label>
          <input
            type="number"
            id="ISBN"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="13"
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength="2000"
          />
        </div>
        <div>
          <label htmlFor="bookCover">Book Cover URL:</label>
          <input
            type="text"
            id="bookCover"
            name="bookCover"
            value={formData.bookCover}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  );
};

export default AddBook;
