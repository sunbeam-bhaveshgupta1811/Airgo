import React, { useState } from "react";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    if (!strongPassword.test(formData.newPassword)) {
      setError("Password must be 8+ chars with letters, numbers, and special chars.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccessMessage("Password changed successfully.");
      setShowSuccessModal(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-4 rounded-4">
            <h2 className="card-title text-center mb-4 text-primary fw-bold">
              Change Password
            </h2>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger rounded-3">{error}</div>
              )}

              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">
                  Current Password
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <div className="form-text text-muted">
                  Password must be 8+ chars with letters, numbers, and special
                  chars (@$!%*#?&).
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="confirmNewPassword" className="form-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="successModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white rounded-top-4">
                <h5 className="modal-title" id="successModalLabel">
                  Success!
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={handleCloseSuccessModal}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="lead fw-bold text-success">{successMessage}</p>
                <p className="text-muted">
                  You will be redirected to dashboard shortly.
                </p>
              </div>
              <div className="modal-footer justify-content-center border-top-0">
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 py-2"
                  onClick={handleCloseSuccessModal}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Backdrop */}
      {showSuccessModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default ChangePassword;
