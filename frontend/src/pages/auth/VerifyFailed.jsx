import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Login.css"
import Login from './../admin/auth/Login';

function VerifyFailedPage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="form_container">
        <h2>Verification Failed</h2>
        <p>
          Sorry, we could not verify your account. The link may be invalid or expired.
        </p>
        <button className="button" onClick={goToLogin}>
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default VerifyFailedPage;
