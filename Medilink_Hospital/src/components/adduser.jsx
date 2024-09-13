import React, { useState } from 'react';
import axios from 'axios';
import '../styles/addUser.css';
import { useNavigate } from 'react-router-dom';

export default function Adduser() {
    const [formData, setFormData] = useState({
        MUD_USER_NAME: '',
        MUD_PASSWORD: '',
        MUD_USER_TYPE: 'Doc',
        MUD_STATUS: 'A',
        MUD_CREATED_DATE: new Date().toISOString(),
        MUD_UPDATE_DATE: new Date().toISOString(),
        MUD_USER_ID: '',
        MUD_UPDATED_BY: '',
        MUD_CREATED_BY: ''
    });

    const navigate=useNavigate("");

    const [error, setError] = useState('');
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7132/api/User', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert("User registered successfully");
            navigate("/");
            setFormData({
                MUD_USER_NAME: '',
                MUD_PASSWORD: '',
                MUD_USER_TYPE: 'Doc',
                MUD_STATUS: 'A',
                MUD_CREATED_DATE: new Date().toISOString(),
                MUD_UPDATE_DATE: new Date().toISOString(),
                MUD_USER_ID: '',
                MUD_UPDATED_BY: '',
                MUD_CREATED_BY: ''
            });
            setError('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                setError(errorMessages);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="main-container">
            <div className="register-user-container">
                <form onSubmit={handleSubmit} className="user-form">
                    <h1>Register User</h1>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="MUD_USER_NAME"
                            placeholder="Enter username"
                            value={formData.MUD_USER_NAME}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="MUD_PASSWORD"
                            placeholder="Enter password"
                            value={formData.MUD_PASSWORD}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">User Type</label>
                        <select
                            name="MUD_USER_TYPE"
                            value={formData.MUD_USER_TYPE}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="Doc">Doctor</option>
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>

                    <input type="submit" value="Register" className="form-submit-button" />
                    
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}
