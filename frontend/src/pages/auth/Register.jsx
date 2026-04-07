import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth/user";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Register.css";

function Register() {
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");

  const navigate = useNavigate();

  const onRegister = async () => {
    if (firstName.length === 0) {
      toast.warn("Please enter first name");
    } else if (lastName.length === 0) {
      toast.warn("Please enter last name");
    } else if (email.length === 0) {
      toast.warn("Please enter email");
    } else if (phone.length === 0) {
      toast.warn("Please enter phone number");
    } else if (password.length === 0) {
      toast.warn("Please enter password");
    } else if (confirmPassword.length === 0) {
      toast.warn("Please confirm password");
    } else if (password !== confirmPassword) {
      toast.warn("Password does not match");
    } else {
      const result = await registerUser(
        title,
        firstName,
        lastName,
        email,
        phone,
        password,
        role
      );
      console.log(result);
      if (result.success) {
        setRole("USER");
        toast.success("Successfully registered");
        toast.info("Please verify your email before logging in.");
        navigate("/");
      } else {
        if (result.status === 409) {
          toast.error("Email already exists. Please login..");
        } else {
          toast.error(result.message || "Error while registering the user");
        }
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-header">Signup</h1>

        <div className="register-form">
          <div className="form-group">
            <label>Title</label>
            <select
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            >
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              className="form-control"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={onRegister} className="signup-button">
            Signup Now
          </button>

          <div className="login-link">
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/login", { replace: true })}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
