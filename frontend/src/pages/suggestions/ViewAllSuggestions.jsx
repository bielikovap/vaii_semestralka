import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';

const ViewAllSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [userId, setUserId] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => { 
    const checkAdmin = () => { 
      if (!token) { 
        alert("You must be logged in.")
        console.error('not logged in'); 
        navigate('/login'); 
        return; 
      } 
      
      let decodedToken; 
      try { 
        decodedToken = JSON.parse(atob(token.split('.')[1]));
      } catch (error) { 
        console.error('Invalid token', error); 
        navigate('/'); 
        return; 
      } 
      
      if (decodedToken.role !== 'admin') { 
        alert("You do not have access to this page.")
        console.error('not an admin'); 
        navigate('/'); 
        return; 
      } 
      setUserId(decodedToken.userId);
      fetchSuggestions();
    };
    checkAdmin(); 
  }, [token, navigate]);

  const handleEdit = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setNewStatus(suggestion.status);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5554/suggestions/${selectedSuggestion._id}/status`,
        { status: newStatus.toLowerCase() }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        await fetchSuggestions();
        setIsModalOpen(false);
        setSelectedSuggestion(null);
      }
    } catch (error) {
      console.error('Error updating suggestion:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this suggestion?')) {
      try {
        await axios.delete(`http://localhost:5554/suggestions/${id}`);
        await fetchSuggestions();
      } catch (error) {
        console.error('Error deleting suggestion:', error);
      }
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:5554/suggestions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuggestions(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError(error.response?.data?.error || 'An error occurred');
      setLoading(false);
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => 
    typeFilter === 'all' ? true : suggestion.type === typeFilter
  );

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: '80px',
    },
    title: {
      fontFamily: 'against',
      color: '#734f96',
      marginBottom: '20px',
      textAlign: 'center',
    },
    tableWrapper: {
      overflowX: 'auto',
      width: '100%',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '@media (maxWidth: 768px)': {
        display: 'block',
      }
    },
    th: {
      backgroundColor: '#734f96',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      fontFamily: 'against',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      '@media (maxWidth: 768px)': {
        display: 'block',
        width: '100%',
        textAlign: 'right',
        paddingLeft: '50%',
        position: 'relative',
        '&:before': {
          content: 'attr(data-label)',
          position: 'absolute',
          left: '0',
          width: '50%',
          paddingLeft: '15px',
          fontWeight: 'bold',
          textAlign: 'left',
        }
      }
    },
    status: {
      padding: '4px 8px',
      borderRadius: '4px',
      display: 'inline-block',
      fontWeight: 'bold',
    },
    pending: {
      backgroundColor: '#ffd700',
      color: '#000',
    },
    approved: {
      backgroundColor: '#90EE90',
      color: '#000',
    },
    rejected: {
      backgroundColor: '#FFB6C1',
      color: '#000',
    },
    editButton: {
      padding: '5px 10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '5px 10px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      '@media (maxWidth: 768px)': {
        justifyContent: 'flex-end'
      }
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    select: {
      padding: '8px',
      marginBottom: '15px',
      width: '100%',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
    },
    saveButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    cancelButton: {
      padding: '8px 16px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      fontSize: '18px'
    },
    error: {
      color: 'red',
      textAlign: 'center',
      padding: '20px'
    },
    filterSection: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '10px'
    },
    filterSelect: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      minWidth: '150px',
      fontFamily: 'against'
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.container}>{error}</div>;

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.filterSection}>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="book">Books</option>
            <option value="author">Authors</option>
            <option value="webpage">Webpages</option>
          </select>
        </div>
        {loading ? (
          <div style={styles.loading}>Loading suggestions...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Suggestion</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Submitted By</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuggestions.map((suggestion) => (
                  <tr key={suggestion._id}>
                    <td style={styles.td} data-label="Suggestion">{suggestion.suggestion}</td>
                    <td style={styles.td} data-label="Type">{suggestion.type}</td>
                    <td style={styles.td} data-label="Submitted By">{suggestion.submittedBy?.username || 'Anonymous'}</td>
                    <td style={styles.td} data-label="Status">
                      <span style={{
                        ...styles.status,
                        ...styles[suggestion.status.toLowerCase()]
                      }}>
                        {suggestion.status}
                      </span>
                    </td>
                    <td style={styles.td} data-label="Date">
                      {new Date(suggestion.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td} data-label="Actions">
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => handleEdit(suggestion)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(suggestion._id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && selectedSuggestion && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h2>Edit Status</h2>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={styles.select}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div style={styles.buttonContainer}>
                <button onClick={handleSave} style={styles.saveButton}>Save</button>
                <button onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllSuggestions;