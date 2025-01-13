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
    fontFamily: 'against',
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


  return (
    <div>
        <Header />

      <div style={{ padding: '20px', marginTop: '50px', }}>
      <input
        type="text"
        placeholder="Hľadaj autorov podľa mena..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
    </div>

    <div style={gridStyle}> 
      {Array.isArray(filteredAuthors) && filteredAuthors.length > 0 ? ( 
        filteredAuthors.map((author) => ( 
        <div key={author._id} style={authorCardStyle}> 
          {author.profilePicture && ( 
            <img 
              style={authorImageStyle} 
              src={author.profilePicture} 
              alt={author.name} 
            /> )} 
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
  );
};

export default ViewAllAuthors;
