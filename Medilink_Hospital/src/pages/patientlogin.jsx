import React, { useState } from "react";
import axios from "axios";
import '../styles/patientlogin.css';
import { useNavigate } from "react-router-dom";

export default function Patientlogin() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7132/api/AppoinmentLogin/Login', {
        email: email,
        password: password,
      });

      console.log(response.data);
      alert('Login successful');
      localStorage.setItem('Token', response.data.Token);
      localStorage.setItem('Email', response.data.Email);
      localStorage.setItem('isLoggedIn', true);
      
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Login failed. Please try again.');
    }
  };

  const handleCancel = () => {
    setEmail(""); // Clear email input
    setPassword(""); // Clear password input
  };

  return (
    <div className="login-wrapper">
      <div className="login-container-patient">
        <h1>Patient Login</h1>
        <label>Email</label>
        <input
          type="text"
          placeholder="Please enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <button onClick={handleLogin}>Login</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
        <p>Don't have an account? <a href="/register-user">Create One</a></p>
      </div>
    </div>
  );
}
