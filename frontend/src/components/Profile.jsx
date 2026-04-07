import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getProfileData } from '../services/AdminServices/AdminProfile';
const Profile = () => {
  const [user, setUser] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditMode(false);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const profileFetch = async() =>{
    const data = await getProfileData();
    if (data) {
      setUser(data);
    }
    else {
      toast.error('Failed to fetch profile data');
    }
  };

  useEffect(() => {
    profileFetch()
  }, []);


  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="position-relative">
              <div 
                className="card-header py-4 px-4" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '20px 20px 0 0'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="mb-1 text-white fw-bold">
                      <i className="bi bi-person-circle me-2"></i>
                      My Profile
                    </h2>
                    <p className="mb-0 text-white-50">Manage your personal information</p>
                  </div>
                  <button 
                    className={`btn btn-sm px-4 py-2 fw-medium ${
                      isEditMode 
                        ? 'btn-light text-primary' 
                        : 'btn-outline-light border-2'
                    }`}
                    onClick={() => setIsEditMode(!isEditMode)}
                    style={{ borderRadius: '25px' }}
                    disabled={isLoading}
                  >
                    {isEditMode ? (
                      <>
                        <i className="bi bi-x-circle me-2"></i> Cancel
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pencil-square me-2"></i> Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div 
                className="position-absolute bottom-0 start-0 w-100" 
                style={{ 
                  height: '20px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)'
                }}
              ></div>
            </div>

            <div className="card-body p-5">
              <div className="row align-items-start">
                <div className="col-12 col-md-4 text-center mb-4 mb-md-0">
                  <div className="position-relative d-inline-block">
                    <div 
                      className="position-relative" 
                      style={{ 
                        width: '200px', 
                        height: '200px',
                        margin: '0 auto'
                      }}
                    >
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="rounded-circle border shadow-lg"
                        style={{ 
                          width: '200px', 
                          height: '200px', 
                          objectFit: 'cover',
                          borderWidth: '6px !important',
                          borderColor: '#fff'
                        }}
                      />
                      <div 
                        className="position-absolute bg-success border border-white rounded-circle"
                        style={{ 
                          width: '24px', 
                          height: '24px',
                          bottom: '20px',
                          right: '20px',
                          borderWidth: '3px !important'
                        }}
                      ></div>
                      
                      {isEditMode && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                          <div 
                            className="bg-dark bg-opacity-75 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '200px', height: '200px' }}
                          >
                            <input
                              type="file"
                              id="profileImageInput"
                              className="d-none"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <label 
                              htmlFor="profileImageInput" 
                              className="btn btn-light rounded-pill px-4 py-2 fw-medium m-0"
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="bi bi-camera me-2"></i>
                              Change Photo
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!isEditMode && (
                    <div className="mt-3">
                      <h4 className="fw-bold text-primary mb-1">
                        {user.title} {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-muted mb-2">
                        <i className="bi bi-envelope me-2"></i>
                        {user.email}
                      </p>
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Verified Account
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="row g-3">
                          <div className="col-auto">
                            <label className="form-label fw-medium text-muted small">TITLE</label>
                            {isEditMode ? (
                              <select
                                className="form-select"
                                name="title"
                                value={user.title}
                                onChange={handleChange}
                                style={{ borderRadius: '12px' }}
                              >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Prof.">Prof.</option>
                              </select>
                            ) : (
                              <div className="form-control-plaintext fw-medium">{user.title}</div>
                            )}
                          </div>
                          <div className="col">
                            <label className="form-label fw-medium text-muted small">FIRST NAME</label>
                            {isEditMode ? (
                              <input
                                type="text"
                                className="form-control"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                style={{ borderRadius: '12px' }}
                                required
                              />
                            ) : (
                              <div className="form-control-plaintext fw-medium">{user.firstName}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">LAST NAME</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleChange}
                            style={{ borderRadius: '12px' }}
                            required
                          />
                        ) : (
                          <div className="form-control-plaintext fw-medium">{user.lastName}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">EMAIL ADDRESS</label>
                        <div className="input-group">
                          <div className="form-control-plaintext fw-medium border border bg-light" style={{ borderRadius: '12px 12px 12px 12px' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">MOBILE NUMBER</label>
                        {isEditMode ? (
                          <div className="input-group">
                            <span className="input-group-text" style={{ borderRadius: '12px 0 0 12px' }}>
                              <i className="bi bi-telephone"></i>
                            </span>
                            <input
                              type="tel"
                              className="form-control"
                              name="mobileNo"
                              value={user.mobileNo}
                              onChange={handleChange}
                              style={{ borderRadius: '0 12px 12px 0' }}
                            />
                          </div>
                        ) : (
                          <div className="form-control-plaintext fw-medium">
                            <i className="bi bi-telephone me-2 text-muted"></i>
                            {user.mobileNo}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">DATE OF BIRTH</label>
                        {isEditMode ? (
                          <input
                            type="date"
                            className="form-control"
                            name="dob"
                            value={user.dob}
                            onChange={handleChange}
                            style={{ borderRadius: '12px' }}
                          />
                        ) : (
                          <div className="form-control-plaintext fw-medium">
                            <i className="bi bi-calendar me-2 text-muted"></i>
                            {new Date(user.dob).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditMode && (
                      <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end mt-5 pt-4 border-top">
                        <button 
                          type="button"
                          className="btn btn-outline-secondary px-4 py-2"
                          onClick={handleCancel}
                          disabled={isLoading}
                          style={{ borderRadius: '25px' }}
                        >
                          <i className="bi bi-x-lg me-2"></i>
                          Discard Changes
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary px-4 py-2"
                          disabled={isLoading}
                          style={{ borderRadius: '25px' }}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-lg me-2"></i>
                              Save Profile
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shadow-lg {
          box-shadow: 0 0.5rem 2rem rgba(0,0,0,.1) !important;
        }
        
        .form-control, .form-select {
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .form-control-plaintext {
          padding: 0.75rem 1rem;
          background-color: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          min-height: calc(2.875rem + 2px);
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        .input-group-text {
          border: 2px solid #e9ecef;
          background-color: #f8f9fa;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .card-body {
            padding: 2rem 1.5rem !important;
          }
          
          .profile-image-wrapper {
            width: 150px !important;
            height: 150px !important;
          }import { useEffect } from 'react';

        }
      `}</style>
    </div>
  );
};

export default Profile;