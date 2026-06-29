import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfileData, updateProfileData, uploadProfileImage } from '../services/admin/AdminProfile';

const Profile = () => {
  const [user, setUser] = useState({});
  const [originalUser, setOriginalUser] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
      return;
    }

    setIsUploading(true);
    try {
      const updatedUser = await uploadProfileImage(file);
      if (updatedUser) {
        setUser(updatedUser);
        setOriginalUser(updatedUser);
        toast.success('Profile photo updated!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await updateProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        title: user.title,
        dob: user.dob || null,
      });
      if (updatedUser) {
        setUser(updatedUser);
        setOriginalUser(updatedUser);
      }
      setIsEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUser({ ...originalUser });
    setIsEditMode(false);
  };

  const profileFetch = async () => {
    try {
      const data = await getProfileData();
      if (data) {
        setUser(data);
        setOriginalUser(data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch profile data');
    }
  };

  useEffect(() => { profileFetch(); }, []);

  const avatarUrl = user.profileImageUrl
    || `https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || '') + ' ' + (user.lastName || ''))}&background=667eea&color=fff&size=200`;

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
                    <h2 className="mb-1 text-white fw-bold">My Profile</h2>
                    <p className="mb-0 text-white-50">Manage your personal information</p>
                  </div>
                  <button
                    className={`btn btn-sm px-4 py-2 fw-medium ${isEditMode ? 'btn-light text-primary' : 'btn-outline-light border-2'}`}
                    onClick={() => setIsEditMode(!isEditMode)}
                    style={{ borderRadius: '25px' }}
                    disabled={isLoading}
                  >
                    {isEditMode ? 'Cancel' : 'Edit Profile'}
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
                {/* Left: Avatar */}
                <div className="col-12 col-md-4 text-center mb-4 mb-md-0">
                  <div className="position-relative d-inline-block" style={{ width: 200, height: 200, margin: '0 auto' }}>
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="rounded-circle border shadow-lg"
                      style={{ width: 200, height: 200, objectFit: 'cover', borderWidth: '6px', borderColor: '#fff' }}
                    />
                    <div className="position-absolute bg-success border border-white rounded-circle"
                      style={{ width: 24, height: 24, bottom: 20, right: 20, borderWidth: '3px' }}></div>

                    {isEditMode && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="bg-dark bg-opacity-75 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 200, height: 200 }}>
                          <input type="file" id="profileImageInput" className="d-none" accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageChange} />
                          <label htmlFor="profileImageInput" className="btn btn-light rounded-pill px-4 py-2 fw-medium m-0" style={{ cursor: 'pointer' }}>
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditMode && (
                    <div className="mt-3">
                      <h4 className="fw-bold text-primary mb-1">
                        {user.title ? `${user.title} ` : ''}{user.firstName} {user.lastName}
                      </h4>
                      <p className="text-muted mb-2">{user.email}</p>
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">Verified Account</span>
                    </div>
                  )}
                </div>

                {/* Right: Form */}
                <div className="col-12 col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      {/* Title + First Name */}
                      <div className="col-12">
                        <div className="row g-3">
                          <div className="col-auto">
                            <label className="form-label fw-medium text-muted small">TITLE</label>
                            {isEditMode ? (
                              <select className="form-select" name="title" value={user.title || ''} onChange={handleChange}
                                style={{ borderRadius: 12 }}>
                                <option value="">Select</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Prof.">Prof.</option>
                              </select>
                            ) : (
                              <div className="form-control-plaintext fw-medium">{user.title || 'Not set'}</div>
                            )}
                          </div>
                          <div className="col">
                            <label className="form-label fw-medium text-muted small">FIRST NAME</label>
                            {isEditMode ? (
                              <input type="text" className="form-control" name="firstName" value={user.firstName || ''}
                                onChange={handleChange} style={{ borderRadius: 12 }} required />
                            ) : (
                              <div className="form-control-plaintext fw-medium">{user.firstName}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">LAST NAME</label>
                        {isEditMode ? (
                          <input type="text" className="form-control" name="lastName" value={user.lastName || ''}
                            onChange={handleChange} style={{ borderRadius: 12 }} required />
                        ) : (
                          <div className="form-control-plaintext fw-medium">{user.lastName}</div>
                        )}
                      </div>

                      {/* Email (read-only) */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">EMAIL ADDRESS</label>
                        <div className="form-control-plaintext fw-medium border bg-light" style={{ borderRadius: 12 }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Mobile Number — uses "phone" to match backend */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">MOBILE NUMBER</label>
                        {isEditMode ? (
                          <input type="tel" className="form-control" name="phone" value={user.phone || ''}
                            onChange={handleChange} placeholder="+91XXXXXXXXXX" style={{ borderRadius: 12 }} />
                        ) : (
                          <div className="form-control-plaintext fw-medium">
                            {user.phone || 'Not provided'}
                          </div>
                        )}
                      </div>

                      {/* Date of Birth — uses "dob" to match backend */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted small">DATE OF BIRTH</label>
                        {isEditMode ? (
                          <input type="date" className="form-control" name="dob" value={user.dob || ''}
                            onChange={handleChange} style={{ borderRadius: 12 }} />
                        ) : (
                          <div className="form-control-plaintext fw-medium">
                            {user.dob
                              ? new Date(user.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                              : 'Not provided'}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditMode && (
                      <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end mt-5 pt-4 border-top">
                        <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={handleCancel}
                          disabled={isLoading} style={{ borderRadius: 25 }}>
                          Discard Changes
                        </button>
                        <button type="submit" className="btn btn-primary px-4 py-2" disabled={isLoading} style={{ borderRadius: 25 }}>
                          {isLoading ? 'Saving...' : 'Save Profile'}
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

      <style>{`
        .form-control, .form-select { border: 2px solid #e9ecef; transition: all 0.3s ease; }
        .form-control:focus, .form-select:focus { border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102,126,234,0.25); }
        .form-control-plaintext { padding: 0.75rem 1rem; background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 12px; min-height: calc(2.875rem + 2px); }
        .input-group-text { border: 2px solid #e9ecef; background-color: #f8f9fa; }
        @media (max-width: 768px) { .card-body { padding: 2rem 1.5rem !important; } }
      `}</style>
    </div>
  );
};

export default Profile;
