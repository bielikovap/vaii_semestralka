import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,  useNavigate, } from 'react-router-dom';  


const ViewAllAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5554/authors');  
        setAuthors(response.data);
      } catch (err) {
        setError('Failed to fetch authors');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) return <p>Loading authors...</p>;

  if (error) return <p>{error}</p>;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '20px',
    padding: '20px',
    marginTop: "50px"
  };

  const authorCardStyle = {
    display: 'flex',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left', 
  };

  const authorImageStyle = {
    height: '120px',
    width: 'auto',  
    marginRight: '20px', 
  };

  const authorInfoStyle = {
    flex: 1, 
  };

  const authorNameStyle = {
    fontSize: '1.5em',
    marginBottom: '10px',
    textDecoration: 'none',  
  };

  const authorBioStyle = {
    fontSize: '1em',
    color: '#555',
  };

  const authorDateOfBirthStyle = {
    fontSize: '1em',
    color: '#555',
    marginTop: '10px',
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

  return (
    <div>
         <header style={header}>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </header>
      <div style={gridStyle}>
        {Array.isArray(authors) && authors.length > 0 ? (
          authors.map((author) => (
            <div key={author._id} style={authorCardStyle}>
              {author.profilePicture && (
                <img
                  style={authorImageStyle}
                  src={author.profilePicture}
                  alt={author.name}
                />
              )}
              <div style={authorInfoStyle}>
                <Link to={`/authors/${author._id}`} style={authorNameStyle}>
                  {author.name}
                </Link>
                {author.bio && <p style={authorBioStyle}><strong>Bio:</strong> {author.bio}</p>}
                {author.dateOfBirth && (
                  <p style={authorDateOfBirthStyle}>
                    <strong>Date of Birth:</strong> {new Date(author.dateOfBirth).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No authors found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllAuthors;
