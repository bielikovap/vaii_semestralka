import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,  useNavigate, } from 'react-router-dom';  

import Header from '../../components/Header';


const ViewAllAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const fetchAuthors = async (filter) => { 
    setLoading(true); 
    try { const response = await axios.get('http://localhost:5554/authors');
    setAuthors(response.data); 
    } catch (err) { 
    setError('Failed to fetch authors'); 
    } finally { 
      setLoading(false); } 
  };
    
  useEffect(() => { 
    fetchAuthors(); 
  }, []);

  useEffect(() => { console.log("Filter: ", filter); }, [filter]);

  const filteredAuthors = authors.filter((author) => 
    author.name.toLowerCase().includes(filter.toLowerCase()) 
);


  if (loading) return <p>Loading authors...</p>;

  if (error) return <p>{error}</p>;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '20px',
    padding: '20px'
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
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  };

  const authorInfoStyle = {
    flex: 1, 
    paddingLeft: '20px',
  };

  const authorNameStyle = {
    fontSize: '1.8em',
    marginBottom: '15px',
    textDecoration: 'none',
    fontFamily: 'against',
    color: '#734f96',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#5a3d77',
    }
  };

  const authorBioStyle = {
    fontSize: '1.1em',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '15px',
    fontFamily : 'against'
  };

  const authorDateOfBirthStyle = {
    fontSize: '1em',
    color: '#888',
    marginTop: '12px',
    fontStyle: 'italic',
    fontFamily : 'against'
  };

  const searchContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
    fontFamily: 'against',
    
  };

  const searchInputStyle = {
    width: '100%',
    maxWidth: '600px',
    padding: '15px 25px',
    fontSize: '1.1em',
    border: '2px solid #e0e0e0',
    borderRadius: '30px',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    '&:focus': {
      borderColor: '#734f96',
      boxShadow: '0 6px 8px rgba(115, 79, 150, 0.2)',
    },
    fontFamily : 'against'
  };

  return (
    <div>
        <Header />

      <div style={{ 
        padding: '40px 20px', 
        marginTop: '50px',
        background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
        minHeight: '100vh'
      }}>
        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="search authors by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={searchInputStyle}
          />
        </div>

    <div style={gridStyle}> 
      {Array.isArray(filteredAuthors) && filteredAuthors.length > 0 ? ( 
        filteredAuthors.map((author) => ( 
        <div key={author._id} style={authorCardStyle}> 
          <Link to={`/authors/${author._id}`} style={{ textDecoration: 'none' }}>
            <img 
              style={authorImageStyle} 
              src={author.profileImage} 
              alt={author.name} 
            /> 
          </Link>
            <div style={authorInfoStyle}> 
                <Link to={`/authors/${author._id}`} style={authorNameStyle}>
                  {author.name} 
                  </Link> {author.bio && <p style={authorBioStyle}><strong>Bio:</strong> {author.bio}</p>}
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
  </div>
  );
};

export default ViewAllAuthors;
