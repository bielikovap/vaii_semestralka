import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorsList, setAuthorsList] = useState([]); 
  const [publishYear, setPublishYear] = useState('');
  const [ISBN, setISBN] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [bookCover, setBookCover] = useState('');

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5554/authors');
        setAuthorsList(response.data); 
      } catch (err) {
        console.error('Failed to fetch authors', err);
        alert('Failed to fetch authors. Please try again.');
      }
    };

    fetchAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ISBN.length < 10 || ISBN.length > 13) {
      alert('ISBN should be between 10 and 13 digits.');
      return; 
    }

    try {
      const newBook = { title, author, publishYear, ISBN, description, longDescription, bookCover };
      await axios.post('http://localhost:5554/books', newBook);
      alert('Book added successfully!');
      navigate('/'); 
    } catch (err) {
      console.error('Failed to add book', err);
      alert('Failed to add book. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button 
          onClick={() => navigate('/')} 
        >
          Home
        </button>
        <button 
          onClick={() => navigate(-1)} 
        >
          Back
        </button>
      </header>

      <div style={styles.formContainer}>
        <h2 style={styles.headerText}>Add New Book</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Author:</label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={styles.input}
                required
              >
                <option value="">Select an author</option>
                {authorsList.map((authorItem) => (
                  <option key={authorItem._id} value={authorItem._id}>
                    {authorItem.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Publish Year:</label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ISBN:</label>
              <input
                type="text"
                value={ISBN}
                onChange={(e) => setISBN(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Short Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Long Description:</label>
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                style={styles.textarea}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Book Cover URL:</label>
            <input
              type="text"
              value={bookCover}
              onChange={(e) => setBookCover(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.submitButton}>Add Book</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    margin: '0 auto',
    position: 'relative',
  },
  header: {
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
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px', 
  },
  formContainer: {
    marginTop: '20px', 
    padding: '20px',
    backgroundColor: '#fff',
  },
  headerText: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1, 
  },
  label: {
    fontSize: '16px',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  textarea: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    outline: 'none',
    minHeight: '100px',
    transition: 'border-color 0.3s',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};

export default AddBook;
