
import React, { useState } from 'react';
import '../styles/addUser.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Adduser = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const Name = localStorage.getItem("Name");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const [formData, setFormData] = useState({
    
    MUD_USER_NAME: '',
    MUD_PASSWORD: '',
    MUD_USER_TYPE: 'Doc',
    MUD_STATUS: 'A',
    MUD_CREATED_DATE: new Date().toISOString(),
    MUD_UPDATE_DATE: new Date().toISOString(),
    MUD_USER_ID: '',
    MUD_UPDATED_BY: '',
    MUD_CREATED_BY: '',
    MUD_QUALIFICATION: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    
    // Append the image file only if it exists
    if (selectedFile) {
      formDataToSend.append('profileImage', selectedFile);
    }
  
    // Append other form data
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
  
    try {
      const response = await axios.post('https://localhost:7132/api/User', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct header
        },
      });
  
      alert('User registered successfully');
      navigate('/login');
      
      // Reset the form data
      setFormData({
        MUD_USER_NAME: '',
        MUD_PASSWORD: '',
        MUD_USER_TYPE: 'Doc',
        MUD_STATUS: 'A',
        MUD_CREATED_DATE: new Date().toISOString(),
        MUD_UPDATE_DATE: new Date().toISOString(),
        MUD_USER_ID: '',
        MUD_UPDATED_BY: Name,
        MUD_CREATED_BY: '',
        MUD_SPECIALIZATION: ''
      });
      setError('');
      setSelectedFile(null); 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };
  

  return (
    <div className="register-container">
      <div className="form-container">
        <h1 className="register-header">Register User</h1>
        <div className="image-container">
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-img"
          />
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file" className="edit-icon">&#9998;</label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                name="MUD_USER_NAME"
                value={formData.MUD_USER_NAME}
                onChange={handleChange}
                
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                name="MUD_PASSWORD"
                value={formData.MUD_PASSWORD}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>User Type</label>
              <select
                name="MUD_USER_TYPE"
                value={formData.MUD_USER_TYPE}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Admin">Admin</option>
                <option value="Doc">Doctor</option>
                <option value="staff">Staff</option>
                <option value="phuser">Pharmacy user</option>
              </select>
            </div>
            <div className="input-group">
              <label>specialization</label>
              <input
                type="text"
                placeholder="Enter doctor qualification"
                name="MUD_SPECIALIZATION"
                value={formData.MUD_SPECIALIZATION}
    
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Adduser;



