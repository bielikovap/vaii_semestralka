import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';

const ViewUser = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editReviewText, setEditReviewText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isEditingImage, setIsEditingImage] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5554/reviews/user/${userId}`);
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching user reviews:', err);
      }
    };
    fetchUserReviews();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setLoggedInUserId(decoded.userId);
    }
  }, []);

  const handleShowMore = () => {
    setVisibleReviews(prev => prev + 3);
  };

  const handleShowLess = () => {
    setVisibleReviews(3);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditReviewText(review.reviewText);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5554/reviews/${editingReview._id}`, {
        rating: editRating,
        reviewText: editReviewText
      });
      
      const response = await axios.get(`http://localhost:5554/reviews/user/${userId}`);
      setReviews(response.data);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating review:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this review?');
      
      if (isConfirmed) {
        await axios.delete(`http://localhost:5554/reviews/${reviewId}`);
        const response = await axios.get(`http://localhost:5554/reviews/user/${userId}`);
        setReviews(response.data);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.patch(
        `http://localhost:5554/users/${userId}/profile-image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setUser({ ...user, profileImage: response.data.profileImage });
      setIsEditingImage(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Error uploading image');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      padding: '20px',
    },
    
    userInfoSection: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '20px'
    },
    
    reviewsSection: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '20px'
    },
    userColumn: {
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      height: 'fit-content',
    },
    avatar: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      marginBottom: '20px',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    reviewsColumn: {
      padding: '20px',
    },
    title: {
      fontFamily: 'against',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: '20px',
    },
    subtitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '20px',
    },
    reviewsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
      padding: '10px',
    },
    reviewCard: {
      padding: '25px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(115, 79, 150, 0.2)',  
      marginBottom: '20px',
      borderLeft: '5px solid #734f96',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(115, 79, 150, 0.3)' 
            }
    },
    bookTitle: {
      fontFamily: 'against',
      fontSize: '1.4rem',
      color: '#2c3e50',
      marginBottom: '15px',
      fontWeight: 'bold',
      borderBottom: '2px solid #eee',
      paddingBottom: '10px',
    },
    rating: {
      color: '#f39c12',
      fontSize: '1.3rem',
      marginBottom: '15px',
      backgroundColor: '#fff9e6',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'inline-block',
    },
    reviewText: {
      fontFamily: 'Times New Roman, serif',
      color: '#34495e',
      lineHeight: '1.6',
      fontSize: '1.1rem',
      padding: '10px 0',
    },
    reviewDate: {
      color: '#7f8c8d',
      fontSize: '0.9rem',
      marginTop: '15px',
      borderTop: '1px solid #eee',
      paddingTop: '10px',
    },
    noReviews: {
      color: '#666',
      fontStyle: 'italic',
    },
    showMoreButton: {
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against',
      marginTop: '20px',
    },
    adminBadge: {
      backgroundColor: '#734f96',
      color: 'white',
      padding: '5px 15px',
      borderRadius: '15px',
      display: 'inline-block',
      margin: '0 auto',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: 'against',
    },
    roleText: {
      textTransform: 'capitalize',
      color: '#734f96',
      fontWeight: 'bold',
    },
    infoSection: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '15px',
      '& p': {
        marginBottom: '10px',
      },
    },
    sectionTitle: {
      fontFamily: 'against',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '15px',
      borderBottom: '2px solid #734f96',
      paddingBottom: '5px',
    },
    infoLabel: {
      fontFamily: 'against',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#333',
      marginRight: '8px',
    },
    infoText: {
      fontFamily: 'Times New Roman, serif',
      fontSize: '1.4rem',
      color: '#666',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '20px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#734f96',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#5d3f78', 
      }
    },
    bookTitleLink: {
      fontFamily: 'against',
      fontSize: '1.4rem',
      color: '#2c3e50',
      marginBottom: '15px',
      borderBottom: '2px solid #eee',
      paddingBottom: '10px',
      textDecoration: 'none',
      display: 'block',
      transition: 'color 0.3s ease',
      ':hover': {
        color: '#4CAF50'
      }
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
    },
    editButton: {
      padding: '8px 16px',
      backgroundColor: '#734f96',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against',
      fontSize: '0.9rem',
    },
    deleteButton: {
      padding: '8px 16px',
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against',
      fontSize: '0.9rem',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px'
    },
    modalTitle: {
      fontFamily: 'against',
      fontSize: '1.5rem',
      marginBottom: '20px',
      textAlign: 'center'
    },
    modalContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    textarea: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      minHeight: '100px',
      fontFamily: 'Times New Roman, serif',
      fontSize: '1.1rem'
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    },
    saveButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against'
    },
    cancelButton: {
      padding: '8px 16px',
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against'
    },
    starRating: {
      display: 'flex',
      gap: '5px',
      marginTop: '5px'
    },
    star: {
      fontSize: '2rem',
      transition: 'color 0.2s ease-in-out',
      ':hover': {
        color: '#f39c12'
      }
    },
    profileImageSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px'
    },
    profileImage: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #734f96'
    },
    fileInput: {
      display: 'none'
    },
    previewContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    },
    imagePreview: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    uploadButton: {
      padding: '8px 16px',
      backgroundColor: '#734f96',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against'
    },
    error: {
      color: '#dc3545',
      marginTop: '5px'
    },
    profileSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '30px'
    },
    imageEditSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    },
    uploadSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px'
    },
    fileInputLabel: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'against'
    },
    previewImage: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.errorMessage}>{error}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header/>
      <div style={{ margin: '10px 0', marginTop: '40px' }}>
        <div style={styles.userInfoSection}>
          {user && (
            <div style={styles.userInfo}>
              <h1 style={styles.title}>{user.firstName} {user.lastName}</h1>
              {user.role === 'admin' && <div style={styles.adminBadge}>Admin</div>}
            

              <div style={styles.profileSection}>
                <img 
                  src={user?.profileImage || 'default-profile.png'} 
                  alt="Profile" 
                  style={styles.profileImage}
                />
                
                {loggedInUserId === userId && (
                  <div style={styles.imageEditSection}>
                    <button 
                      onClick={() => setIsEditingImage(!isEditingImage)}
                      style={styles.editButton}
                    >
                      {isEditingImage ? 'Cancel' : 'Change Profile Picture'}
                    </button>

                    {isEditingImage && (
                      <div style={styles.uploadSection}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          style={styles.fileInput}
                          id="imageInput"
                        />
                        <label htmlFor="imageInput" style={styles.fileInputLabel}>
                          Select Image
                        </label>
                        
                        {imagePreview && (
                          <>
                            <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                            <button onClick={handleImageUpload} style={styles.uploadButton}>
                              Upload
                            </button>
                          </>
                        )}
                        
                        {uploadError && <div style={styles.error}>{uploadError}</div>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={styles.infoSection}>
                <h3 style={styles.sectionTitle}>Personal Information</h3>
                <p>
                  <span style={styles.infoLabel}>Username: </span>
                  <span style={styles.infoText}>{user.username}</span>
                </p>
                <p>
                  <span style={styles.infoLabel}>Email: </span>
                  <span style={styles.infoText}>{user.email}</span>
                </p>
                <p>
                  <span style={styles.infoLabel}>First Name: </span>
                  <span style={styles.infoText}>{user.firstName}</span>
                </p>
                <p>
                  <span style={styles.infoLabel}>Last Name: </span>
                  <span style={styles.infoText}>{user.lastName}</span>
                </p>
              </div>

              <div style={styles.infoSection}>
                <h3 style={styles.sectionTitle}>Account Details</h3>
                <p>
                  <span style={styles.infoLabel}>Role: </span>
                  <span style={styles.infoText}>{user.role}</span>
                </p>
                <p>
                  <span style={styles.infoLabel}>Member since: </span>
                  <span style={styles.infoText}>{new Date(user.createdAt).toLocaleString()}</span>
                </p>
                <p>
                  <span style={styles.infoLabel}>Last updated: </span>
                  <span style={styles.infoText}>{new Date(user.updatedAt).toLocaleString()}</span>
                </p>
                <p>
                  <span style={styles.infoLabel}>Total Reviews: </span>
                  <span style={styles.infoText}>{reviews.length}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ margin: '10px 0' }}>
        <div style={styles.reviewsSection}>
          <h2 style={styles.subtitle}>Recent Reviews</h2>
          {reviews.length === 0 ? (
            <p style={styles.noReviews}>No reviews yet</p>
          ) : (
            <>
              <div style={styles.reviewsList}>
                {reviews.slice(0, visibleReviews).map((review) => (
                  <div key={review._id} style={styles.reviewCard}>
                    <Link to={`/books/${review.book._id}`} style={styles.bookTitleLink}>
                      {review.book.title}
                    </Link>
                    <div style={styles.rating}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                    <p style={styles.reviewText}>{review.reviewText}</p>
                    <div style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    {loggedInUserId === userId && (
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => handleEditReview(review)} 
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(review._id)} 
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={styles.buttonContainer}>
                {reviews.length > visibleReviews && (
                  <button onClick={handleShowMore} style={styles.button}>
                    Show More Reviews
                  </button>
                )}
                {visibleReviews > 3 && (
                  <button onClick={handleShowLess} style={styles.button}>
                    Show Less Reviews
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Edit Review</h2>
            
            <div style={styles.modalContent}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Rating:</label>
                <div style={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setEditRating(star)}
                      style={{
                        ...styles.star,
                        color: star <= editRating ? '#f39c12' : '#ddd',
                        cursor: 'pointer'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Review:</label>
                <textarea
                  value={editReviewText}
                  onChange={(e) => setEditReviewText(e.target.value)}
                  style={styles.textarea}
                />
              </div>
            </div>

            <div style={styles.modalButtons}>
              <button 
                onClick={handleSaveEdit} 
                style={styles.saveButton}
              >
                Save
              </button>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
